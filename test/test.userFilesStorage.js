import {assert} from "chai";
import { mongodbConnector } from "../utils/connectors.js";
import configs from "config"


describe("validate mongodb connection string", () => {
    let mongodbConfig = configs.get("mongodbConfig")
    let defaultConnectionString = `mongodb://localhost:27017/testMediaHub`
    it("checks if default connections string is valid", () => {
        assert.equal(defaultConnectionString, mongodbConnector())
    })

})