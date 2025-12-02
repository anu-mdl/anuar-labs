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
    } catch {
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
          Назад в меню
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            Лабораторная работа №3: Стек и Очередь
          </h1>
          <p className="text-lg text-muted-foreground">
            Понимание структур данных LIFO и FIFO
          </p>
        </div>

        <div className="space-y-8">
          {/* Теоретическая часть */}
          <Card>
            <CardHeader>
              <CardTitle>Теоретическая часть</CardTitle>
              <CardDescription>
                Изучение структур данных Стек и Очередь
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Стек (LIFO — Last In, First Out / Последним пришёл — первым
                  вышел)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Стек — одна из простейших структур данных, представляющая
                  скорее ограничение массива, чем его расширение. Классический
                  стек поддерживает только три операции:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    <strong>Push:</strong> Добавить элемент в стек (Сложность:
                    O(1))
                  </li>
                  <li>
                    <strong>Pop:</strong> Удалить элемент из стека (Сложность:
                    O(1))
                  </li>
                  <li>
                    <strong>IsEmpty:</strong> Проверить, пуст ли стек
                    (Сложность: O(1))
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Для объяснения работы стека часто используют аналогию со
                  стаканом печенья. Представьте, что на дне стакана лежат
                  несколько печений. Вы можете положить новое сверху или взять
                  то, что уже лежит сверху. Остальные печенья скрыты под
                  верхним, и вы о них ничего не знаете. Аббревиатура{" "}
                  <strong>LIFO</strong> подчёркивает, что элемент, добавленный в
                  стек последним, будет удалён первым.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Очередь (FIFO — First In, First Out / Первым пришёл — первым
                  вышел)
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Очередь поддерживает тот же набор операций, что и стек, но
                  имеет противоположную семантику. Аббревиатура{" "}
                  <strong>FIFO</strong> означает, что первый добавленный в
                  очередь элемент будет извлечён первым. Название структуры
                  говорит само за себя: принцип её работы такой же, как у
                  обычных очередей в магазине или на почте.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Реализация очереди похожа на реализацию стека, но здесь нужны
                  два указателя: на первый элемент очереди («голова») и на
                  последний («хвост»).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Практическая часть */}
          <Card>
            <CardHeader>
              <CardTitle>Практическая часть</CardTitle>
              <CardDescription>
                Извлечение элементов из очереди до тех пор, пока первый элемент
                не станет чётным
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Введите целые числа через запятую:
                </label>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    value={inputArray}
                    onChange={(e) => setInputArray(e.target.value)}
                    placeholder="например, 1,3,5,7,9,4,6,8"
                    className="flex-1"
                  />
                  <Button onClick={handleInitializeQueue}>
                    Инициализировать очередь
                  </Button>
                </div>
              </div>

              {queue.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-foreground">
                      Текущая очередь:
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
                      Голова (начало) → Хвост (конец)
                    </p>
                  </div>

                  <Button onClick={handleExtractUntilEven} className="w-full">
                    Извлекать до первого чётного элемента
                  </Button>
                </div>
              )}

              {extracted.length > 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2 text-foreground">
                      Извлечённые элементы:
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
                      Оставшаяся очередь:
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
                      <p className="text-muted-foreground">Очередь пуста</p>
                    )}
                  </div>
                </div>
              )}

              {log.length > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2 text-foreground">
                    Журнал выполнения:
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

          {/* Детали реализации */}
          <Card>
            <CardHeader>
              <CardTitle>Детали реализации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">
                  Класс Очередь
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Класс Очередь использует два указателя (голову и хвост) для
                  эффективного управления элементами. Операция enqueue добавляет
                  элементы в хвост, а dequeue — удаляет из головы.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">
                  Алгоритм «Извлекать до чётного»
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Функция непрерывно проверяет первый элемент (голову) очереди.
                  Если он нечётный, элемент удаляется (dequeue) и добавляется в
                  список извлечённых. Это продолжается до тех пор, пока на
                  голове не окажется чётное число или очередь не опустеет.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">
                  Временная сложность
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Каждая операция (enqueue, dequeue, peek) имеет сложность O(1).
                  Функция извлечения имеет сложность O(n) в худшем случае, где n
                  — количество элементов до первого чётного числа.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
