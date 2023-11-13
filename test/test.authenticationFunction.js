import {assert} from "chai";
import { encryptPassword,getSessionIdFromCookie,generateToken } from "../utils/authenticationFunctions.js";
import sha1 from "sha1"
import { describe } from "node:test";
describe("authentication code", function(){
   
    describe("generate token function", function() {
        it("should generate token without hypen", function () {
            let token = generateToken()
            assert.isFalse(token.includes("-"))
        })
    })

    describe("ecrypted password", function() {
        it("should return sha1 encrypted passowrd", function (){
            let testPassword = "test1Pas"
            let encryptedPwd = encryptPassword(testPassword)
            assert.isString(encryptedPwd)
            assert.equal(encryptedPwd, sha1(testPassword))
        })
    })

    describe("getting session id from cookie", function () {
        let sesIdCookie = generateToken()
        let mockedRequest = {cookies:{"sId":sesIdCookie}}
        it("should return test from mocked request", function () {
            let sId = getSessionIdFromCookie(mockedRequest)
            assert.equal(sId, sesIdCookie)
        })

        it("should return none from mocked request", function() {
            mockedRequest.cookies.sId = undefined
            let sId = getSessionIdFromCookie(mockedRequest)
            assert.isUndefined(sId)
        })
    })
    
    
})
