import {assert} from "chai";
import {getFileUrl, generateDownloadUrl} from "../utils/fileFunctions.js"
import configs from "config"
import { test } from "node:test";
let serverConfig = configs.get("expressConfig")


describe("get url of a file", function () {
    it("should return url of file", function(){
        let filePath = "storage/file/file2.txt"
        let url = getFileUrl(filePath)
        let expectedUrl = `http://${serverConfig.host}:${serverConfig.port}/${filePath}`
        assert.equal(url, expectedUrl)
    })
})


describe("get downloadble url of a file", function() {
    it("should downloadable url of the file", function() {
        let fileId = "12345"
        let token = "34567"
        let expectedUrl = `http://${serverConfig.host}:${serverConfig.port}/downloadfile/${token}/${fileId}`
        let downloadUrl = generateDownloadUrl(fileId, token)
        assert.equal(expectedUrl, downloadUrl)
        
    })
})