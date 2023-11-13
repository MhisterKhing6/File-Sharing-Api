import {assert} from "chai";
import UserFileStorage from "../utils/userAndFilesStorageDb.js";
import { promisify } from "util";
import { after } from "node:test";
import { ObjectId } from "mongodb";
let setTimeoutAsync = promisify(setTimeout)

describe("tesing monodb opeartions", function(){
    this.afterAll(async () => {
        await UserFileStorage.truncateAllUser()
    })
    describe("mongodb connection", () => {
        
        after(async function() {
            UserFileStorage.truncateAllUser()
        })
        it("checks if mongodb can be connected to instance", async () => {
    
            while(!UserFileStorage.connectedToServer()) {
                await setTimeoutAsync(100)
                break
            }
            assert.isBoolean(UserFileStorage.connectedToServer())
            assert.isTrue(UserFileStorage.connectedToServer())
        })
    })

   describe("inserting into the database", function() {
    let testUser = {email: "test@gmail.com", password: "test_password", token:"xxxxxx", name: "test"}
    after(async function(){
        UserFileStorage.truncateAllUser()
    })
    it("inserting into the database", async function() {
        let result = await UserFileStorage.addUser(testUser)
        assert.equal(result.acknowledged, true)
    })
   })

    describe("testing querying", function () {
        let testUser = {email: "test@gmail.com", password: "test_password", token:"xxxxxx", name: "test"}
        before(async function () {
            await UserFileStorage.addUser(testUser)
            
        })
        after(async function() {
            await UserFileStorage.truncateAllUser()

        })

        it("search for an existed user by email", async function() {
            let result = await UserFileStorage.getUserEmail(testUser.email)
            assert.equal(result.email, testUser.email)
            
        })
        
        it("non existed user with email", async function() {
            let result = await UserFileStorage.getUserEmail("xxx")
            assert.typeOf(result, "null")
            
        })

        it("search for an existed user by object id", async function() {
            let user = await UserFileStorage.getUserEmail(testUser.email)
            let userId = user._id.toString()
            let secondResult = await UserFileStorage.getUserId(new ObjectId(userId))
            assert.equal(secondResult.email, testUser.email)
            
        })

        it("search for existed user by token", async function(){
            let result = await UserFileStorage.getUserToken(testUser.token)
            assert.equal(result.name, testUser.name)
        })

        it("non existed user token", async function() {
            let result = await UserFileStorage.getUserToken("xxx")
            assert.typeOf(result, "null")
            
        })

        
    })


    describe("testing updating password", function () {
        let testUser = {email: "test@gmail.com", password: "test_password", token:"xxxxxx", name: "test"}
        let newPassword = "newTestPassword"
        before(async function () {
            await UserFileStorage.addUser(testUser)    
        })
        after(async function() {
            await UserFileStorage.truncateAllUser()
        })

        it("should return a user with updated email", async function() {
            let result = await UserFileStorage.updatePasswordEmail(testUser.email, newPassword)
            let updateUser = await UserFileStorage.getUserEmail(testUser.email)
            assert.notEqual(updateUser.password, testUser.password)
            assert.equal(updateUser.password, newPassword)

        })

    })

})
