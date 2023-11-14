import FileToDisk from "../utils/fileToDisk.js";
import {assert} from "chai";
import { existsSync } from "fs";
import configs from "config"
import { generateToken } from "../utils/authenticationFunctions.js";
import { promisify } from "util";
import { readFile } from "fs";
let readFileAsync = promisify(readFile)

describe("writing files to a disk operations", function() {
    let fileConfig = configs.get("fileConfig")
    let token = generateToken()
    let testContent = "testing Path"
    let data = Buffer.from(testContent).toString(fileConfig.encoding)
    let testFile = new FileToDisk("test.txt", data, "path/path1/", token )
    it("should sucesfull save file with", async function(){
        let result = await testFile.writeDatatoDisk()
        assert.isTrue(existsSync(result.decodedPath))
        assert.isTrue(existsSync(result.endodedPath))
        let decodedContent = await readFileAsync(result.decodedPath)
        assert.equal(decodedContent, testContent)
    })
})
