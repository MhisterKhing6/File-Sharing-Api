/* Api interfaces */
import { Router } from "express";
import { UserController} from "../controllers/userController.js";
import { AuthController } from "../controllers/authenticationController.js";
import { FileController } from "../controllers/fileController.js";

const routes = Router()

//User operation interfaces

/**
 * relative url: /register
 * purpose: use for registering user
 * method: post
 * domain: public
 * content-type: json
 */
routes.post("/register", UserController.addUser)

/**
 * relative url: /currentuser
 * purpose: for getting loged in user by session id in cookie
 * method: get
 * domain: public
 * content-type: json
 */
routes.get("/currentuser", UserController.getCurrentUser)


//file operation interface
/**
 * relative url: /uploadfile
 * purpose: for uploading file
 * method: post
 * domain: public
 * content-type: json
 */
routes.post("/uploadfile", FileController.uploadFile)

/**
 * relative url: /downloadfile/:token/:fileId
 * purpose: use for downloading file
 * method: get
 * domain : public
 * content-type: json
 */

routes.get("/downloadfile/:token/:fileId", FileController.downloadFile)


//Authentications operation interfaces

/**
 * relative url: /login
 * purpose: use for login
 * method: post
 * domain: public
 * content-type: json
 */
routes.post("/login", AuthController.login)
export default routes
