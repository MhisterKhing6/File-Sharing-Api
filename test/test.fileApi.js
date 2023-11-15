import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
import UserFileStorage from "../utils/userAndFilesStorageDb.js";
import sha1 from "sha1";
import configs from "config"
import { readFile } from "fs";
import { promisify } from "util";

let readFileAsync = promisify(readFile)
let fileConfig = configs.get("fileConfig")

chai.use(chaiHttp)

describe("testin file api", function() {
    let name = "kofi Asare"
    let email = "test2@gmail.com"
    let password = "testtesttess"
    let encryptedPass = sha1(password)
    let token = "testToken"
    let fileName = "test.txt";
    
    this.beforeAll(async function(){
        await UserFileStorage.addUser({name, email, password: encryptedPass, token})
    })
    it("return response about fields missing", async function() {
        let response = await chai.request(server).post("/uploadfile").type("json").send({email, password})
        chai.assert.equal(response.status, 400)
        chai.assert.isDefined(response.body.missingFields)
        chai.assert.isDefined(response.body.requiredFields)
        chai.assert.equal(response.body.missingFields.length, 4)
       }) 
    it("return response about invalid token", async function() {
        let notExist = "not exit";
        let parentFolder = "../test/test2"
        let data = "test"    
        let response = await chai.request(server).post("/uploadfile").type("json").send({fileName, token: notExist, data, parentFolder})
        chai.assert.equal(response.status, 401)
        chai.assert.isFalse(response.body.saved);
        chai.assert.isDefined(response.body.message)
    })

    it("return response about improper file name ", async function() {
        let wrongfileName = "test"
        let parentFolder = "test/test2";
        let data = "test dta"
        let response = await chai.request(server).post("/uploadfile").type("json").send({fileName: wrongfileName, token, data, parentFolder})
        chai.assert.equal(response.status, 400)
        chai.assert.isFalse(response.body.saved);
        chai.assert.isUndefined(response.body.message.parentFolder)
        chai.assert.isDefined(response.body.message.fileName) 
    })

    it("should upload file successfully", async function() {
        let file = await readFileAsync("test/testImage.jpg")
        let encodedImage = Buffer.from(file).toString(fileConfig.encoding)  
        let data = encodedImage
        let imageFileName = "messi.jpg"
        let parentFolder = "images/profilePics"
        let response = await chai.request(server).post("/uploadfile").type("json").send({fileName: imageFileName, token, data, parentFolder})
        chai.assert.equal(response.status, 200)
        chai.assert.isTrue(response.body.saved);
        chai.assert.isDefined(response.body.token) 
        chai.assert.isDefined(response.body.url) 
        //check if url can be accessible 
        let urlResponse = await chai.request(server).get(response.body.url)
        console.log(urlResponse)
    })

})



   
