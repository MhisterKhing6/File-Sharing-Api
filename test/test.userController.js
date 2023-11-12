import chai from "chai";
import chaiHttp from "chai-http";
import { UserController } from "../controllers/userController.js";
import { encryptPassword } from "../utils/authenticationFunctions.js";
import UserFileStorage from "../utils/userAndFilesStorageDb";

describe("testing addUser api handler", async function (){
    let email = "test";
    let passowrd = "test";
    let name = "testName";
    it("should return response with status 400 and message about wrong email")
})