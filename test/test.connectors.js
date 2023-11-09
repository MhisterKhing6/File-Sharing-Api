import {assert} from "chai";
import { mongodbConnector } from "../utils/connectors.js";


describe("validate mongodb connection string", () => {
    let mockedMonogdbTestConfig = {port: "27017", host:"localhost", documentTest:"testMediaHub", username: "", password:""}
    it("checks if default connections string is valid", () => {
        /**
         * has to be skipped, other configs prevent the defulat configs
         */
        let defaultConnectionString = `mongodb://localhost:27017/testMediaHub`
        assert.equal(defaultConnectionString, mongodbConnector(mockedMonogdbTestConfig))
    })

    it("expect changes in config varibles results in different connection strings",()=> {
        /**
         * in config
         * password: test,
         * username: test
         */
        mockedMonogdbTestConfig.username = "test"
        mockedMonogdbTestConfig.password = "test"
        let expectedConnectionString = `mongodb://test:test@localhost:27017/testMediaHub`
        assert.equal(mongodbConnector(mockedMonogdbTestConfig), expectedConnectionString)
    })

})