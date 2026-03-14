
/**
 * @param {number[]} input
 * @return {number}
 */
var smallestBalancedIndex = function (input) {
    if (input.length <= Util.MIN_POSSIBLE_BALANCED_INDEX) {
        return Util.BALANCED_INDEX_NOT_FOUND;
    }
    const suffix = createSuffix(input);
    return findSmallestBalancedIndex(input, suffix);
};

/**
 * @param {number[]} input
 * @return {Suffix}
 */
function createSuffix(input) {
    let index64BitIntegerOverflow = 0;
    let suffixMultiplication = Util.SMALLEST_POSSIBLE_MULTIPLICATION;

    for (let i = input.length - 1; i > Util.MIN_POSSIBLE_BALANCED_INDEX; --i) {
        if (suffixMultiplication > Number.MAX_SAFE_INTEGER / input[i]) {
            index64BitIntegerOverflow = i;
            break;
        }
        suffixMultiplication *= input[i];
    }
    return new Suffix(suffixMultiplication, index64BitIntegerOverflow);
}

/**
 * @param {number[]} input
 * @param {Suffix} suffix 
 * @return {number}
 */
function findSmallestBalancedIndex(input, suffix) {
    let suffixMultiplication = suffix.cumulativeMultiplication;
    const index64BitIntegerOverflow = suffix.index64BitIntegerOverflow;

    let prefixSum = 0;
    let startIndex = Math.max(Util.MIN_POSSIBLE_BALANCED_INDEX, index64BitIntegerOverflow);
    for (let i = 0; i < startIndex; ++i) {
        prefixSum += input[i];
    }

    let smallestBalancedIndex = Util.BALANCED_INDEX_NOT_FOUND;
    for (let i = startIndex; i < input.length; ++i) {
        if (prefixSum === suffixMultiplication) {
            smallestBalancedIndex = i;
            break;
        }
        if (i + 1 < input.length) {
            suffixMultiplication /= input[i + 1];
        }
        prefixSum += input[i];
    }
    return smallestBalancedIndex;
}

class Suffix {
    /**
     * @param {number} cumulativeMultiplication
     * @param {number}index64BitIntegerOverflow
     */
    constructor(cumulativeMultiplication, index64BitIntegerOverflow) {
        this.cumulativeMultiplication = cumulativeMultiplication;
        this.index64BitIntegerOverflow = index64BitIntegerOverflow;
    }
}

class Util {
    static BALANCED_INDEX_NOT_FOUND = -1;
    static MIN_POSSIBLE_BALANCED_INDEX = 1;
    static SMALLEST_POSSIBLE_MULTIPLICATION = 1;
}
