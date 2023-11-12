import express from "express";
import cors  from "cors";
import configs from "config"


const server = express()
//midleware
server.use(express.json()) //for json payload
server.use(cors()) // for cross origin access

//default
server.get("/", (req, res) => {
    res.json({status: "working"})
})

//interface
const expressConfig = configs.get("expressConfig")
server.listen(expressConfig.port, expressConfig.host, () => {
    const apiInterface = `http://${expressConfig.host}:${expressConfig.port}`
    console.log(`listening at: ${apiInterface}`)
})

export default server