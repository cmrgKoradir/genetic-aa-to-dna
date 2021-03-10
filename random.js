/**
 * @param {number} the upperBound (non-inclusive)
 * @returns a random integer r where 0 <= r < upperBound
 */
 export function randInt(upperBound){
    return Math.floor(Math.random() * upperBound)
}