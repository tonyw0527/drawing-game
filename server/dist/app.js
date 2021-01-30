"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const { randomAnsList, randomAnsListLength } = require("./assets/quizData");
const { ko_pack } = require("./utils/localization/lang_packs");
const GameManager = require("./utils/GameManager");
const MongoManager = require("./database/mongo");
const PORT = process.env.PORT;
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: true,
    origin: `https://localhost:${PORT}`,
});
const { INFO_LOGIN, INFO_BINGO, INFO_BOOK, INFO_BOOK_LIST, INFO_BOOK_EMPTY, INFO_HOST, INFO_LOGOUT, INFO_KICK, } = ko_pack;
// mongo db
const mongoManager = new MongoManager();
mongoManager.connect();
// server state
const adminName = "admin";
const adminSecret = process.env.ADMIN_SECRET;
const adminLimitTime = process.env.ADMIN_LIMIT_TIME;
let isAdminLogined = false;
let invitation_code = "love";
// game state
const gameManager = new GameManager(io);
// socket io
io.on("connection", (socket) => {
    console.log("socket connected", socket.id);
    // login
    const { id } = socket;
    socket.on("login", ({ myName, code }) => {
        const loginUserName = myName;
        const users = gameManager.getUsers();
        // inviation code checking
        if (code !== adminSecret && code !== invitation_code) {
            console.log(code);
            console.log("wrong code");
            socket.disconnect(true);
            return;
        }
        // duplicate nickname checking
        if (users.findIndex((user) => user.myName === loginUserName) > -1) {
            console.log("duplicate nickname");
            socket.disconnect(true);
            return;
        }
        const canvasImgCache = gameManager.getCanvasImgCache();
        if (canvasImgCache) {
            socket.emit("cashing image", canvasImgCache);
        }
        // admin checking
        if (code === adminSecret && loginUserName === adminName) {
            socket.emit("send msg", {
                name: "info-logout",
                msg: `From server - ${loginUserName} connected`,
            });
            socket.emit("user-list", users);
            console.log("admin logged in");
            if (isAdminLogined === true) {
                console.log("admin limit time already created");
                return;
            }
            console.log("create admin limit time");
            isAdminLogined = true;
            setTimeout(() => {
                isAdminLogined = false;
                socket.disconnect(true);
                console.log("admin login limit time end");
            }, Number(adminLimitTime));
            return;
        }
        // normal user login logic
        gameManager.handleLogin({ id, myName, isHost: false });
        const loginData = {
            name: "info-login",
            msg: `${loginUserName} ${INFO_LOGIN}`,
        };
        socket.broadcast.emit("send msg", loginData);
        socket.emit("send msg", {
            name: "info-login",
            msg: `Drawing Game에 오신걸 환영합니다!`,
        });
        setTimeout(() => {
            socket.emit("send msg", {
                name: "info-login",
                msg: `예약 버튼을 눌러 문제를 내보세요!🎨`,
            });
        }, 10);
        console.log("user logged in");
        io.emit("user-list", users);
    });
    socket.on("game-chat-login", () => {
    });
    // game logic
    socket.on("book host", (MyName) => {
        gameManager.handleBooking(MyName);
    });
    socket.on("send answer", (answerFromHost) => {
        gameManager.setAnswer(answerFromHost);
    });
    socket.on("random ans", () => {
        const random = Math.floor(Math.random() * randomAnsListLength);
        const randomAns = randomAnsList[random];
        socket.emit("random ans", randomAns);
        gameManager.setAnswer(randomAns);
    });
    // simultaneous drawing logic
    socket.on("send data", (data) => {
        socket.broadcast.emit("send data", data);
    });
    socket.on("cashing image", ({ cashingImage, type }) => {
        gameManager.setCanvasImgCache(cashingImage);
        // emit cashing image. only for restoring.
        if (type === "restoring") {
            socket.broadcast.emit("cashing image", cashingImage);
        }
    });
    socket.on("reset canvas", () => {
        socket.broadcast.emit("reset canvas");
    });
    // db logic
    socket.on("db-create", ({ title, content }) => {
        const flag = mongoManager.create(title, content);
        console.log(flag);
    });
    // chat logic
    socket.on("send msg", ({ MyName, Message }) => {
        const msgData = { name: MyName, msg: Message };
        // su command logic
        if (isAdminLogined && MyName === adminName) {
            const result = Message.split(" ");
            const right = result[0];
            const cmd = result[1];
            const arg1 = result[2];
            if (right !== "sudo") {
                socket.emit("send msg", {
                    name: "info-logout",
                    msg: "From server - You need a right.",
                });
                return;
            }
            if (cmd === "code") {
                if (arg1 === "get") {
                    socket.emit("send msg", {
                        name: "info-logout",
                        msg: `From server - Invitation Code : ${invitation_code}`,
                    });
                    return;
                }
                invitation_code = arg1;
                socket.emit("send msg", {
                    name: "info-logout",
                    msg: "From server - Code Changed Successfully.",
                });
            }
            else if (cmd === "kick") {
                const users = gameManager.getUsers();
                const flag = users.findIndex((user) => user.myName === arg1);
                if (flag === -1) {
                    socket.emit("send msg", {
                        name: "info-logout",
                        msg: "From server - There is no user like the nickname.",
                    });
                    return;
                }
                gameManager.handleLogout("kick", socket, arg1);
            }
            else if (cmd === "say") {
                result.shift();
                result.shift();
                const msg = result.join(" ");
                io.emit("send msg", { name: "info-book-list", msg: msg });
            }
            else if (cmd === "chtime") {
                gameManager.setLimitTime(arg1);
                socket.emit("send msg", {
                    name: "info-logout",
                    msg: `From server - Limit time changed to ${gameManager.getLimitTime()} Successfully.`,
                });
            }
            else if (cmd === "chstanby") {
                gameManager.setStanbyTime(arg1);
                socket.emit("send msg", {
                    name: "info-logout",
                    msg: `From server - Stanby time changed to ${gameManager.getStanbyTime()} Successfully.`,
                });
            }
        }
        else {
            const answer = gameManager.getAnswer();
            // normal msg emit
            if (Message !== answer) {
                io.emit("send msg", msgData);
            }
            // host can't submit answer
            if (MyName === gameManager.getHostUser()) {
                return;
            }
            // user can submit answer
            if (Message === answer && answer !== "") {
                gameManager.handleBingo(MyName);
            }
        }
    });
    // logout
    socket.on("disconnect", () => {
        const logoutUserName = gameManager.handleLogout(id);
        if (!logoutUserName) {
            return;
        }
        const logoutMsg = {
            name: "info-logout",
            msg: `${logoutUserName} ${INFO_LOGOUT}`,
        };
        console.log("socket disconnected");
        io.emit("send msg", logoutMsg);
        io.emit("user-list", gameManager.getUsers());
    });
    // gallaery
    socket.on("gallery-login", ({ nickName, code }) => {
        if (code === adminSecret && nickName === adminName) {
            const isAdmin = true;
            socket.emit("gallery-login", isAdmin);
        }
        else if (code !== invitation_code) {
            socket.disconnect(true);
        }
    });
    socket.on("db-read", () => {
        mongoManager.read(socket);
    });
    socket.on("db-update", ({ id, name }) => {
        mongoManager.update(socket, id, name);
    });
    socket.on("db-delete", (id) => {
        mongoManager.delete(socket, id);
    });
});
// server running
http.listen(PORT, () => {
    console.log(`server is running on ${PORT} now!`);
});
