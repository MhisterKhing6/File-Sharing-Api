import {assert} from "chai";
import { describe } from "node:test";
import { verifyMandatoryFields } from "../utils/verificationsFunctions.js";
describe("test for verification functions", function() {
    describe("test for verify mandatory fields", function () {
        let itemObject = {"email": "testEmail", "password": "testPassword", "token": "testToken"}
        let requiredFields = ["email", "password"]
        it("should return empty list", function() {
            let missingFields = verifyMandatoryFields(requiredFields, itemObject)
            assert.isArray(missingFields)
            assert.equal(0, missingFields.length)
        })
        it("should return non empty array and array lenght should be two", function() {
            itemObject = {...itemObject, email:"", password:""}
            let missingFields = verifyMandatoryFields(requiredFields, itemObject)
            assert.isArray(missingFields)
            assert.equal(2, missingFields.length)
            assert.isTrue(missingFields.includes("email"))
            assert.isTrue(missingFields.includes("password"))
        })

        it("should return non empty array and array length should be 3", function() {
            it("should return non empty array and array lenght should be two", function() {
                let itemObjectTest = {field1: "field1", field2: "2"}
                let requiredFieldsTest = ["key1", "key2"]
                let missingFields = verifyMandatoryFields(requiredFields, itemObject)
                assert.isArray(missingFields)
                assert.equal(2, missingFields.length)
                assert.isTrue(missingFields.includes("key1"))
                assert.isTrue(missingFields.includes("key2"))
            })
        })
    })
})