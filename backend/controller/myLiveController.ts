import { Request, Response } from "express";
import { MyLiveService } from "../service/myLiveService";


export class MyLiveController {
    constructor(private myLiveService: MyLiveService) { }

    getMyLive = async (req: Request, res: Response) => {
        try {
            const result = await this.myLiveService.getMyLive();
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller get my live fail" },
                error: new Error("get my live fail"),
            });
        }
    };

    getMySellHistory = async (req: Request, res: Response) => {
        try {
            const result = await this.myLiveService.getMySellHistory();
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller get my bid history fail" },
                error: new Error("get my bid history fail"),
            });
        }
    };

    getMyLiveProducts = async (req: Request, res: Response) => {
        try {
            const result = await this.myLiveService.getMyLiveProducts();
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller get my live products fail" },
                error: new Error("get my live products fail"),
            });
        }
    };

    changeLiveStatus = async (req: Request, res: Response) => {
        try {
            const { liveId } = req.body;
            const result = await this.myLiveService.changeLiveStatus(liveId);
            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "controller get live status fail" },
                error: new Error("get live status fail"),
            });
        }
    };

    openMyLive = async (req: Request, res: Response) => {
        try {
            const { myLiveId } = req.body;
            console.log("myliveID", myLiveId);

            if (myLiveId === 0) {
                res.json({
                    success: false,
                    data: { msg: "no such live" },
                });
                return;
            }

            const result = await this.myLiveService.openMyLive(
                parseInt(myLiveId)
            );

            setTimeout(async () => {
                await this.myLiveService.changeMyLiveStatus(myLiveId);
            }, 7200000);

            res.json(result);
        } catch (error) {
            res.json({
                success: false,
                data: { msg: "open my live fail" },
                error: new Error("open my live fail"),
            });
        }
    };
}
