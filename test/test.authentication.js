import {assert} from "chai";
import { encryptPassword } from "../utils/authenticationFunctions.js";
import sha1 from "sha1"
import { describe } from "node:test";
describe("authentication code", function(){
    describe("ecrypted password", function() {
        it("should return sha1 encrypted passowrd", function (){
            let testPassword = "test1Pas"
            let encryptedPwd = encryptPassword(testPassword)
            assert.isString(encryptedPwd)
            assert.equal(encryptedPwd, sha1(testPassword))
        })
    })
})