import FileToDisk from "../utils/fileToDisk.js";
import {assert} from "chai";
import { existsSync } from "fs";
import configs from "config"
import { generateToken } from "../utils/authenticationFunctions.js";
import { promisify } from "util";
import { readFile } from "fs";
import { setTimeout } from "timers/promises";
import { describe } from "node:test";
let readFileAsync = promisify(readFile)
let setTimeoutAsync = promisify(setTimeout)

describe("writing file to disk", function() {
    describe("writing files to a disk operations", function() {
        let fileConfig = configs.get("fileConfig")
        let token = generateToken()
        let testContent = "testing Path"
        let result = ""
        let data = Buffer.from(testContent).toString(fileConfig.encoding)
        let testFile = new FileToDisk("test.txt", data, "path/path1/", token )
        it("should sucesfull save file with", async function(){
            result = await testFile.writeDatatoDisk()
            assert.isTrue(existsSync(result.decodedPath))
            assert.isTrue(existsSync(result.encodedPath))
            let decodedContent = await readFileAsync(result.decodedPath)
            assert.equal(decodedContent, testContent)
        })
        this.after(function () {
            this.afterAll(async function () {
                await FileToDisk.deleteFile(result.encodedPath)
                await FileToDisk.deleteFile(result.decodedPath)
            })
        })
    })

    describe("writing files to a disk operations", function() {
        let fileConfig = configs.get("fileConfig")
        let token = generateToken()
        let testContent = "testing Path"
        let result = ""
        let data = Buffer.from(testContent).toString(fileConfig.encoding)
        let testFile = new FileToDisk("test.txt", data, "path/path1/", token )
        it("should sucesfull save file with", async function(){
            result = await testFile.writeDatatoDisk()
            
        })
    })
})

 