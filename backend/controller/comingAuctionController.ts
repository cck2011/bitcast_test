import { Request, Response } from "express";
import { ComingAuctionService } from "../service/comingAuctionService";

export class ComingAuctionController {
    constructor(private comingAuctionService: ComingAuctionService) { }

    getComingAuction = async (req: Request, res: Response) => {
        try {
            const result = await this.comingAuctionService.getComingAuction()
            res.json(result)
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller get coming auction fail" },
                error: new Error("get coming auction fail"),
            })
        }
    }

    getBroadcasting = async (req: Request, res: Response) => {
        try {
            const result = await this.comingAuctionService.getBroadcasting()
            res.json(result)
        } catch (error) {
            res.json({

                success: false,
                data: { msg: "controller get broadcasting products fail" },
                error: new Error("get broadcasting products fail"),
            })
        }
    }

    getProductDetails = async (req: Request, res: Response) => {
        try {
            const result = await this.comingAuctionService.getProductDetails()

            // console.log(result.data.results.rows[0]);

            res.json(result)
        } catch (error) {
            console.log(error);
        }
    }
}