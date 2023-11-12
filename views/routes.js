/* Api interfaces */
import { Router } from "express";
import { UserController} from "../controllers/userController.js";
import { AuthController } from "../controllers/authenticationController.js";

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
