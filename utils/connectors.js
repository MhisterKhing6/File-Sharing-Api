/*Create connetion strings to connect to mongo db storage and redis storage */
import configuration from "config"

const mongodbConfig = configuration.get("mongodbConfig")
const redisConfig = configuration.get("redisConfig")
const test = configuration.get("test")
/**
 * mongodbConnector -> creates a connection string base on config to connect to the database
 * returns {String}: mongodb connction string
 */
export let mongodbConnector = () => {
    let document = test ? mongodbConfig.documentTest : mongodbConfig.documentDeploy
    let connectionString = "";
    if(mongodbConfig.password || mongodbConfig.username) {
        connectionString = `monodb://${mongodbConfig.username}:${mongodbConfig.password}@${mongodbConfig.host}/${document}`
    } else {
        connectionString = `mongodb://${mongodbConfig.host}:${mongodbConfig.port}/${document}`
    }
    return connectionString
}

/**
 * redisConnector => creates connection string base on configuration to connect to the database
 */
export let redisConnector= () => {
    let connectionString = "";
    if(redisConfig.password || redisConfig.username) {
        connectionStringString = `redis://${redisConfig.username}:${redisConfig.password}@${redisConfig.host}/${redisConfig.dbNumber}`
    } else {
        connectionString = `redis://${redisConfig.host}:${redisConfig.port}`
    }
    return connectionString
} 
console.log(mongodbConnector())