import {assert, should} from "chai";
import sessionStorage from "../utils/sessionStorage.js";
import {v4} from "uuid"
import { promisify } from "util";
import { before, describe } from "node:test";
let setTimeoutAsync = promisify(setTimeout)


describe("connection to redis testing", function() {
    it("checks if connection to server is successful", async () => {
        while(!sessionStorage.connectedToServer()){
            await setTimeoutAsync(50)
        }
        assert.isTrue(sessionStorage.connectedToServer())
    })
    describe("saving session id", function() {
        let ses_id = v4()
        let user_id = "test"
        it("should save session id and user id as key value successfull", async function () {
            let response = await sessionStorage.saveSessionId(ses_id, user_id)
            assert.isString(response)
            assert.equal(response, "OK")
        })

        it("should return null, undefined user id", async () => {
            let response = await sessionStorage.saveSessionId(ses_id, "")
            assert.isNull(response)
            
        })

        it("should return null, empty string user d", async () => {
            let response = await sessionStorage.saveSessionId(ses_id, " ")
            assert.isNull(response)
           
        })
        it("should return null, undefined ses and user id ", async () => {
            let response = await sessionStorage.saveSessionId("", "")
            assert.isNull(response)
           
        })

        it("should return null, emppty ses and user ids ", async () => {
            let response = await sessionStorage.saveSessionId(" ", "  ")
            assert.isNull(response)
           
        })
    })

    describe("querying for the user id", function() {
        let test_ses_id = v4()
        let test_id = "test1"
    
        before(async function() {
            await sessionStorage.saveSessionId(test_ses_id, test_id)
        }) 

        it("should give value equal to test1_id", async function () {
            let response = await sessionStorage.getUserIdbySessionId(test_ses_id)
            assert.isString(response)
            assert.equal(response, test_id)
        })

        it("should return null, undefined ses id", async function () {
            let response = await sessionStorage.getUserIdbySessionId("")
            assert.isNull(response)   
        })
        it("should return null, empty ses id ", async function () {
            let response = await sessionStorage.getUserIdbySessionId(" ")
            assert.isNull(response)   
        })
    })

    describe("deleting keys in redis", function() {
        let test_ses_id = v4()
        let test_id = "test1"
    
        before(async function() {
            await sessionStorage.saveSessionId(test_ses_id, test_id)
        }) 

        it("should give deleted count of 1", async function () {
            let response = await sessionStorage.deleteSession(test_ses_id)
            assert.isNumber(response)
            assert.equal(1, response)
        })

        it("should return null, undefined ses id", async function () {
            let response = await sessionStorage.deleteSession("")
            assert.isNull(response)   
        })
        it("should return null, empty ses id ", async function () {
            let response = await sessionStorage.deleteSession(" ")
            assert.isNull(response)   
        })
    })
   
})