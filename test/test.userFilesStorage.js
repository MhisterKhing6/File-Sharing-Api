import {assert} from "chai";
import UserFileStorage from "../utils/userAndFilesStorageDb.js";
import { promisify } from "util";
import { describe } from "node:test";
let setTimeoutAsync = promisify(setTimeout)


describe("mongodb qurying testing", () => {
    
        it("checks if mongodb can be connected to instance", async () => {
    
            while(!UserFileStorage.connectedToServer()) {
                await setTimeoutAsync(100)
                break
            }
            assert.isBoolean(UserFileStorage.connectedToServer())
            assert.isTrue(UserFileStorage.connectedToServer())
        })
    })