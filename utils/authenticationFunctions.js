import sha1 from "sha1";
import {v4} from "uuid"
import sessionStorage from "./sessionStorage.js";
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

 /* 
    getCookie: returns session id cookie from a request object
    @param {req}: a request that has the user cookie set
    @return: cookie if set else null_otherwise
*/
export function getSessionIdFromCookie(req) {
    return req.cookies.sId;
}

