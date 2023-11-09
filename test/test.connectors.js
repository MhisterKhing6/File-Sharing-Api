import {assert} from "chai";
import { mongodbConnector } from "../utils/connectors.js";
import configs from "config"
import { skip } from "node:test";


describe("validate mongodb connection string", () => {
    
    xit("checks if default connections string is valid", () => {
        /**
         * has to be skipped, other configs prevent the defulat configs
         */
        let defaultConnectionString = `mongodb://localhost:27017/testMediaHub`
        assert.equal(defaultConnectionString, mongodbConnector())
    })

    it("expect changes in config varibles results in different connection strings",()=> {
        /**
         * in config
         * password: test,
         * username: test
         */
        let expectedConnectionString = `mongodb://test:test@localhost:27017/testMediaHub`
        assert.equal(mongodbConnector(), expectedConnectionString)
    })

})