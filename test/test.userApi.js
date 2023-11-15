import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";
import UserFileStorage from "../utils/userAndFilesStorageDb.js";
import sessionStorage from "../utils/sessionStorage.js";
import sha1 from "sha1"
import { describe } from "node:test";
import { generateToken } from "../utils/authenticationFunctions.js";

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

    describe("getting currnt login user", function () {
        let agent = chai.request.agent(server)
        let name = "kofi Asare"
        let email = "test2@gmail.com"
        let password = "testtesttess"
        let encryptedPass = sha1(password)
        let token = "testToken"
 
     before(async function() {
       await UserFileStorage.addUser({name, token, email, "password": encryptedPass})
     })
 
        it("check if the user is authenticated", async function() {
         let response = await agent.post("/login").type("json").send({email, password})
         chai.assert.equal(response.status, 200)
         chai.expect(response).to.have.cookie("sId");
         let sid = response.body.user.sid
         let currentUser = await agent.get("/currentuser").set('Cookie', `sId=${sid};`)
         chai.assert.isDefined(currentUser.body.user)
         chai.assert.equal(currentUser.body.user.email, email)  
        })
        
        after(async function () {
         await UserFileStorage.truncateAllUser()
        })
    })

    describe("getting user details", function () {
        let agent = chai.request.agent(server)
        let name = "kofi Asare"
        let email = "test2@gmail.com"
        let password = "testtesttess"
        let encryptedPass = sha1(password)
        let token = generateToken()
 
     before(async function() {
       await UserFileStorage.addUser({name, token, email, "password": encryptedPass})
     })
        
     it("should give the details of the user", async function() {
         let response = await chai.request(server).post("/userdetails").type("json").send({token})   
         chai.assert.equal(response.body.email, email)
         chai.assert.equal(response.body.fileCount, 0)
        })
    })
})