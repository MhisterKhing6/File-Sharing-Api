import { promisify } from "util";
import { mkdir, writeFile, unlink} from "fs";
import configs from "config"
import path from "path";
import MimeTypes from "mime-types";
import { getFileName } from "./fileFunctions.js";
let writefileAsync = promisify(writeFile)
let mkdirAsync = promisify(mkdir)
let unlinkAsync = promisify(unlink)

/*
handles saving files to disk
*/

class FileToDisk {
    /**
     * 
     * @param {string} originalFileName : fileName given by the user
     * @param {string} data : encoded string base on file config
     * @param {*} fileParent : parent path for file given by user
     * @param {*} token : token to identify user
     */
    constructor(orignalFileName, data, fileParentPath, token) {
        this.data = data; // encoded data
        this.fileConfig = configs.get("fileConfig")
        this.fullParentPath = path.join(this.fileConfig.folder, token, fileParentPath)
        this.mimeType = MimeTypes.lookup(orignalFileName)
        this.extension = path.extname(orignalFileName)
        this.encodedFileName = getFileName() + ".txt" //fileName for encoded data
        this.decodedFileName = getFileName() + this.extension //filename for decoded data    
    }
    
    async writeDatatoDisk() {
        try {
        //create parentfolder 
        await mkdirAsync(this.fullParentPath, {recursive: true})
        //decode Data 
        let buffer = Buffer.from(this.data, this.fileConfig.encoding)
        //write to disk
        let decodedFilePath = path.join(this.fullParentPath, this.decodedFileName)
        let encodedFilePath = path.join(this.fullParentPath, this.encodedFileName)
        //writh them to file
        await Promise.all[ await writefileAsync(encodedFilePath, this.data), await writefileAsync(decodedFilePath, buffer)]
        return {encodedPath: encodedFilePath, decodedPath:decodedFilePath, mimeType: this.mimeType}
        } catch(err) {
            console.log(err)
            return false
        }
    }
    /**
     * deleteFile : delete a file
     * @param {string} path: string variable
     */
    static async deleteFile(path) {
        try{
            (path)
            await unlinkAsync(path) 
            return true
        } catch(err) {
            console.log(err)
            return false
        }
    } 
}

export default FileToDisk
