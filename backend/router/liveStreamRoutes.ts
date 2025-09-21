import express from "express";
import { isLoggedIn } from "../guard";
import { liveStreamController } from "../server";

const liveStreamRoutes = express.Router();

liveStreamRoutes.get("/room", (req, res) =>
    liveStreamController.getRoom(req, res)
);
liveStreamRoutes.get("/liveStream/info", (req, res) =>
    liveStreamController.getInfo(req, res)
);
liveStreamRoutes.get("/liveStream/products", (req, res) =>
    liveStreamController.getProducts(req, res)
);
liveStreamRoutes.get("/liveStream/chatMessage", (req, res) =>
    liveStreamController.getMessages(req, res)
);
liveStreamRoutes.post("/liveStream/chatMessage", isLoggedIn, (req, res) =>
    liveStreamController.postMessage(req, res)
);
liveStreamRoutes.get("/liveStream/otherLives", (req, res) =>
    liveStreamController.getOtherLives(req, res)
);

export default liveStreamRoutes;
