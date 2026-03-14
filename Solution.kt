
import kotlin.math.max

class Solution {

    private data class Suffix(val cumulativeMultiplication: Long, val index64BitIntegerOverflow: Int)

    private companion object {
        const val BALANCED_INDEX_NOT_FOUND = -1
        const val MIN_POSSIBLE_BALANCED_INDEX = 1
        const val SMALLEST_POSSIBLE_MULTIPLICATION = 1
    }

    fun smallestBalancedIndex(input: IntArray): Int {
        if (input.size <= MIN_POSSIBLE_BALANCED_INDEX) {
            return BALANCED_INDEX_NOT_FOUND
        }
        val suffix = createSuffix(input)
        return findSmallestBalancedIndex(input, suffix)
    }

    private fun createSuffix(input: IntArray): Suffix {
        var index64BitIntegerOverflow = 0
        var suffixMultiplication: Long = SMALLEST_POSSIBLE_MULTIPLICATION.toLong()

        for (i in input.size - 1 downTo 1 + MIN_POSSIBLE_BALANCED_INDEX) {
            if (suffixMultiplication > Long.MAX_VALUE / input[i]) {
                index64BitIntegerOverflow = i
                break
            }
            suffixMultiplication *= input[i]
        }
        return Suffix(suffixMultiplication, index64BitIntegerOverflow)
    }

    private fun findSmallestBalancedIndex(input: IntArray, suffix: Suffix): Int {
        var suffixMultiplication: Long = suffix.cumulativeMultiplication
        val index64BitIntegerOverflow = suffix.index64BitIntegerOverflow

        var prefixSum: Long = 0
        val startIndex: Int = max(MIN_POSSIBLE_BALANCED_INDEX, index64BitIntegerOverflow)
        for (i in 0..<startIndex) {
            prefixSum += input[i]
        }

        var smallestBalancedIndex = BALANCED_INDEX_NOT_FOUND
        for (i in startIndex..<input.size) {
            if (prefixSum == suffixMultiplication) {
                smallestBalancedIndex = i
                break
            }
            if (i + 1 < input.size) {
                suffixMultiplication /= input[i + 1]
            }
            prefixSum += input[i]
        }
        return smallestBalancedIndex
    }
}
