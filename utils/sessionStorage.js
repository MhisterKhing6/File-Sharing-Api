import { createClient } from "redis";
import { redisConnector } from "./connectors.js";
import configs from "config"
import { exit } from "process";
/**
 * handles saving session cookies to redis
 */

class SessionStorage {
    redisClient = null
    redisConfig = configs.get("redisConfig")
    constructor() {
    this.redisClient = createClient({ url: redisConnector(this.redisConfig) }).connect(()=> this.isconnected = true);
    }
    /**
     * saveSessionId -> save the session id in redis storage
     * @param {string} ses_id: the session id for a user m 
     * @param {string} user_id : user id 
     * @param {number} time : optional time for the session to expire in seconds
     */

    saveSessionId = async (ses_id, user_id, time=432000000) => {
        try {
            return  (await this.redisClient).set(ses_id, user_id, time)
        } catch(err) {
            console.log(err)
            exit()
        }
     }

    getUserIdbySessionId= async (ses_id) => {
        try {
        return (await this.redisClient).get(ses_id)
        } catch(err) {
            console.log(err)
            exit()
        }
    }

    connectedToServer = () => this.redisClient ? true : false;
}

let sessionStorage = new SessionStorage()
export default sessionStorage