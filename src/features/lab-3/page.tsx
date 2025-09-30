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
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

class Queue<T> {
  private items: T[] = [];
  private head = 0;
  private tail = 0;

  enqueue(element: T): void {
    this.items[this.tail] = element;
    this.tail++;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.head];
    delete this.items[this.head];
    this.head++;
    return item;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[this.head];
  }

  isEmpty(): boolean {
    return this.head === this.tail;
  }

  size(): number {
    return this.tail - this.head;
  }

  toArray(): T[] {
    return this.items.slice(this.head, this.tail);
  }
}

function extractUntilEven(queue: Queue<number>): number[] {
  const extracted: number[] = [];

  while (!queue.isEmpty()) {
    const first = queue.peek();

    if (first !== undefined && first % 2 === 0) {
      break;
    }

    const element = queue.dequeue();
    if (element !== undefined) {
      extracted.push(element);
    }
  }

  return extracted;
}

export default function Lab3() {
  const [inputArray, setInputArray] = useState("1,3,5,7,9,4,6,8");
  const [queue, setQueue] = useState<number[]>([]);
  const [extracted, setExtracted] = useState<number[]>([]);
  const [remainingQueue, setRemainingQueue] = useState<number[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const handleInitializeQueue = () => {
    try {
      const numbers = inputArray.split(",").map((s) => {
        const num = Number.parseInt(s.trim());
        if (isNaN(num)) throw new Error("Invalid number");
        return num;
      });

      setQueue(numbers);
      setExtracted([]);
      setRemainingQueue([]);
      setLog([
        `Initialized queue with ${numbers.length} elements: [${numbers.join(
          ", "
        )}]`,
      ]);
    } catch (error) {
      setLog(["Error: Please enter valid comma-separated integers"]);
    }
  };

  const handleExtractUntilEven = () => {
    const q = new Queue<number>();
    queue.forEach((num) => q.enqueue(num));

    const extractedElements = extractUntilEven(q);
    const remaining = q.toArray();

    setExtracted(extractedElements);
    setRemainingQueue(remaining);

    const newLog = [
      `Starting extraction process...`,
      `Extracted ${
        extractedElements.length
      } odd elements: [${extractedElements.join(", ")}]`,
      remaining.length > 0
        ? `Stopped at first even element: ${remaining[0]}`
        : `Queue is now empty (no even elements found)`,
      `Remaining queue: [${remaining.join(", ")}]`,
    ];
    setLog(newLog);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            Lab 3: Stack and Queue
          </h1>
          <p className="text-lg text-muted-foreground">
            Understanding LIFO and FIFO data structures
          </p>
        </div>

        <div className="space-y-8">
          {/* Theoretical Part */}
          <Card>
            <CardHeader>
              <CardTitle>Theoretical Part</CardTitle>
              <CardDescription>
                Understanding Stack and Queue data structures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Stack (LIFO - Last In, First Out)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A stack is one of the simplest data structures, representing
                  more of a limitation of a simple array than an extension of
                  it. A classic stack supports only three operations:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    <strong>Push:</strong> Add an element to the stack
                    (Complexity: O(1))
                  </li>
                  <li>
                    <strong>Pop:</strong> Remove an element from the stack
                    (Complexity: O(1))
                  </li>
                  <li>
                    <strong>IsEmpty:</strong> Check if the stack is empty
                    (Complexity: O(1))
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  An analogy with a glass of cookies is often used to explain
                  how a stack works. Imagine that there are several cookies at
                  the bottom of your glass. You can put another piece on top or
                  take the one that is already on top. The rest of the pieces
                  are covered by the top one, and you know nothing about them.
                  The abbreviation <strong>LIFO (Last In, First Out)</strong> is
                  often used to describe a stack, emphasizing that the element
                  that was added to the stack last will be removed from it
                  first.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Queue (FIFO - First In, First Out)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A queue supports the same set of operations as a stack, but
                  has the opposite semantics. The abbreviation{" "}
                  <strong>FIFO (First In, First Out)</strong> is used to
                  describe a queue, since the first element added to the queue
                  is the first to be removed from it. The name of this structure
                  speaks for itself: the principle of operation is the same as
                  for ordinary queues in a store or at the post office.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The implementation of a queue is similar to the implementation
                  of a stack, but this time two pointers are needed: for the
                  first element of the queue (the "head") and the last (the
                  "tail").
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Practical Part */}
          <Card>
            <CardHeader>
              <CardTitle>Practical Part</CardTitle>
              <CardDescription>
                Extract elements from queue until the first element becomes even
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Enter comma-separated integers:
                </label>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    value={inputArray}
                    onChange={(e) => setInputArray(e.target.value)}
                    placeholder="e.g., 1,3,5,7,9,4,6,8"
                    className="flex-1"
                  />
                  <Button onClick={handleInitializeQueue}>
                    Initialize Queue
                  </Button>
                </div>
              </div>

              {queue.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-foreground">
                      Current Queue:
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {queue.map((num, idx) => (
                        <div
                          key={idx}
                          className={`px-4 py-2 rounded-md font-mono ${
                            num % 2 === 0
                              ? "bg-green-500/20 text-green-700 dark:text-green-300"
                              : "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Head (front) → Tail (back)
                    </p>
                  </div>

                  <Button onClick={handleExtractUntilEven} className="w-full">
                    Extract Until First Even Element
                  </Button>
                </div>
              )}

              {extracted.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-foreground">
                      Extracted Elements:
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {extracted.map((num, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 rounded-md font-mono bg-red-500/20 text-red-700 dark:text-red-300"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-foreground">
                      Remaining Queue:
                    </h4>
                    {remainingQueue.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {remainingQueue.map((num, idx) => (
                          <div
                            key={idx}
                            className={`px-4 py-2 rounded-md font-mono ${
                              idx === 0
                                ? "bg-green-500/30 text-green-700 dark:text-green-300 ring-2 ring-green-500"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Queue is empty</p>
                    )}
                  </div>
                </div>
              )}

              {log.length > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">
                    Execution Log:
                  </h4>
                  <div className="space-y-1 font-mono text-sm">
                    {log.map((entry, idx) => (
                      <div key={idx} className="text-muted-foreground">
                        {entry}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Implementation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">
                  Queue Class
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Queue class uses two pointers (head and tail) to
                  efficiently manage elements. Enqueue adds elements at the
                  tail, while dequeue removes from the head.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">
                  Extract Until Even Algorithm
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The function continuously checks the first element (head) of
                  the queue. If it's odd, the element is dequeued and added to
                  the extracted list. This continues until an even number is
                  found at the head or the queue becomes empty.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">
                  Time Complexity
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each operation (enqueue, dequeue, peek) has O(1) complexity.
                  The extraction function has O(n) complexity in the worst case,
                  where n is the number of elements before the first even
                  number.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
