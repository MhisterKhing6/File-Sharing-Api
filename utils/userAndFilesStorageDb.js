import { MongoClient } from "mongodb";
import configs from "config"
import { mongodbConnector } from "./connectors.js";
import { exit } from "node:process";
/* Storage class for users and files */
class UserAndFilesStorage_Db {
    database = null
    mongodbConfig = configs.get("mongodbConfig")
    constructor() {
        this.client = new MongoClient(mongodbConnector(this.mongodbConfig));
        this.client.on("error",(error) => {
            console.log("error occured", error)
            exit()
        })
        this.database = this.client.db()
    }
    /**
     * connectedToServer: checks if the class has sucessfully connected to the database server
     * @returns {bool}: true if user is connected false otherwise
     */
    connectedToServer = () => this.database ? true : false

    /**
     * addUser : adds user object to database
     * @param {object} user :  user object to add to the database
     *  template:{email->String -> unique : required, password -> String: requird,
     *           name -> String: required, profileUrl -> String : ?, 
     *           token: String : system Genrated -> requird : unique }
     * @returns {object} : object Id and acknloedgment count
     */
    addUser = async (user) => {
        try{
            return await this.database.collection(this.mongodbConfig.userTable).insertOne(user)
        }catch(err) {
            this.database.close()
            console.log("error occured ", err)
            exit()
        }
            
    }
    /**
     * getUserEmail : query for a user with a specific email address
     * @param {string} email : email address to find corresponding user
     * @returns {object} : user object or null
     */
    getUserEmail = async (email) => { 
        try {
        return await this.database.collection(this.mongodbConfig.userTable).findOne({"email": email})
    } catch(err) {
        this.database.close()
        console.log("error occured ", err)
        exit()
    }
}
    /**
     * getUserToken : query for a user with a specific token
     * @param {string} token : token to find corresponding user
     * @returns {object} : user object or null
     */
    getUserEmail = async (token) =>{ 
        try {
        return await this.database.collection(this.mongodbConfig.userTable).findOne({"token": token})
        } catch(err) {
            this.database.close()
            console.log("error occured ", err)
            exit()
        } 
    }
    /**
     * updatePasswordEmail : update password field to a new value
     * @param {string} email : email address to find the corresponding user to update
     * @param {string} newPassword: encrypted new password to set for user
     * @returns {object} : user object or null
     */
    updatePasswordEmail = async (email, newPassword)  => {
      try {
       let response = await this.database.collection(this.mongodbConfig.userTable).updateOne({"email": email}, {$set: {password: newPassword}})
       return response.results
      } catch(err) {
        this.database.close()
        console.log("error occured ", err)
        exit()
      }
    }
}
    
let UserFileStorage =  new UserAndFilesStorage_Db();
export default UserFileStorage
