import express, { Request } from "express";
import multer from "multer";
import path from "path";
import { isLoggedIn } from "../guard";
import { userController } from "../server";

const userRoutes = express.Router();

//-------------------  for edit profile upload picture ---------------------//

const usersProfileStorage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, path.resolve("./usersProfile"));
    },
    filename: function (req: Request, file: any, cb: any) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`
        );
    },
});
const usersProfileUpload = multer({ storage: usersProfileStorage });
const usersProfileMulter = usersProfileUpload.single("profilePic");

// ^^^^^^^^^^^^^^^^^^ ffor edit profile upload picture  ^^^^^^^^^^^^^^^^^^^^//

userRoutes.post("/register", (req, res) => userController.register(req, res));
userRoutes.get("/user", (req, res) => userController.getUser(req, res));
userRoutes.get("/logout", (req, res) => userController.logout(req, res));
userRoutes.post("/login", (req, res) => userController.login(req, res));
userRoutes.get("/user/current", isLoggedIn, (req, res) =>
    userController.getCurrentUser(req, res)
);
userRoutes.post("/user/refreshCurrent", (req, res) =>
    userController.refreshCurrentUser(req, res)
);
userRoutes.post("/login/facebook", (req, res) =>
    userController.loginFacebook(req, res)
);
userRoutes.put("/AccountDetails/editProfile", usersProfileMulter, (req, res) =>
    userController.editProfile(req, res)
);
userRoutes.post("/login/google", (req, res) =>
    userController.loginGoogle(req, res)
);

// Subscribe
userRoutes.get("/subscription/:id", isLoggedIn, (req,res)=> 
    userController.getSellerSubscribe(req, res))
userRoutes.get("/subscription", isLoggedIn, (req, res) =>
    userController.getSubscribe(req, res)
);

userRoutes.post("/subscription", isLoggedIn, (req, res) =>
    userController.subscribe(req, res)
);

// Profile Page
userRoutes.get("/userCardInfo", isLoggedIn, (req, res) =>
    userController.getUserCardInfo(req, res)
);

export default userRoutes;
