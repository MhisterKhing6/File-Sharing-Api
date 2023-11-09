/* handlse users and files storage mongodb database */
import {MongoClient} from "mongodb"
import { mongodbConnector } from "./utils/connectors"
class UserAndFilesStorage {
    dbStorage = null
    isConnected = false
    constructor() {
        let connection = new MongoClient(mongodbConnector).connect()
        connection.on("connect", () => this.isConnected = true)
        this.dbStorage = connection.db()
    }


}

export default new UserAndFilesStorage()