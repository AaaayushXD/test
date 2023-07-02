import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userModel } from "./models/User.js";
import pkg from "jsonwebtoken";
const Jwt = pkg;
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { WebSocketServer } from "ws";
import { MessageModel } from "./models/Message.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

async function getUserData(req) {
  return new Promise((resolve, reject) => {
    const { token } = req.cookies;

    if (token) {
      Jwt.verify(token, jwtSecret, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

app.get("/test", (req, res) => {
  res.json("test okie");
});

app.get(`/messages/:userId`, async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserData(req);
  const ourId = userData.userId;
  const messages = await MessageModel.find({
    sender: { $in: [userId, ourId] },
    recipient: { $in: [userId, ourId] },
  }).sort({ createdAt: 1 });

  res.json(messages);
});

app.get("/people", async (req, res) => {
  const users = await userModel.find({}, { _id: 1, username: 1 });
  res.json(users);
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    Jwt.verify(token, jwtSecret, (err, userData) => {
      res.json(userData);
    });
  }  else {
    throw err;
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await userModel.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      Jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await userModel.create({
      username: username,
      password: hashPassword,
    });
    Jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            _id: createdUser._id,
          });
      }
    );
  } catch (err) {
    if (err) throw err;
  }
});

// Mongoose setup
const server = app.listen(3000);
const wss = new WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  function notifyAboutOnlineUser() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlineUser();
      console.log("dead");
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  //Read username and id from cookie
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        Jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let fileName = null;
    if (file) {
      const parts = file.info.split(".");
      const fileExtension = parts[parts.length - 1];
      fileName = Date.now() + "." + fileExtension;
      const path = __dirname + "/uploads/" + fileName;
      const bufferData = Buffer.from(file.data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, () => {
        console.log("File Saved at: ", path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await MessageModel.create({
        sender: connection.userId,
        recipient,
        text,
        file: file ? fileName : null,
      });
      console.log("Created message");

      //broadcast message to all connected clients
      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? fileName : null,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  // Notify everyone about online user
  notifyAboutOnlineUser();
});
