
#include <span>
#include <limits>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {

    struct Suffix {
        long long cumulativeMultiplication{};
        int index64BitIntegerOverflow{};
        Suffix(long long cumulativeMultiplication, int index64BitIntegerOverflow)
            :cumulativeMultiplication{ cumulativeMultiplication },
             index64BitIntegerOverflow{ index64BitIntegerOverflow }{}
    };

    static const int BALANCED_INDEX_NOT_FOUND = -1;
    static const int MIN_POSSIBLE_BALANCED_INDEX = 1;
    static const int SMALLEST_POSSIBLE_MULTIPLICATION = 1;

public:
    int smallestBalancedIndex(vector<int>& input) {
        if (input.size() <= MIN_POSSIBLE_BALANCED_INDEX) {
            return BALANCED_INDEX_NOT_FOUND;
        }
        Suffix suffix = createSuffix(input);
        return findSmallestBalancedIndex(input, suffix);
    }

private:
    static Suffix createSuffix(span<const int> input) {
        int index64BitIntegerOverflow = 0;
        long long suffixMultiplication = SMALLEST_POSSIBLE_MULTIPLICATION;

        for (int i = input.size() - 1; i > MIN_POSSIBLE_BALANCED_INDEX; --i) {
            if (suffixMultiplication > numeric_limits<long long>::max() / input[i]) {
                index64BitIntegerOverflow = i;
                break;
            }
            suffixMultiplication *= input[i];
        }
        return Suffix(suffixMultiplication, index64BitIntegerOverflow);
    }

    int findSmallestBalancedIndex(span<const int> input, Suffix suffix) {
        long long suffixMultiplication = suffix.cumulativeMultiplication;
        int index64BitIntegerOverflow = suffix.index64BitIntegerOverflow;

        long long prefixSum = 0;
        int startIndex = max(MIN_POSSIBLE_BALANCED_INDEX, index64BitIntegerOverflow);
        for (int i = 0; i < startIndex; ++i) {
            prefixSum += input[i];
        }

        int smallestBalancedIndex = BALANCED_INDEX_NOT_FOUND;
        for (int i = startIndex; i < input.size(); ++i) {
            if (prefixSum == suffixMultiplication) {
                smallestBalancedIndex = i;
                break;
            }
            if (i + 1 < input.size()) {
                suffixMultiplication /= input[i + 1];
            }
            prefixSum += input[i];
        }
        return smallestBalancedIndex;
    }
};
