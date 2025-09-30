"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Lab2() {
  const [n, setN] = useState<string>("10");
  const [result, setResult] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<string>("");
  const [method, setMethod] = useState<string>("dp-memoization");

  // Naive recursive approach (inefficient for large n)
  const fibonacciNaive = (num: number): number => {
    if (num <= 1) return num;
    return fibonacciNaive(num - 1) + fibonacciNaive(num - 2);
  };

  // Dynamic Programming with Memoization (Top-Down)
  const fibonacciMemoization = (
    num: number,
    memo: Map<number, number> = new Map()
  ): number => {
    if (num <= 1) return num;
    if (memo.has(num)) return memo.get(num)!;

    const result =
      fibonacciMemoization(num - 1, memo) + fibonacciMemoization(num - 2, memo);
    memo.set(num, result);
    return result;
  };

  // Dynamic Programming with Tabulation (Bottom-Up)
  const fibonacciTabulation = (num: number): number => {
    if (num <= 1) return num;

    const dp: number[] = new Array(num + 1);
    dp[0] = 0;
    dp[1] = 1;

    for (let i = 2; i <= num; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[num];
  };

  // Space-optimized iterative approach
  const fibonacciIterative = (num: number): number => {
    if (num <= 1) return num;

    let prev = 0;
    let curr = 1;

    for (let i = 2; i <= num; i++) {
      const temp = curr;
      curr = prev + curr;
      prev = temp;
    }

    return curr;
  };

  const calculateFibonacci = () => {
    const num = Number.parseInt(n);

    if (isNaN(num) || num < 0) {
      setResult("Please enter a valid non-negative number");
      setExecutionTime("");
      return;
    }

    if (method === "naive" && num > 40) {
      setResult(
        "Naive recursion is too slow for n > 40. Please choose another method."
      );
      setExecutionTime("");
      return;
    }

    const startTime = performance.now();
    let fibResult: number;

    switch (method) {
      case "naive":
        fibResult = fibonacciNaive(num);
        break;
      case "dp-memoization":
        fibResult = fibonacciMemoization(num);
        break;
      case "dp-tabulation":
        fibResult = fibonacciTabulation(num);
        break;
      case "iterative":
        fibResult = fibonacciIterative(num);
        break;
      default:
        fibResult = fibonacciMemoization(num);
    }

    const endTime = performance.now();

    setResult(fibResult.toString());
    setExecutionTime(`${(endTime - startTime).toFixed(4)} ms`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">
            Lab 2: Dynamic Programming & Optimization
          </h1>
          <p className="text-muted-foreground text-lg">
            Exploring dynamic programming and branch & bound methods through
            Fibonacci sequence
          </p>
        </div>

        <Tabs defaultValue="theory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="theory">Theoretical Part</TabsTrigger>
            <TabsTrigger value="practical">
              Practical Implementation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Programming (DP)</CardTitle>
                <CardDescription>
                  An optimization method for solving complex problems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Dynamic programming is an optimization method based on
                  breaking down a complex problem into simpler subproblems. Its
                  main idea is to store the solutions to already solved
                  subproblems to prevent repeated calculations, thereby reducing
                  the complexity of the problem.
                </p>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Key Properties:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Optimal Substructure:</strong> The solution to the
                      problem depends on the solutions to its subproblems
                    </li>
                    <li>
                      <strong>Overlapping Subproblems:</strong> The same
                      subproblems are solved multiple times
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Two Main Approaches:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Memoization (Top-Down):</strong> Recursive
                      approach with caching of results
                    </li>
                    <li>
                      <strong>Tabulation (Bottom-Up):</strong> Iterative
                      approach building solutions from base cases
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branch and Bound Method</CardTitle>
                <CardDescription>
                  Solving combinatorial optimization problems efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  The branch and bound method is an approach to solving
                  combinatorial optimization problems that uses a complete
                  decision tree but avoids exhaustive search by pruning
                  unprofitable branches.
                </p>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Core Concepts:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Branching:</strong> Dividing the problem into
                      subproblems
                    </li>
                    <li>
                      <strong>Bounding:</strong> Determining whether to continue
                      exploring a branch or prune it based on current evaluation
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  This method is particularly useful for optimization problems
                  where we need to find the best solution among many
                  possibilities, such as the traveling salesman problem,
                  knapsack problem, or job scheduling.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fibonacci Sequence Calculator</CardTitle>
                <CardDescription>
                  Find the nth element using different approaches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="n-input" className="text-sm font-medium">
                      Enter n (position in Fibonacci sequence):
                    </label>
                    <Input
                      id="n-input"
                      type="number"
                      min="0"
                      value={n}
                      onChange={(e) => setN(e.target.value)}
                      placeholder="Enter a number"
                      className="max-w-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Method:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant={method === "naive" ? "default" : "outline"}
                        onClick={() => setMethod("naive")}
                        className="justify-start"
                      >
                        Naive Recursion (n ≤ 40)
                      </Button>
                      <Button
                        variant={
                          method === "dp-memoization" ? "default" : "outline"
                        }
                        onClick={() => setMethod("dp-memoization")}
                        className="justify-start"
                      >
                        DP - Memoization
                      </Button>
                      <Button
                        variant={
                          method === "dp-tabulation" ? "default" : "outline"
                        }
                        onClick={() => setMethod("dp-tabulation")}
                        className="justify-start"
                      >
                        DP - Tabulation
                      </Button>
                      <Button
                        variant={method === "iterative" ? "default" : "outline"}
                        onClick={() => setMethod("iterative")}
                        className="justify-start"
                      >
                        Iterative (Space-Optimized)
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={calculateFibonacci}
                    className="w-full md:w-auto"
                  >
                    Calculate Fibonacci
                  </Button>
                </div>

                {result && (
                  <div className="bg-muted/50 p-6 rounded-lg space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Result:
                      </span>
                      <span className="text-2xl font-bold font-mono">
                        {result}
                      </span>
                    </div>
                    {executionTime && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Execution Time:
                        </span>
                        <span className="text-lg font-mono">
                          {executionTime}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm">Method Comparison:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>
                      <strong>Naive:</strong> O(2ⁿ) time - exponential, very
                      slow for large n
                    </li>
                    <li>
                      <strong>Memoization:</strong> O(n) time, O(n) space -
                      efficient with recursion
                    </li>
                    <li>
                      <strong>Tabulation:</strong> O(n) time, O(n) space -
                      iterative bottom-up approach
                    </li>
                    <li>
                      <strong>Iterative:</strong> O(n) time, O(1) space - most
                      space-efficient
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
