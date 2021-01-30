"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ko_pack } = require('./localization/lang_packs');
const { INFO_LOGIN, INFO_BINGO, INFO_BOOK, INFO_BOOK_LIST, INFO_BOOK_EMPTY, INFO_HOST, INFO_LOGOUT, INFO_KICK } = ko_pack;
module.exports = class GameManager {
    constructor(io) {
        this.io = io;
        this.STANBY_TIME = 10;
        this.STANBY_TIME_ID = setTimeout(() => { }, 1);
        this.isStanby = false;
        this.LIMIT_TIME = 20;
        this.LIMIT_TIME_ID = setTimeout(() => { }, 1);
        ;
        this.isCounting = false;
        this.users = [];
        this.bookingList = [];
        this.bingoUsers = [];
        this.lastLogoutUser = '';
        this.hostUser = '';
        this.answer = '';
        this.canvasImgCache = '';
    }
    // users control
    handleLogin(new_user) {
        this.users.push(new_user);
        console.log('현재 유저수', this.users.length);
        console.log('현재 접속한 유저', this.users);
    }
    handleLogout(logout_id, socket, arg1) {
        let logoutUserName = '';
        if (logout_id === 'kick') {
            const index = this.users.findIndex((item) => item.myName === arg1);
            const kick_user = this.users[index];
            this.users.splice(index, 1);
            logoutUserName = kick_user.myName;
            this.io.sockets.connected[kick_user.id].disconnect();
            socket.emit('send msg', { name: 'info-logout', msg: `From server - kicked "${kick_user.myName}" from the game. / ${kick_user.id}` });
            this.io.emit('send msg', { name: 'info-logout', msg: `"${kick_user.myName}" ${INFO_KICK}` });
        }
        else {
            const index = this.users.findIndex(user => user.id === logout_id);
            if (index === -1) {
                return;
            }
            logoutUserName = this.users[index].myName;
            this.users.splice(index, 1);
            console.log('변경된 유저수', this.users.length);
        }
        this.lastLogoutUser = logoutUserName;
        const bingo_index = this.bingoUsers.indexOf(logoutUserName);
        if (bingo_index > -1) {
            this.bingoUsers.splice(bingo_index, 1);
        }
        // booking out control
        const booking_index = this.bookingList.indexOf(logoutUserName);
        if (booking_index > -1) {
            // host user check
            if (booking_index === 0) {
                console.log('까꿍');
                clearInterval(this.STANBY_TIME_ID);
                this.isStanby = false;
                this.clearTimer();
                return logoutUserName;
            }
            this.bookingList.splice(booking_index, 1);
            console.log('변경된 예약자', this.bookingList);
            // for sending firstly logout msg.
            setTimeout(() => {
                this.sendBookingList();
            }, 100);
        }
        console.log(logoutUserName);
        return logoutUserName;
    }
    // booking in control
    handleBooking(booking_user) {
        // duplicate booking check
        if (this.bookingList.indexOf(booking_user) !== -1) {
            return;
        }
        this.bookingList.push(booking_user);
        if (this.bookingList.length !== 1) {
            this.io.emit('send msg', { name: 'info-login', msg: `${booking_user} ${INFO_BOOK}` });
            this.sendBookingList();
        }
        console.log('현재 예약자', this.bookingList);
        if (!this.isCounting && !this.isStanby) {
            this.handleTurn(booking_user);
        }
    }
    handleTurn(new_user) {
        if (this.bookingList.length === 0) {
            console.log('예약자가 없습니다.');
            this.io.emit('send msg', { name: 'info-login', msg: `${INFO_BOOK_EMPTY}` });
            setTimeout(() => {
                if (this.hostUser === '' || this.lastLogoutUser === this.hostUser) {
                    this.io.emit('send msg', { name: 'info-login', msg: `예약 버튼을 눌러 문제를 내보세요!🎨` });
                }
                else {
                    this.io.emit('send msg', { name: 'info-login', msg: `예약자가 있을 때 까지 ${this.hostUser}님이 자유 출제합니다.` });
                }
            }, 100);
            console.log('현재 출제자', this.hostUser);
            return;
        }
        if (this.bookingList.length === 1) {
            this.gameStart(new_user);
        }
        else {
            this.gameStart(this.bookingList[0]);
        }
    }
    gameStart(new_host) {
        // 게임 초기화
        this.gameInit(new_host);
        // 싱글 플레이
        if (this.users.length === 1) {
            this.setTimer();
            return;
        }
        // 준비 시간
        let standby_time = this.STANBY_TIME;
        this.isStanby = true;
        setTimeout(() => {
            this.io.emit('send msg', { name: 'info-host-change', msg: `준비 시간 ${standby_time}초 뒤에 시작합니다!` });
        }, 100);
        this.STANBY_TIME_ID = setInterval(() => {
            console.log('게임 준비 시간', standby_time);
            standby_time--;
            if (standby_time === -1) {
                console.log(new_host, this.hostUser, '님이 게임을 시작합니다.');
                this.io.emit('send msg', { name: 'info-book-list', msg: `${this.hostUser} 님이 게임을 시작합니다!` });
                clearInterval(this.STANBY_TIME_ID);
                this.isStanby = false;
                // 게임 시작
                this.setTimer();
            }
        }, 1000);
    }
    gameInit(new_host) {
        // prev 처리
        if (this.hostUser !== '') {
            const prevHostIndex = this.users.findIndex(item => item.myName === this.hostUser);
            if (prevHostIndex !== -1) {
                const prevHost = this.users[prevHostIndex];
                prevHost.isHost = false;
                this.io.to(prevHost.id).emit('myTurn', false);
            }
        }
        // next 처리
        const nextUserIndex = this.users.findIndex(item => item.myName === new_host);
        const nextUser = this.users[nextUserIndex];
        nextUser.isHost = true;
        this.io.to(nextUser.id).emit('myTurn', true);
        console.log('next host - ', nextUser.id);
        this.hostUser = new_host;
        this.answer = '';
        this.io.emit('reset canvas');
        this.io.emit('user-list', this.users);
        if (this.users.length === 1 || this.bookingList.length === 1) {
            return;
        }
        setTimeout(() => {
            this.sendBookingList();
        }, 20);
    }
    clearTimer() {
        clearInterval(this.LIMIT_TIME_ID);
        this.isCounting = false;
        console.log('timeout!', this.isCounting);
        this.bingoUsers = [];
        this.bookingList.shift();
        console.log('변경된 예약자', this.bookingList);
        this.handleTurn(this.bookingList[0]);
    }
    setTimer() {
        console.log('현재 출제자', this.hostUser);
        let time = this.LIMIT_TIME;
        this.isCounting = true;
        this.LIMIT_TIME_ID = setInterval(() => {
            if (this.users.length === 1) {
                this.clearTimer();
                return;
            }
            console.log('time', time, this.isCounting);
            if (time === this.LIMIT_TIME) {
                this.io.emit('send msg', { name: 'info-book-list', msg: `제한 시간 ${time}초` });
            }
            else if (time === 60) {
                this.io.emit('send msg', { name: 'info-book-list', msg: `${time}초 남았습니다.` });
            }
            else if (time === 30) {
                this.io.emit('send msg', { name: 'info-book-list', msg: `${time}초 남았습니다.` });
            }
            else if (time < 6) {
                this.io.emit('send msg', { name: 'info-logout', msg: `남은 시간 ${time}초` });
            }
            if (this.bingoUsers.length === this.users.length - 1) {
                this.io.emit('send msg', { name: 'info-book-list', msg: `정답: ${this.answer}` });
                setTimeout(() => {
                    this.io.emit('send msg', { name: 'info-bingo-all', msg: `전원 빙고! 축하합니다!🥳` });
                    this.clearTimer();
                }, 200);
            }
            time--;
            if (time === -1) {
                this.io.emit('send msg', { name: 'info-logout', msg: `시간 초과!` });
                setTimeout(() => {
                    this.io.emit('send msg', { name: 'info-book-list', msg: `정답: ${this.answer}` });
                }, 200);
                setTimeout(() => {
                    if (this.bingoUsers.length !== 0) {
                        const list = this.bingoUsers.reduce((acc, curr) => {
                            return acc + '/ ' + curr + '😎';
                        });
                        this.io.emit('send msg', { name: 'info-bingo', msg: `맞춘 사람 ${list}` });
                    }
                    this.clearTimer();
                }, 500);
            }
        }, 1000);
    }
    handleBingo(user_name) {
        if (this.isStanby) {
            return;
        }
        this.bingoUsers.push(user_name);
        this.io.emit('send msg', { name: 'info-bingo', msg: `${user_name}님 정답입니다!🎉` });
    }
    sendBookingList() {
        if (this.bookingList.length === 0) {
            return;
        }
        const list = this.bookingList.reduce((acc, curr) => {
            return acc + '/ ' + curr;
        });
        this.io.emit('send msg', { name: 'info-book-list', msg: `${INFO_BOOK_LIST} ${list}` });
    }
    getHostUser() {
        return this.hostUser;
    }
    getUsers() {
        return this.users;
    }
    setStanbyTime(new_stanby) {
        this.STANBY_TIME = new_stanby;
    }
    getStanbyTime() {
        return this.STANBY_TIME;
    }
    setLimitTime(new_limit) {
        this.LIMIT_TIME = new_limit;
    }
    getLimitTime() {
        return this.LIMIT_TIME;
    }
    setAnswer(new_ans) {
        this.answer = new_ans;
    }
    getAnswer() {
        return this.answer;
    }
    setCanvasImgCache(new_cache) {
        this.canvasImgCache = new_cache;
    }
    getCanvasImgCache() {
        return this.canvasImgCache;
    }
};
