"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGO_SECRET = process.env.MONGO_SECRET;
module.exports = class MongoManager {
    constructor(io) {
        this.io = io;
        // schema
        this.Piece = new mongoose.Schema({
            painter: String,
            title: String,
            content: String,
            likes: [String],
        });
        // model
        this.pieceModel = mongoose.model("Piece", this.Piece);
    }
    // connect to atlas mongo db server
    connect() {
        mongoose.connect(`mongodb://master:${MONGO_SECRET}@initial-cluster-shard-00-00.r2sqy.mongodb.net:27017,initial-cluster-shard-00-01.r2sqy.mongodb.net:27017,initial-cluster-shard-00-02.r2sqy.mongodb.net:27017/drawing-game-gallery?ssl=true&replicaSet=atlas-p3n6uo-shard-0&authSource=admin&retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", () => {
            console.log("DB connected");
        });
    }
    create(title, content, painter) {
        const piece = new this.pieceModel();
        //piece.painter = painter;
        piece.title = title;
        piece.content = content;
        piece.save((err) => {
            if (err) {
                throw err;
            }
            else {
                console.log("From mongoDB - 그림이 성공적으로 저장되었습니다.");
                return true;
            }
        });
    }
    read(socket) {
        this.pieceModel.find({}, (err, data) => {
            if (err) {
                //throw err;
                return "error";
            }
            else {
                socket.emit("db-read", data);
            }
        });
    }
    update(socket, id, name) {
        this.pieceModel.findOne({ _id: id }, (err, piece) => {
            if (err) {
                socket.emit("db-update", false);
            }
            else {
                const flag = piece.likes.indexOf(name);
                console.log(flag);
                if (flag !== -1) {
                    socket.emit("db-update", false);
                    return;
                }
                piece.likes.push(name);
                piece.save((err) => {
                    if (err) {
                        socket.emit("db-update", false);
                    }
                    else {
                        socket.emit("db-update", true);
                    }
                });
            }
        });
    }
    delete(socket, id) {
        this.pieceModel.deleteOne({ _id: id }, (err, result) => {
            if (err) {
                socket.emit("db-delete", false);
            }
            else {
                console.log(result);
                console.log("삭제완료");
                socket.emit("db-delete", true);
            }
        });
    }
};
