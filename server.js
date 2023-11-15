import express from "express";
import cors  from "cors";
import configs from "config"
import routes from "./views/routes.js";
import cookieParser from "cookie-parser";
let fileConfig = configs.get("fileConfig")

const server = express()
//midleware
server.use(express.json()) //for json payload
server.use(cors()) // for cross origin access
server.use(cookieParser())

//static path to handle file url
const staticPath = fileConfig.get("folder")
server.use(`/${staticPath}`, express.static(staticPath))

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