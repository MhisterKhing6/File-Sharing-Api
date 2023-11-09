/*Create connetion strings to connect to mongo db storage and redis storage */
import configuration from "config"

const test = configuration.get("test")
/**
 * mongodbConnector -> creates a connection string base on config to connect to the database
 * returns {String}: mongodb connction string
 */
export let mongodbConnector = (mongodbConfig) => {
    let document = test ? mongodbConfig.documentTest : mongodbConfig.documentDeploy
    let connectionString = "";
    if(mongodbConfig.password || mongodbConfig.username) {
        connectionString = `mongodb://${mongodbConfig.username}:${mongodbConfig.password}@${mongodbConfig.host}:${mongodbConfig.port}/${document}`
    } else {
        connectionString = `mongodb://${mongodbConfig.host}:${mongodbConfig.port}/${document}`
    }
    return connectionString
}

/**
 * redisConnector => creates connection string base on configuration to connect to the database
 */
export let redisConnector= (redisConfig) => {
    let connectionString = "";
    if(redisConfig.password || redisConfig.username) {
        connectionString = `redis://${redisConfig.username}:${redisConfig.password}@${redisConfig.host}/${redisConfig.dbNumber}`
    } else {
        connectionString = `redis://${redisConfig.host}:${redisConfig.port}`
    }
    return connectionString
} 
