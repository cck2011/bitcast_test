import express from "express";

// import { isLoggedIn } from "./guard";
import http from "http";
import { Server as SocketIO } from "socket.io";
import { setSocketIO } from "./socketio";
import { logger } from "./logger";

import userRoutes from "./router/userRoutes";
// import { dummyCounter, pageNotFound, requestLogger } from "./middlewares";
import { env } from "./env";
import { UserController } from "./controller/userController";
import { UserService } from "./service/userService";
import { knex } from "./db";
import cors from "cors";
// import { isLoggedIn } from "./guard";
import path from "path";

// import { hashPassword, } from './hash';
import { pageNotFound } from "./middlewares";
import { LiveStreamController } from "./controller/liveStreamController";
import { LiveStreamService } from "./service/liveStreamService";
import liveStreamRoutes from "./router/liveStreamRoutes";
import productsRoutes from "./router/productsRoutes";
import { ProductsService } from "./service/productsService";
import { ProductsController } from "./controller/productsController";
import { comingAuctionRoutes } from "./router/comingAuctionRoutes";
import { ComingAuctionController } from "./controller/comingAuctionController";
import { ComingAuctionService } from "./service/comingAuctionService";
import { MyLiveController } from "./controller/myLiveController";
import { MyLiveService } from "./service/myLiveService";
import { myLiveRoutes } from "./router/myLiveRoutes";
import telegramRoutes from "./router/telegramRoutes";
import { TelegramController } from "./controller/telegramController";
import { TelegramService } from "./service/telegramService";
import { categoriesRoutes } from "./router/categoriesRoutes";
import { CategoriesController } from "./controller/categoriesController";
import { CategoriesService } from "./service/categoriesService";

// import { hashPassword, } from './hash';

/////////////////////  Set up
export const app = express();
const server = new http.Server(app);
const io = new SocketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL!,
        methods: ["GET", "POST", "PUT", "DEL"],
    },
});

setSocketIO(io);

//Print path middleware
app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.log(req.method, req.path);
        next();
    }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    cors({
        origin: [process.env.FRONTEND_URL!],
    })
);

app.set("trust proxy", 1);
export const userController = new UserController(new UserService(knex));
export const liveStreamController = new LiveStreamController(
    new LiveStreamService(knex)
);
export const productsController = new ProductsController(
    new ProductsService(knex)
);
export const telegramController = new TelegramController(
    new TelegramService(knex)
);
export const comingAuctionController = new ComingAuctionController(
    new ComingAuctionService(knex)
);
export const myLiveController = new MyLiveController(new MyLiveService(knex));
export const categoriesController = new CategoriesController(
    new CategoriesService(knex)
);

// app.use(requestLogger, dummyCounter);
app.use(userRoutes);
app.use(telegramRoutes);
app.use(liveStreamRoutes);
app.use(productsRoutes);
app.use(comingAuctionRoutes);
app.use(express.static("img"));
app.use(myLiveRoutes);
app.use(categoriesRoutes);
app.get("/profile", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "public", "404.html"));
});
app.use(express.static("public"));
app.use(express.static("public", { extensions: ["html"] }));
app.use(express.static("css"));
app.use(express.static("usersProfile"));
app.use(express.static("submitLivePicture"));
app.use(express.static("submitProductsPicture"));
app.use(express.static("logos"));
app.use(express.static("uploads"));
app.get(
    "/profile/:alias/:number_tag",
    (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, "public", "profile.html"));
    }
);

// app.use(isLoggedIn, express.static("protected"));

// app.use(express.static("uploads"));
app.use(pageNotFound);

const PORT = env.PORT;

server.listen(PORT, () => {
    logger.info(`Server準備好喇： http://localhost:${PORT}/`);
});
