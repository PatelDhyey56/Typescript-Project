import { instrument } from "@socket.io/admin-ui";
import { Server } from "socket.io";
import { httpServer } from "..";

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

let SocketInfo = {
  brodCastLimit: 10000,
};

let peoplesTalk: {
  id: number;
  name: string;
  messages: string;
}[] = [];

let GroupInfo: {
  id: number;
  name: string;
  messages: { msg?: string; time?: Date }[];
  createdAt: Date;
}[] = [];

let GroupMessages: { messages?: string; time?: Date }[] = [];

//? use for Authentication of Globle Io
// io.engine.use((req: Request, res: Response, next: NextFunction) => {
//   const isHandshake = req.query?.sid === undefined;
//   if (!isHandshake) return next();

//   const header = req.headers["authorization"];

//   if (!header) return next(new Error("no token"));

//   if (!header.startsWith("bearer ")) return next(new Error("invalid token"));
// });

const chat = io.of("chat");
const group = io.of("group");

//? Middleware of chat namespace
// chat.use(async (socket, next) => {
//   console.log("Authntication of User!");

//   let authorization = socket.handshake.auth?.token;
//   console.log(authorization, !authorization);
//   if (!authorization) return next(new Error("Error"));

//   let user = "hii";
//   socket.data.user = user;
//   console.log(socket.data.user);
//   next();
// });

chat.on("connection", (socket) => {
  console.log("User connected to Talk with id:", socket.id);

  //? Middleware of after connectin of socket for chat
  socket.use(([event, ...args], next) => {
    console.log(event, args);
    args.forEach(
      (e) => e.length > 100 && next(new Error("Enter Valid Length of chat!!!"))
    );
  });
  socket.on("error", (err) => {
    if (err) {
      console.log(err);
      socket.disconnect();
    }
  });
  socket.join(`Room`);

  socket.on("msg1", (name: string, msg: string) => {
    peoplesTalk.push({ id: 1, name, messages: msg });
    chat.emit("msgList", peoplesTalk);
  });

  socket.on("msg2", (name: string, msg: string) => {
    peoplesTalk.push({ id: 2, name, messages: msg });
    chat.emit("msgList", peoplesTalk);
  });

  socket.on("typing", function (id: string) {
    socket.broadcast.emit(`User ${peoplesTalk[+id - 1].name} is typing....`);
  });

  socket.on("disconnect", () =>
    console.log("User Dis-Connected with id:", socket.id)
  );
});

group.on("connection", (socket) => {
  console.log("User Join in Group with id:", socket.id);

  socket.on("AddMember", (name: string) => {
    socket.join(`Group`);
    GroupInfo.push({
      id: GroupInfo.length,
      name,
      messages: [],
      createdAt: new Date(),
    });
    GroupMessages.unshift({ messages: `${name} Added...`, time: new Date() });
    group.emit("Group-newMessage", "Member Added...", GroupInfo);
  });

  socket.on("GroupMessage", (id: number, msg: string) => {
    id = +id - 1;
    try {
      GroupInfo[id].messages.push({ msg, time: new Date() });
      GroupMessages.unshift({
        messages: msg,
        time: new Date(),
      });
      group.emit("Group-newMessage", GroupMessages.reverse());
    } catch (e) {
      socket.disconnect();
    }
  });

  socket.on("typing", function (id: string) {
    socket.broadcast.emit(
      "typing",
      `User ${GroupInfo[+id - 1].name} is typing....`
    );
  });

  socket.on("disconnect", () =>
    console.log("User Dis-Connected with id:", socket.id)
  );
});
setTimeout(
  () => io.of("/chat").to("Room").emit("Room", "Hello All Members:)"),
  SocketInfo.brodCastLimit
);
