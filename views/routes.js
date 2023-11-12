/* Api interfaces */
import { Router } from "express";
import { UserController } from "../controllers/userController.js";

const routes = Router()

//User operation interfaces
routes.post("/register", UserController.addUser)

export default routes


