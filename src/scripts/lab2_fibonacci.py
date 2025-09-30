"""
Lab 2: Dynamic Programming - Fibonacci Sequence
Find the nth element of the Fibonacci sequence using different approaches
"""

import time
from typing import Dict

def fibonacci_naive(n: int) -> int:
    """
    Naive recursive approach - O(2^n) time complexity
    Very inefficient for large n due to repeated calculations
    """
    if n <= 1:
        return n
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)


def fibonacci_memoization(n: int, memo: Dict[int, int] = None) -> int:
    """
    Dynamic Programming with Memoization (Top-Down approach)
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if memo is None:
        memo = {}
    
    if n <= 1:
        return n
    
    if n in memo:
        return memo[n]
    
    memo[n] = fibonacci_memoization(n - 1, memo) + fibonacci_memoization(n - 2, memo)
    return memo[n]


def fibonacci_tabulation(n: int) -> int:
    """
    Dynamic Programming with Tabulation (Bottom-Up approach)
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if n <= 1:
        return n
    
    # Create a table to store Fibonacci numbers
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    
    # Fill the table in bottom-up manner
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]


def fibonacci_iterative(n: int) -> int:
    """
    Space-optimized iterative approach
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    if n <= 1:
        return n
    
    prev, curr = 0, 1
    
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr


def measure_execution_time(func, n: int, *args) -> tuple:
    """Helper function to measure execution time"""
    start_time = time.time()
    result = func(n, *args)
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Convert to milliseconds
    return result, execution_time


def main():
    print("=" * 60)
    print("Lab 2: Dynamic Programming - Fibonacci Sequence")
    print("=" * 60)
    print()
    
    # Test with different values of n
    test_values = [10, 20, 30, 35]
    
    for n in test_values:
        print(f"\n{'─' * 60}")
        print(f"Finding Fibonacci({n}):")
        print(f"{'─' * 60}")
        
        # Method 1: Naive Recursion (only for small n)
        if n <= 35:
            result, exec_time = measure_execution_time(fibonacci_naive, n)
            print(f"1. Naive Recursion:")
            print(f"   Result: {result}")
            print(f"   Time: {exec_time:.4f} ms")
            print(f"   Complexity: O(2^n) - Exponential")
        else:
            print(f"1. Naive Recursion: Skipped (too slow for n > 35)")
        
        # Method 2: Memoization
        result, exec_time = measure_execution_time(fibonacci_memoization, n)
        print(f"\n2. DP with Memoization (Top-Down):")
        print(f"   Result: {result}")
        print(f"   Time: {exec_time:.4f} ms")
        print(f"   Complexity: O(n) time, O(n) space")
        
        # Method 3: Tabulation
        result, exec_time = measure_execution_time(fibonacci_tabulation, n)
        print(f"\n3. DP with Tabulation (Bottom-Up):")
        print(f"   Result: {result}")
        print(f"   Time: {exec_time:.4f} ms")
        print(f"   Complexity: O(n) time, O(n) space")
        
        # Method 4: Iterative (Space-optimized)
        result, exec_time = measure_execution_time(fibonacci_iterative, n)
        print(f"\n4. Iterative (Space-Optimized):")
        print(f"   Result: {result}")
        print(f"   Time: {exec_time:.4f} ms")
        print(f"   Complexity: O(n) time, O(1) space")
    
    # Demonstrate the first 20 Fibonacci numbers
    print(f"\n\n{'=' * 60}")
    print("First 20 Fibonacci Numbers:")
    print(f"{'=' * 60}")
    
    fib_sequence = []
    for i in range(20):
        fib_sequence.append(fibonacci_iterative(i))
    
    print("Position | Value")
    print("-" * 20)
    for i, value in enumerate(fib_sequence):
        print(f"{i:8} | {value}")
    
    print(f"\n{'=' * 60}")
    print("Key Insights:")
    print(f"{'=' * 60}")
    print("• Naive recursion has exponential time complexity - impractical for n > 40")
    print("• Memoization (top-down DP) caches results to avoid recomputation")
    print("• Tabulation (bottom-up DP) builds solution iteratively from base cases")
    print("• Space-optimized iterative approach uses only O(1) extra space")
    print("• All DP approaches reduce time complexity from O(2^n) to O(n)")
    print()


if __name__ == "__main__":
    main()
