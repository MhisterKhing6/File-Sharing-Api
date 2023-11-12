import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";

chai.use(chaiHttp)

describe("testing for general server interface", function() {
    it("should return an http json payload {status: working} ", async () => {
        let response = await chai.request(server).get("/")
        chai.assert.equal(200, response.status)
        chai.assert.isObject(response.body)
        chai.assert.equal("working", response.body.status)
    })
}) 