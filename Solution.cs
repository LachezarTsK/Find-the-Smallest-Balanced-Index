
using System;

public class Solution
{
    private record Suffix(long CumulativeMultiplication, int Index64BitIntegerOverflow){}

    private static readonly int BALANCED_INDEX_NOT_FOUND = -1;
    private static readonly int MIN_POSSIBLE_BALANCED_INDEX = 1;
    private static readonly int SMALLEST_POSSIBLE_MULTIPLICATION = 1;

    public int SmallestBalancedIndex(int[] input)
    {
        if (input.Length <= MIN_POSSIBLE_BALANCED_INDEX)
        {
            return BALANCED_INDEX_NOT_FOUND;
        }
        Suffix suffix = CreateSuffix(input);
        return FindSmallestBalancedIndex(input, suffix);
    }

    private static Suffix CreateSuffix(int[] input)
    {
        int index64BitIntegerOverflow = 0;
        long suffixMultiplication = SMALLEST_POSSIBLE_MULTIPLICATION;

        for (int i = input.Length - 1; i > MIN_POSSIBLE_BALANCED_INDEX; --i)
        {
            if (suffixMultiplication > long.MaxValue / input[i])
            {
                index64BitIntegerOverflow = i;
                break;
            }
            suffixMultiplication *= input[i];
        }
        return new Suffix(suffixMultiplication, index64BitIntegerOverflow);
    }

    private static int FindSmallestBalancedIndex(int[] input, Suffix suffix)
    {
        long suffixMultiplication = suffix.CumulativeMultiplication;
        int index64BitIntegerOverflow = suffix.Index64BitIntegerOverflow;

        long prefixSum = 0;
        int startIndex = Math.Max(MIN_POSSIBLE_BALANCED_INDEX, index64BitIntegerOverflow);
        for (int i = 0; i < startIndex; ++i)
        {
            prefixSum += input[i];
        }

        int smallestBalancedIndex = BALANCED_INDEX_NOT_FOUND;
        for (int i = startIndex; i < input.Length; ++i)
        {
            if (prefixSum == suffixMultiplication)
            {
                smallestBalancedIndex = i;
                break;
            }
            if (i + 1 < input.Length)
            {
                suffixMultiplication /= input[i + 1];
            }
            prefixSum += input[i];
        }
        return smallestBalancedIndex;
    }
}
