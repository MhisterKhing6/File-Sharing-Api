/*handles user request operations */
import { verifyMandatoryFields, validateEmail, validatePassword} from "../utils/verificationsFunctions.js"
import { encryptPassword, generateToken, getSessionIdFromCookie } from "../utils/authenticationFunctions.js"
import UserFileStorage from "../utils/userAndFilesStorageDb.js"
import sessionStorage from "../utils/sessionStorage.js"
import { ObjectId } from "mongodb"
export class UserController{
    /**
     * addUser : a request handler that registers usser
     * @param {object} req : and http json payload containin user information
     * @param {object} res : json objects containing details about user registration status
     */
    static async addUser(req, res) {
        let userObject = req.body
        //check if all required fileds or keys are given 
        let requiredFields = ["email", "password", "name"]
        let missingFields = verifyMandatoryFields(requiredFields, userObject)
        //check if a field is missing
        if(missingFields.length !== 0){
            res.status(400).json({status: "not created", message: "required fileds missing", missingFields, requiredFields})
        } else {
            //check if user gave a valid email
            let validEmail = validateEmail(userObject.email)
            //check if a user gave a strong password
            let validPwd = validatePassword(userObject.password)
            //check if any faild
            if (!validEmail  || !validPwd.validated) {
                let errormessage = !validEmail ? "provide valid email; ":""
                errormessage += !validPwd.validated ? validPwd.reason : ""
                res.status(400).json({status: "not created", message: errormessage})
            } else {
                //encrypt the pasword
                let encryptedPwd = encryptPassword(userObject.password)
                //generate token for the user
                let userToken = generateToken()
                //save user object in the database
                let user = {name: userObject.name, password: encryptedPwd, token: userToken, email: userObject.email}
                UserFileStorage.addUser(user)
                res.status(200).json({status: "created"})
            }
        }
    }
    /**
     * getCurrentUser: get the current user with specific session in the request cookie
     * @param {object} : request object containing cookie value in header
     * @param {object} : json response object containing user details
     */
    static async getCurrentUser(req, res) {
        let sid = getSessionIdFromCookie(req)
        if(!sid) {
            res.status(401).json({message:"user not login"})
        } else {
            let userId = await sessionStorage.getUserIdbySessionId(sid)
            if(userId) {
                let userObjectId = new ObjectId(userId)
                let user = await UserFileStorage.getUserId(userObjectId)
                let userResponesDetails = {name: user.name, email: user.email, token: user.token, sid}
                res.status(200).json({user: userResponesDetails})
            } else {
                res.status(401).json({message:"session expired, re login"})
            }
        }
    }

    /**
     * userDetails : get the details of a user wtith a particular email
     * @param {object} req : json payload respons object containing file id and token
     * @param {download} res : object containing file details
     */
    static async userDetails(req, res) {
        let fileDetails = req.body
        //check for required fields
        let requiredFields= ["token"]
        let missingFields = verifyMandatoryFields(requiredFields, fileDetails)
        if(missingFields.length !== 0) {
            res.status(400).json({message: "required fileds missing", missingFields, requiredFields})
        } else {
            //check user exist
            let token = fileDetails.token
            let user =  await UserFileStorage.getUserToken(token)
            if(user) {
                //check if file exist
                let userFiles = UserFileStorage.getAllFileToken(token)
                res.status(200).json({userName: user.name, email: user.email, token: user.token, fileCount: userFiles.length})
            } else {
                res.status(401).json({"message": "token not valid, register for valid token or check your token is correct"})
            }
        }
    }


}