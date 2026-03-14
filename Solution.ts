
function smallestBalancedIndex(input: number[]): number {
    if (input.length <= Util.MIN_POSSIBLE_BALANCED_INDEX) {
        return Util.BALANCED_INDEX_NOT_FOUND;
    }
    const suffix = createSuffix(input);
    return findSmallestBalancedIndex(input, suffix);
};

function createSuffix(input: number[]): Suffix {
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

function findSmallestBalancedIndex(input: number[], suffix: Suffix): number {
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
    constructor(public cumulativeMultiplication: number, public index64BitIntegerOverflow: number) {
    }
}

class Util {
    static BALANCED_INDEX_NOT_FOUND = -1;
    static MIN_POSSIBLE_BALANCED_INDEX = 1;
    static SMALLEST_POSSIBLE_MULTIPLICATION = 1;
}
