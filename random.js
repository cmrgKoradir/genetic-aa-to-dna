/**
 * @param {number} the upperBound (non-inclusive)
 * @returns a random integer r where 0 <= r < upperBound
 */
 export function randInt(upperBound){
    return Math.floor(Math.random() * upperBound)
}

/**
 * Implements
 * @param {any[]} items a collection to pick from
 * @param weight a function from an item to its normalized weight
 * @returns a random item based on the weights
 */
export function weightedPick(items, weight){
    var r = Math.random()
    for(const i of items){
        r -= weight(i)
        if (r < 0){
            return i
        }
    }
}