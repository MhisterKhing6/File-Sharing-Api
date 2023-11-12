import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
import UserFileStorage from "../utils/userAndFilesStorageDb.js";

chai.use(chaiHttp)

describe("test for  user operation handlers", function() {
    after(async () => {
        await UserFileStorage.truncateAllUser()
    })
    it("should return an http json payload with status code 400 and an object about missing required fields", async () => {
        let email = "test";
        let name = "test2"
        let response = await chai.request(server).post("/register").type("json").send({email,name})
        chai.assert.equal(400, response.status)
        chai.assert.isObject(response.body)
        chai.assert.isDefined(response.body.missingFields)
        chai.assert.isDefined(response.body.requiredFields)
        chai.assert.equal(1, response.body.missingFields.length)
    })

    it("should return an http json object with status code 400 and an error about missing fields", async () => {
        let email = "test";
        let response = await chai.request(server).post("/register").type("json").send({email})
        chai.assert.equal(400, response.status)
        chai.assert.isObject(response.body)
        chai.assert.isDefined(response.body.missingFields)
        chai.assert.isDefined(response.body.requiredFields)
        chai.assert.equal(2, response.body.missingFields.length)
    })
    
    it("should return json payload with status code 400 and and object with object about invalid email", async () => {
        let email = "test";
        let password = "9Testtest";
        let name = "test2"
        let response = await chai.request(server).post("/register").type("json").send({email, password, name})
        chai.assert.equal(400, response.status)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.status, "not created")
        chai.assert.equal(response.body.message,"provide valid email; ")
    })

    it("should return json payload with status code 400 and and object with object about invalid password", async () => {
        let email = "test@gmail.com";
        let password = "ttest";
        let name = "test2"
        let response = await chai.request(server).post("/register").type("json").send({email, password, name})
        chai.assert.equal(400, response.status)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.status, "not created")
        chai.assert.equal(response.body.message,"password must be at least 6 characters, should contain a digit and a capital letter")
    })

    it("should return response with status code 200 and a json object about adding user successfull", async () => {
        let email = "test@gmail.com";
        let password = "987Kofi";
        let name = "test2"
        let response = await chai.request(server).post("/register").type("json").send({email, password, name})
        let user = await UserFileStorage.getUserEmail(email)
        chai.assert.isDefined(user.token)
        chai.assert.equal(email, user.email)
        chai.assert.equal(200, response.status)
        chai.assert.isObject(response.body)
        chai.assert.equal(response.body.status, "created")
    })
}) 