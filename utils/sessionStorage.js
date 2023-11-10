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
            if(!ses_id || !user_id || ses_id === " " || user_id === " ")
                return null
            return  (await this.redisClient).set(ses_id, user_id, time)
        } catch(err) {
            console.log(err)
            exit()
        }
     }
     /**
      * getUserIdbySessionId : returns the user if of a particular session id
      * @param {string} ses_id: the session id
      * @returns {string}: user id associated with the session _id
      */
    getUserIdbySessionId= async (ses_id) => {
        try {
        if(!ses_id || ses_id ===" ") 
            return null
        
        return (await this.redisClient).get(ses_id)
        } catch(err) {
            console.log(err)
            exit()
        }
    }
    /**
     * deleteSession: delete a session key with id
     * @param {string} ses_id: the sesion to delete id 
     * @returns {string} : type of data deleted and number of ses id deleted
     */
    deleteSession = async (ses_id)  => {
        try {
            if(!ses_id || ses_id ===" ") 
                return null
            
            return (await this.redisClient).del(ses_id)
            } catch(err) {
                console.log(err)
                exit()
            }
    }
    /**
     * connectedToserver => checks if the wrapper class has successfuly connected to the redis storage
     * @returns {bool}: true or false
     */

    connectedToServer = () => this.redisClient ? true : false;
}

let sessionStorage = new SessionStorage()
export default sessionStorage