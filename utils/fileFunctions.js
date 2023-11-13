/**
 * common operations for files
 */

import { ObjectId } from "mongodb";
/**
 * getFileName : genrate a unque file name for a file
 * @returns a unique string object id string that can be use as file name
 */
export function getFileName() {
    return new ObjectId().toString()
}