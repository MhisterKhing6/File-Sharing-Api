import { promisify } from "util";
import { mkdir, writeFile} from "fs";
import configs from "config"
import path from "path";
import MimeTypes from "mime-types";
import { getFileName } from "./fileFunctions.js";
let writefileAsync = promisify(writeFile)
let mkdirAsync = promisify(mkdir)

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
        this.decodedFileName = getFileName() + "." + this.extension //filename for decoded data
        
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
        await Promise.all[writefileAsync(encodedFilePath, this.data), writefileAsync(decodedFilePath, buffer)]
        return {endodedPath: encodedFilePath, decodedPath:decodedFilePath, mimeType: this.mimeType}
        } catch(err) {
            console.log(err)
            return false
        }
    }
}

export default FileToDisk
