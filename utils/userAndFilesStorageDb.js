import { MongoClient } from "mongodb";
import configs from "config"
import { mongodbConnector } from "./connectors.js";
import { exit } from "node:process";
/* Storage class for users and files */
class UserAndFilesStorage_Db {
    database = null
    constructor() {
        this.client = new MongoClient(mongodbConnector(configs.get("mongodbConfig")));
        this.client.on("error",(error) => {
            console.log("error occured", error)
            exit()
        })
        this.database = this.client.db()
    }

    connectedToServer = () => this.database ? true : false

}
    
let UserFileStorage =  new UserAndFilesStorage_Db();

export default UserFileStorage
