
package main
import "math"

type Suffix struct {
    cumulativeMultiplication  int64
    index64BitIntegerOverflow int
}

const BALANCED_INDEX_NOT_FOUND = -1
const MIN_POSSIBLE_BALANCED_INDEX = 1
const SMALLEST_POSSIBLE_MULTIPLICATION = 1

func smallestBalancedIndex(input []int) int {
    if len(input) <= MIN_POSSIBLE_BALANCED_INDEX {
        return BALANCED_INDEX_NOT_FOUND
    }
    suffix := createSuffix(input)
    return findSmallestBalancedIndex(input, suffix)
}

func createSuffix(input []int) Suffix {
    index64BitIntegerOverflow := 0
    var suffixMultiplication int64 = SMALLEST_POSSIBLE_MULTIPLICATION

    for i := len(input) - 1; i > MIN_POSSIBLE_BALANCED_INDEX; i-- {
        if suffixMultiplication > math.MaxInt64 / int64(input[i]) {
            index64BitIntegerOverflow = i
            break
        }
        suffixMultiplication *= int64(input[i])
    }
    return Suffix{suffixMultiplication, index64BitIntegerOverflow}
}

func findSmallestBalancedIndex(input []int, suffix Suffix) int {
    var suffixMultiplication int64 = suffix.cumulativeMultiplication
    index64BitIntegerOverflow := suffix.index64BitIntegerOverflow

    var prefixSum int64 = 0
    startIndex := max(MIN_POSSIBLE_BALANCED_INDEX, index64BitIntegerOverflow)
    for i := range startIndex {
        prefixSum += int64(input[i])
    }

    smallestBalancedIndex := BALANCED_INDEX_NOT_FOUND
    for i := startIndex; i < len(input); i++ {
        if prefixSum == suffixMultiplication {
            smallestBalancedIndex = i
            break
        }
        if i + 1 < len(input) {
            suffixMultiplication /= int64(input[i + 1])
        }
        prefixSum += int64(input[i])
    }
    return smallestBalancedIndex
}
