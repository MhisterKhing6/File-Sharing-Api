import {assert} from "chai";
import {getFileUrl} from "../utils/fileFunctions.js"
import configs from "config"
import { test } from "node:test";

describe("get url of a file", function () {
    let serverConfig = configs.get("expressConfig")
    it("should return url of file", function(){
        let filePath = "storage/file/file2.txt"
        let url = getFileUrl(filePath)
        let expectedUrl = `http://${serverConfig.host}:${serverConfig.port}/${filePath}`
        assert.equal(url, expectedUrl)
    })
})