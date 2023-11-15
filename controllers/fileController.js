import UserFileStorage from "../utils/userAndFilesStorageDb.js";
import { verifyMandatoryFields, validateFileParentPath, validateFileName } from "../utils/verificationsFunctions.js";
import FileToDisk from "../utils/fileToDisk.js";
import { generateDownloadUrl, getFileUrl } from "../utils/fileFunctions.js";
import { ObjectId } from "mongodb";
import { response } from "express";
/**
 * api controller for file operations
 */
export class FileController {
    /**
     * uploadFile: api handler for file upload
     * @param {object} req : http json payload request object conatining file object
     * @param {*} res : response json object containing file id and url
     */
    static async uploadFile(req, res) {
        //
        let fileObject = req.body
        //check for required fields
        let requiredFields = ['data', 'fileName', "parentFolder", "token"]
        let missingFields = verifyMandatoryFields(requiredFields, fileObject)
        if(missingFields.length !== 0) {
            res.status(400).json({saved: false, message: "required fileds missing", missingFields, requiredFields})
        } else {
            //check if user is registered and has a valid token
            let token = fileObject.token
            let user =  await UserFileStorage.getUserToken(token)
            if(user) {
            //validation fileName and parent folder
            let validParentFolder = validateFileParentPath(fileObject.parentFolder)
            let validFileName= validateFileName(fileObject.fileName)
            if(!validParentFolder || !validFileName) {
                let response = {saved: false, 
                                message: {fileName: !validFileName ?"file name should be valid file name with extension, eg fileName.txt, image.png,": undefined,
                                          parentFolder: !validParentFolder? "parent folder shouldnt contain relative path or start with / and must pass as a directory, wrong parent folder /images, ../images, ./images, /images.txt. proper path images/, images/user, videos/, audio/user, etc" : undefined}
                                }
                res.status(400).json(response)
            } else {
                //write file to disk
                try {
                    let fileDisk = new FileToDisk(fileObject.fileName, fileObject.data, fileObject.parentFolder, fileObject.token)
                        let result = await fileDisk.writeDatatoDisk()
                        let fileDb = {"userFileName": fileObject.fileName,
                                      "userParentFolder": fileObject.parentFolder,
                                      "token": fileObject.token,
                                      "mimeType": result.mimeType,
                                      "encodedPath": result.encodedPath,
                                      "decodedPath": result.decodedPath,
                                      "url": getFileUrl(result.decodedPath)
                                    }
                        //add file to the database
                        let dbrespons = await UserFileStorage.addFile(fileDb)
                        let fileId = dbrespons.insertedId.toString()
                        res.status(200).json({saved: true, url:fileDb.url, fileId, token: fileObject.token})
                } catch(err) {
                    console.log(err)
                    res.status(500).json({"message": "internal error contact admin"})
                }
            }

            } else {
                res.status(401).json({saved:false, "message": "token not valid, register for valid token or check your token is correct"})
            }
            
        }

    }

    
    static async downloadFile(req, res) {
        //get user token and fileId from params
        let token = req.params.token
        let fileId = req.params.fileId
        //check user exist
            let user =  await UserFileStorage.getUserToken(token)
            if(user) {
                //check if file exist
                let fileObjectid = new ObjectId(fileId)
                let file = await UserFileStorage.getFileId(fileObjectid)
                //check if file exit
                if(!file) {
                    res.status(400).json({"error": "file does not exit, check fileId"})
                } else {
                    //check if file belong to user
                    if(file.token !== user.token) {
                        res.status(401).json({"message": "user does not own file."})
                    } else {
                        res.download(file.decodedPath)
                    }
                }
            } else {
                res.status(401).json({"message": "token not valid, register for valid token or check your token is correct"})
            }
    }


}