
public class Solution {

    private record Suffix(long cumulativeMultiplication, int index64BitIntegerOverflow) {}

    private static final int BALANCED_INDEX_NOT_FOUND = -1;
    private static final int MIN_POSSIBLE_BALANCED_INDEX = 1;
    private static final int SMALLEST_POSSIBLE_MULTIPLICATION = 1;

    public int smallestBalancedIndex(int[] input) {
        if (input.length <= MIN_POSSIBLE_BALANCED_INDEX) {
            return BALANCED_INDEX_NOT_FOUND;
        }
        Suffix suffix = createSuffix(input);
        return findSmallestBalancedIndex(input, suffix);
    }

    private static Suffix createSuffix(int[] input) {
        int index64BitIntegerOverflow = 0;
        long suffixMultiplication = SMALLEST_POSSIBLE_MULTIPLICATION;

        for (int i = input.length - 1; i > MIN_POSSIBLE_BALANCED_INDEX; --i) {
            if (suffixMultiplication > Long.MAX_VALUE / input[i]) {
                index64BitIntegerOverflow = i;
                break;
            }
            suffixMultiplication *= input[i];
        }
        return new Suffix(suffixMultiplication, index64BitIntegerOverflow);
    }

    private static int findSmallestBalancedIndex(int[] input, Suffix suffix) {
        long suffixMultiplication = suffix.cumulativeMultiplication;
        int index64BitIntegerOverflow = suffix.index64BitIntegerOverflow;

        long prefixSum = 0;
        int startIndex = Math.max(MIN_POSSIBLE_BALANCED_INDEX, index64BitIntegerOverflow);
        for (int i = 0; i < startIndex; ++i) {
            prefixSum += input[i];
        }

        int smallestBalancedIndex = BALANCED_INDEX_NOT_FOUND;
        for (int i = startIndex; i < input.length; ++i) {
            if (prefixSum == suffixMultiplication) {
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
}
