/** helper functions for verifications */

/**
 * verifymandatoryFields -> checks if an objects contains all the  required fields or keys 
 * @param {array} requiredFields : fields or keys required for objects
 * @param {object} itemObject  : object with fields or keys to check
 * @returns {array}: array of missing keys
 */
export function verifyMandatoryFields(requiredFields, itemObject) {
    let missingFields = []
    for(const requiredKey of requiredFields) {
        if(!itemObject[requiredKey]) {
            missingFields.push(requiredKey)
        }
    }
    return missingFields
}