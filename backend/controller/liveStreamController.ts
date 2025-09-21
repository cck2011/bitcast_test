import { LiveStreamService } from "../service/liveStreamService";
import { Request, Response } from "express";

export interface LiveStreamProduct {
    id: number;
    productName: string;
    minPrice: number;
    currentPrice: number;
    buyPrice: number;
    bidIncrement: number;
    buyer: string;
    productImage: string;
    isSelected: boolean;
    countdownStartTime?: Date;
    countdownEndTime?: Date;
    duration: number;
    description: string;
}

export interface ChatMessage {
    id: number;
    username: string;
    profilePic: string;
    message: string;
    created_at: Date;
}

export interface ChatMessageWithSuccess {
    id: number;
    username: string;
    profilePic: string;
    message: string;
    created_at: Date;
    success: boolean;
}

export class LiveStreamController {
    constructor(private liveStreamService: LiveStreamService) {}

    getRoom = async (req: Request, res: Response) => {
        try {
            const token = req.query.token as string;

            const room = await this.liveStreamService.getRoom(token);
            res.json({ room });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };

    getInfo = async (req: Request, res: Response) => {
        try {
            const room = req.query.room as string;
            const token = req.query.token as string;
            if (room === "" && token === "") {
                res.json({ success: false });
                return;
            }

            const result = await this.liveStreamService.getInfo(room, token);

            interface LiveStreamInfo {
                id: number;
                title: string;
                seller: string;
                sellerId: number;
                sellerImage: string;
                currentViewers: number;
                thumbnail: string;
                description: string;
                success: boolean;
            }

            const response: LiveStreamInfo = {
                id: result.id,
                title: result.title,
                seller: result.seller,
                sellerId: result.sellerId,
                sellerImage: result.sellerImage,
                currentViewers: result.currentViewers,
                thumbnail: result.thumbnail,
                description: result.description,
                success: result.id === -1 ? false : true,
            };

            res.json(response);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };

    getProducts = async (req: Request, res: Response) => {
        try {
            const liveId = parseInt(req.query.liveId as string);

            if (liveId < 0) {
                const response: {
                    liveStreamProducts: LiveStreamProduct[];
                    success: boolean;
                } = { liveStreamProducts: [], success: false };
                res.json(response);
                return;
            }

            const results = await this.liveStreamService.getProducts(liveId);

            const response: {
                liveStreamProducts: LiveStreamProduct[];
                success: boolean;
            } = { liveStreamProducts: results, success: true };

            res.json(response);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };

    getMessages = async (req: Request, res: Response) => {
        try {
            const liveId = parseInt(req.query.liveId as string);

            if (liveId < 0) {
                const response: {
                    chatMessages: ChatMessage[];
                    success: boolean;
                } = { chatMessages: [], success: false };
                res.json(response);
                return;
            }

            const results = await this.liveStreamService.getMessages(liveId);

            const response: {
                chatMessages: ChatMessage[];
                success: boolean;
            } = { chatMessages: results, success: true };

            res.json(response);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };

    postMessage = async (req: Request, res: Response) => {
        try {
            const { liveId, message } = req.body;
            const userId = req.user && req.user.id ? req.user.id : 0;
            if (liveId < 0) {
                const response: {
                    chatMessages: ChatMessage[];
                    success: boolean;
                } = { chatMessages: [], success: false };
                res.json(response);
                return;
            }

            const results = await this.liveStreamService.postMessage(
                liveId,
                userId,
                message
            );

            const response: ChatMessageWithSuccess = {
                ...results,
                success: true,
            };

            res.json(response);
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };

    getOtherLives = async (req: Request, res: Response) => {
        try {
            const category = req.query.category as string;
            const liveId = req.query.liveId as string;
            const categoryIds = String(category);
            const categoryIdArr = categoryIds
                .split(",")
                .map((item) => parseInt(item));

            const results = await this.liveStreamService.getOtherLives(
                parseInt(liveId),
                categoryIdArr
            );

            res.json({ results, success: true });
        } catch (e) {
            console.log(e);
            res.json(e);
        }
    };
}
