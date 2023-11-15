/**
 * common operations for files
 */

import { ObjectId } from "mongodb";
import configs from "config"
let serverConfig = configs.get("expressConfig")

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
    let url = `http://${serverConfig.host}:${serverConfig.port}/${filePath}`
    return url
 }

 /**
  * generateDownloadUrl: downladable url of the file
  * @param {string} fileId: the Id of the file
  * @param {string} token : token of the file
  * @returns downloadable url of the file
  */
 export function generateDownloadUrl(fileId, token) {
    return `http://${serverConfig.host}:${serverConfig.port}/downloadfile/${token}/${fileId}`
 }