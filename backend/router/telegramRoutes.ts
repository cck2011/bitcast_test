import express from "express";
import { telegramController } from "../server";

const telegramRoutes = express.Router();

telegramRoutes.post("/bidcast-bot/checkVerified", (req, res) =>
    telegramController.checkVerified(req, res)
);
telegramRoutes.get("/bidcast-bot/recentBuyerInfo", (req, res) =>
    telegramController.getRecentBuyerInfo(req, res)
);
telegramRoutes.get("/bidcast-bot/recentSellerInfo", (req, res) =>
    telegramController.getRecentSellerInfo(req, res)
);

export default telegramRoutes;
