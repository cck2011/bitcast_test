import { Configuration } from "ion-sdk-js/lib/client.d";

export const config: Configuration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
        // {
        //     urls: "turn:turn.ctosan.xyz:3478",
        //     username: "hello",
        //     credential: "world",
        // },
        {
            urls: "turn:turn.bidcast.online:3478",
            username: "hello",
            credential: "world",
        },
    ],
    codec: "h264",
};

export const webSocketIP = "wss://ws.bidcast.online/ws";

export const webSocketIPBackup = "wss://ws.ctosan.xyz/ws";
