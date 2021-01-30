export {};
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const MONGO_SECRET = process.env.MONGO_SECRET;

module.exports = class MongoManager {
  io: any;
  Piece: any;
  pieceModel: any;

  constructor(io: any) {
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
    mongoose.connect(
      `mongodb://master:${MONGO_SECRET}@initial-cluster-shard-00-00.r2sqy.mongodb.net:27017,initial-cluster-shard-00-01.r2sqy.mongodb.net:27017,initial-cluster-shard-00-02.r2sqy.mongodb.net:27017/drawing-game-gallery?ssl=true&replicaSet=atlas-p3n6uo-shard-0&authSource=admin&retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("DB connected");
    });
  }

  create(title: string, content: string, painter: string) {
    const piece = new this.pieceModel();
    //piece.painter = painter;
    piece.title = title;
    piece.content = content;

    piece.save((err: Error) => {
      if (err) {
        throw err;
      } else {
        console.log("From mongoDB - 그림이 성공적으로 저장되었습니다.");
        return true;
      }
    });
  }

  read(socket: any) {
    this.pieceModel.find({}, (err: Error, data: any) => {
      if (err) {
        //throw err;
        return "error";
      } else {
        socket.emit("db-read", data);
      }
    });
  }

  update(socket: any, id: string, name: string) {
    this.pieceModel.findOne({ _id: id }, (err: Error, piece: any) => {
      if (err) {
        socket.emit("db-update", false);
      } else {
        const flag = piece.likes.indexOf(name);
        console.log(flag);
        if (flag !== -1) {
          socket.emit("db-update", false);
          return;
        }
        piece.likes.push(name);

        piece.save((err: Error) => {
          if (err) {
            socket.emit("db-update", false);
          } else {
            socket.emit("db-update", true);
          }
        });
      }
    });
  }

  delete(socket: any, id: string) {
    this.pieceModel.deleteOne({ _id: id }, (err: Error, result: any) => {
      if (err) {
        socket.emit("db-delete", false);
      } else {
        console.log(result);
        console.log("삭제완료");

        socket.emit("db-delete", true);
      }
    });
  }
};
