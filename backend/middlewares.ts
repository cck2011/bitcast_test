import { Request, Response, } from "express";
// import { format } from "fecha";
import { logger } from "./logger";

export function pageNotFound(req: Request, res: Response) {
    logger.warn("錯link :", req.path);
    res.redirect("/404.html");
}