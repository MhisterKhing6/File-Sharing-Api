import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
import UserFileStorage from "../utils/userAndFilesStorageDb.js";
import { encryptPassword, generateToken } from "../utils/authenticationFunctions.js";
import sessionStorage from "../utils/sessionStorage.js";

chai.use(chaiHttp)

describe("test for authentication handlers", function() {
    let email = "test@email.com";
    let password = "testPasswod9"
    let encryptedPass = encryptPassword(password)
    let name = "Test";
    let token = generateToken()

    this.afterAll(async () => {
        await UserFileStorage.truncateAllUser()
    })
    this.beforeAll(async function() {
        await UserFileStorage.addUser({email, password:encryptedPass, name, token})
    })

    it("should return an http json payload with status code 400 and an object about missing required fields", async () => {
        let email = "test";
        let response = await chai.request(server).post("/login").type("json").send({email})
        chai.assert.equal(400, response.status)
        chai.assert.isObject(response.body)
        chai.assert.isDefined(response.body.missingFields)
        chai.assert.isDefined(response.body.requiredFields)
        chai.assert.equal(1, response.body.missingFields.length)
    })

    it("should return an http json object with status code 400 and an error about missing fields", async () => {
        let response = await chai.request(server).post("/login").type("json").send({})
        chai.assert.equal(400, response.status)
        chai.assert.isObject(response.body)
        chai.assert.isDefined(response.body.missingFields)
        chai.assert.isDefined(response.body.requiredFields)
        chai.assert.equal(2, response.body.missingFields.length)
    })
    
    it("should return json payload with status code 400 and and object with object about user does not exist", async () => {
        let email = "test";
        let password = "9Testtest";
        let response = await chai.request(server).post("/login").type("json").send({email, password})
        chai.assert.equal(401, response.status)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.status, "not verified")
        chai.assert.equal(response.body.message,"user does not exist")
    })

    it("should return json payload with status code 400 and and object with object about invalid password", async () => {
        let password = "ttest";
        let response = await chai.request(server).post("/login").type("json").send({email, password, name})
        chai.assert.equal(400, response.status)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.status, "not verified")
        chai.assert.equal(response.body.message,"password not correct")
    })

    it("should return response with status code 200 and a json object about adding user successfull", async () => {
        let response = await chai.request(server).post("/login").type("json").send({email, password})
        chai.assert.equal(email, response.body.user.email)
        chai.assert.equal(200, response.status)
        chai.assert.isObject(response.body.user)
        //check if ses is stored in redis
        let sid = await sessionStorage.getUserIdbySessionId(response.body.user.sid)
        chai.expect(response).to.have.cookie("sId");
        chai.assert.isDefined(sid)        
        chai.assert.equal(response.body.status, "verified")
    })
}) 