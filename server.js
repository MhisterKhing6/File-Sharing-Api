import express from "express";
import cors  from "cors";
import configs from "config"
import routes from "./views/routes.js";


const server = express()
//midleware
server.use(express.json()) //for json payload
server.use(cors()) // for cross origin access

//adding routes 
server.use(routes)

//default
server.get("/", (req, res) => {
    res.json({status: "working"})
})

//web server interface
const expressConfig = configs.get("expressConfig")
server.listen(expressConfig.port, expressConfig.host, () => {
    const apiInterface = `http://${expressConfig.host}:${expressConfig.port}`
    console.log(`listening at: ${apiInterface}`)
})

export default server