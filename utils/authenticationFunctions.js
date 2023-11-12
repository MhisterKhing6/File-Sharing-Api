import sha1 from "sha1";
import {v4} from "uuid"
/**
 * Funcitons for authentication
 *   
 */


/**
 * encryptPassword : encrypted password
 * @param {string} password 
 * @returns {string}: sha1 encrypted password
 */
export function encryptPassword(password) {
    return sha1(password)
}

/**
 * generateToken : generate a token for a user
 * returns {string}: generated token
 */
export function generateToken() {
    return v4()
}