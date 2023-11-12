/*handles user request operations */
import { verifyMandatoryFields, validateEmail, validatePassword} from "../utils/verificationsFunctions"
import { encryptPassword, generateToken } from "../utils/authenticationFunctions.js"
import UserFileStorage from "../utils/userAndFilesStorageDb.js"
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
                let errormessage = !validEmail ? "Error provid valid email,":" "
                errormessage += !validPwd.validated ? validPwd.message : " "
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
}