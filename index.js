const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const {constants} = require("./env");

const app = express();
const socket = require("socket.io");

app.use(cors("*"));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose.connect(constants.MONGO_URL, {}).then(() => {
    console.log("DB connection successfull");
}).catch((err) => {
    console.log(err.message);
});

const server = app.listen(constants.SERVER_PORT, '0.0.0.0', () => {
    console.log(`server started on ${constants.SERVER_PORT}...`);
});

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });
});