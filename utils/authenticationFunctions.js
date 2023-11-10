import sha1 from "sha1"
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

