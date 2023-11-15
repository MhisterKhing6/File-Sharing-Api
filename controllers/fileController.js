import UserFileStorage from "../utils/userAndFilesStorageDb.js";
import { verifyMandatoryFields, validateFileParentPath, validateFileName } from "../utils/verificationsFunctions.js";
import FileToDisk from "../utils/fileToDisk.js";
import { getFileUrl } from "../utils/fileFunctions.js";
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
}