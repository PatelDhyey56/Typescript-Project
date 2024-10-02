import { instrument } from "@socket.io/admin-ui";
import { Server } from "socket.io";
import { httpServer } from "..";

let SocketInfo = {
  brodCastLimit: 10000,
};

let peoplesTalk: {
  id: number;
  name: string;
  messages: string;
}[] = [];

const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
  mode: "development",
});

let chat = io.of("chat");
chat.on("connection", (socket) => {
  console.log("User connected with id:", socket.id);
  socket.join("Room");
  socket.on("msg1", (name: string, msg: string) => {
    peoplesTalk.push({ id: 1, name, messages: msg });
    socket.broadcast.emit("msgList", peoplesTalk);
    io.emit("msgList", peoplesTalk);
  });

  socket.on("msg2", (name: string, msg: string) => {
    peoplesTalk.push({ id: 2, name, messages: msg });
    io.emit("msgList", peoplesTalk);
  });

  // socket.broadcast.emit("msgList", peoplesTalk);
  socket.on("disconnect", () =>
    console.log("User Dis-Connected with id:", socket.id)
  );
});

setTimeout(
  () => io.to("Room").emit("Room", "Hello All Members:)"),
  SocketInfo.brodCastLimit
);
