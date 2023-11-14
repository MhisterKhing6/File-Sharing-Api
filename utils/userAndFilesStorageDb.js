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
        console.log("error occured ", err)
        exit()
    }
}   

    /**
     * getUserId : query for a user with a specific object id
     * @param {string} userId : user object id
     * @returns {object} : user object or null
     */
    getUserId = async (userId) => { 
        try {
        return await this.database.collection(this.mongodbConfig.userTable).findOne({"_id": userId})
    } catch(err) {
        console.log("error occured ", err)
        exit()
    }
}
    /**
     * getUserToken : query for a user with a specific token
     * @param {string} token : token to find corresponding user
     * @returns {object} : user object or null
     */
    getUserToken = async (token) =>{ 
        try {
        return await this.database.collection(this.mongodbConfig.userTable).findOne({"token": token})
        } catch(err) {
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
       return response
      } catch(err) {
        console.log("error occured ", err)
        exit()
      }
    }

    /**
     * truncteAlluser: truncate the user table during testing
     * @returns {bool} : true if deleted false otherwise
     */
    truncateAllUser = async () => {
        try {
            if(configs.get("test")) { 
            await this.database.collection(this.mongodbConfig.userTable).deleteMany()
            }
            return true
        } catch(err) {
            console.log(err)
            return false
        }
    }

    /**
     * addFile : adds a file object to the database
     * @param {object} fileObject :  file object to add to the database
     *  template:{token-> string: identifies the owner of the file
     *           encodedPath -> string: identifies a file containing the encoded data of the file, 
     *           decodedPath -> string : identifies a path to the deconded file,
     *           mimeType -> string : specify the mime type of the file,
     *           url -> string: identify the url for the decoded file,
     *           userFileName -> string: identify the file name given by the user
     *           userParentFolder -> string: identify the parent path given by the user
     *           }
     * @returns {object} : object Id and acknloedgment count
     */
    addFile = async (fileObject) => {
        try{
            return await this.database.collection(this.mongodbConfig.fileTable).insertOne(fileObject)
        }catch(err) {
            console.log("error occured ", err)
            exit()
        }     
    }

     /**
     * getFileId : query for a file with a specific object id
     * @param {string} fileId : file object id
     * @returns {object} : file object or null
     */
     getFileId = async (fileId) => { 
        try {
        return await this.database.collection(this.mongodbConfig.fileTable).findOne({"_id": fileId})
        } catch(err) {
            console.log("error occured ", err)
            exit()
        }
    }

     /**
     * getAllFileToken : query for all file uploaded by user with specific token
     * @param {string} userToken : user token
     * @returns {object} :
     */
     getAllFileToken = async (userToken) => { 
        try {
        let cursor = await this.database.collection(this.mongodbConfig.fileTable).find({"token": userToken})
        return cursor.toArray()
        } catch(err) {
            console.log("error occured ", err)
            exit()
        }
    }

     /**
     * getFileFileName : query for all file with specific filename
     * @param {string} fileName : file name
     * @returns {object} :
     */
     getFileFileName = async (fileName) => { 
        try {
        return await this.database.collection(this.mongodbConfig.fileTable).findOne({"userFileName": fileName})
        } catch(err) {
            console.log("error occured ", err)
            exit()
        }
    }

      /**
     * truncteAllFiles: truncate all files in the filetable
     * @returns {bool} : true if deleted false otherwise
     */
      truncateAllFile = async () => {
        try {
            if(configs.get("test")) { 
            await this.database.collection(this.mongodbConfig.fileTable).deleteMany()
            }
            return true
        } catch(err) {
            console.log(err)
            return false
        }
    }
    
}


let UserFileStorage =  new UserAndFilesStorage_Db();
export default UserFileStorage

