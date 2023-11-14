/**
 * common operations for files
 */

import { ObjectId } from "mongodb";
import configs from "config"
/**
 * getFileName : genrate a unque file name for a file
 * @returns a unique string object id string that can be use as file name
 */
export function getFileName() {
    return new ObjectId().toString()
}

//generate url of a file
/**
 * getFileUrl: generate the url of the file
 * @param {string} filePath: the path of the file 
 * @returns 
 */
export function getFileUrl(filePath) { 
    let serverConfig = configs.get("expressConfig")
    let url = `http://${serverConfig.host}:${serverConfig.port}/${filePath}`
    return url
 }
