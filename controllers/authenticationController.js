/* controls authentication http request */

import { verifyMandatoryFields} from "../utils/verificationsFunctions.js"
import { encryptPassword, generateToken  } from "../utils/authenticationFunctions.js"
import UserFileStorage from "../utils/userAndFilesStorageDb.js"
import sessionStorage from "../utils/sessionStorage.js"

export class AuthController {
    /**
     * login : A handler for 
     * @param {object} req : http json request  object contaninig deatials about user credentials
     * @param {object} res : http json response object containig details about authentication status
     */
    static async login(req, res){
        let userCredentials = req.body
        //check for required credentials fields
        let requiredFields = ['email', 'password']
        let missingFields = verifyMandatoryFields(requiredFields, userCredentials)
        if(missingFields.length !== 0) {
            res.status(400).json({status:"not verified" ,message: "required fileds missing", missingFields, requiredFields})
        } else {
            //check if user exists
            let user = await UserFileStorage.getUserEmail(userCredentials.email)
            if(!user) {
                res.status(401).json({status:"not verified" ,message:"user does not exist"})
            } else {
                //check to see if passwords match(encrypted)
                let encryptedPassfromCredentials = encryptPassword(userCredentials.password)
                if(encryptedPassfromCredentials !== user.password) {
                    res.status(400).json({status:"not verified" ,message:"password not correct"})
                } else {
                    //generate a session token for the user
                    let sesToken = generateToken()
                    //save ses_token in redis with user id as value in sessionStorage
                    let userId = user._id.toString();
                    await sessionStorage.saveSessionId(sesToken, userId)
                    let userResponseDetails = {name: user.name, sid: sesToken, email: user.email, token:user.token}
                    res.json({'status': "verified", user: userResponseDetails})
                }
            }
        }
    }
}