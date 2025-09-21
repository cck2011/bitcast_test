import express from "express"
import { comingAuctionController } from "../server"

export const comingAuctionRoutes = express.Router()

comingAuctionRoutes.get("/comingAuction", (req, res) =>
    comingAuctionController.getComingAuction(req, res)
)

comingAuctionRoutes.get("/broadcastingProduct", (req, res) =>
    comingAuctionController.getBroadcasting(req, res)
)

comingAuctionRoutes.get("/product/details", (req, res) =>
    comingAuctionController.getProductDetails(req, res)
)