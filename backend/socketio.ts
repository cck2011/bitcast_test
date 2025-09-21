import socketIO, { Socket } from "socket.io";
import { ChatMessageWithSuccess } from "./controller/liveStreamController";

export let io: socketIO.Server;

export function setSocketIO(io: socketIO.Server) {
    io.on("connection", (socket: Socket) => {
        socket.on("joinRoom", (room: number) => {
            socket.join(room.toString());
        });
        socket.on("render", (Arr: number[]) => {
            let room = Arr[0];
            let productId = Arr[1];
            io.sockets.in(room.toString()).emit("render", productId);
        });
        socket.on("startBid", (room: number) => {
            io.sockets.in(room.toString()).emit("startBid", room);
        });
        socket.on("updateCurrentPrice", (room: number, isEnded: boolean) => {
            io.sockets
                .in(room.toString())
                .emit("updateCurrentPrice", room, isEnded);
        });
        socket.on("updateCurrentPriceFail", (code: number) => {
            socket.emit("updateCurrentPriceFail", code);
        });
        socket.on(
            "sendMessage",
            (room: number, message: ChatMessageWithSuccess) => {
                io.sockets.in(room.toString()).emit("sendMessage", message);
            }
        );
        socket.on("checkOnlineUsers", (room: number) => {
            let clientsInRoom = 0;
            if (io.sockets.adapter.rooms.has(room.toString())) {
                clientsInRoom = io.sockets.adapter.rooms.get(
                    room.toString()
                )!.size;
            }
            socket.emit("checkOnlineUsers", clientsInRoom);
        });
        socket.on("starOnClick", (room: number) => {
            io.sockets.in(room.toString()).emit("starOnClick");
        });
        socket.on("heartOnClick", (room: number) => {
            io.sockets.in(room.toString()).emit("heartOnClick");
        });

        socket.on("disconnect", () => {});
    });
}
