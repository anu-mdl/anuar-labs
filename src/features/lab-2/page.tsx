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
          Назад в меню
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">
            Лабораторная работа №2: Динамическое программирование и оптимизация
          </h1>
          <p className="text-muted-foreground text-lg">
            Изучение динамического программирования и метода ветвей и границ на
            примере последовательности Фибоначчи
          </p>
        </div>

        <Tabs defaultValue="theory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="theory">Теоретическая часть</TabsTrigger>
            <TabsTrigger value="practical">Практическая часть</TabsTrigger>
          </TabsList>

          <TabsContent value="theory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамическое программирование (DP)</CardTitle>
                <CardDescription>
                  Метод оптимизации для решения сложных задач
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Динамическое программирование — это метод оптимизации,
                  основанный на разбиении сложной задачи на более простые
                  подзадачи. Основная идея заключается в сохранении решений уже
                  решённых подзадач, чтобы избежать повторных вычислений и тем
                  самым снизить сложность задачи.
                </p>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Ключевые свойства:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Оптимальная подструктура:</strong> решение задачи
                      зависит от решений её подзадач
                    </li>
                    <li>
                      <strong>Перекрывающиеся подзадачи:</strong> одни и те же
                      подзадачи решаются многократно
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Два основных подхода:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Мемоизация (сверху вниз):</strong> рекурсивный
                      подход с кэшированием результатов
                    </li>
                    <li>
                      <strong>Табуляция (снизу вверх):</strong> итеративный
                      подход, строящий решения от базовых случаев
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Метод ветвей и границ</CardTitle>
                <CardDescription>
                  Эффективное решение задач комбинаторной оптимизации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Метод ветвей и границ — это подход к решению задач
                  комбинаторной оптимизации, который использует дерево решений,
                  но избегает полного перебора за счёт отсечения нерентабельных
                  ветвей.
                </p>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Основные концепции:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Разветвление:</strong> деление задачи на подзадачи
                    </li>
                    <li>
                      <strong>Ограничение:</strong> решение о продолжении
                      исследования ветви или её отсечении на основе текущей
                      оценки
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Этот метод особенно полезен для оптимизационных задач, где
                  необходимо найти лучшее решение среди множества вариантов,
                  например задачи коммивояжёра, задачи о рюкзаке или
                  планирования работ.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Калькулятор последовательности Фибоначчи</CardTitle>
                <CardDescription>
                  Найдите n-й элемент разными методами
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="n-input" className="text-sm font-medium">
                      Введите n (позиция в последовательности Фибоначчи):
                    </label>
                    <Input
                      id="n-input"
                      type="number"
                      min="0"
                      value={n}
                      onChange={(e) => setN(e.target.value)}
                      placeholder="Введите число"
                      className="max-w-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Выберите метод:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant={method === "naive" ? "default" : "outline"}
                        onClick={() => setMethod("naive")}
                        className="justify-start"
                      >
                        Наивная рекурсия (n ≤ 40)
                      </Button>
                      <Button
                        variant={
                          method === "dp-memoization" ? "default" : "outline"
                        }
                        onClick={() => setMethod("dp-memoization")}
                        className="justify-start"
                      >
                        DP — Мемоизация
                      </Button>
                      <Button
                        variant={
                          method === "dp-tabulation" ? "default" : "outline"
                        }
                        onClick={() => setMethod("dp-tabulation")}
                        className="justify-start"
                      >
                        DP — Табуляция
                      </Button>
                      <Button
                        variant={method === "iterative" ? "default" : "outline"}
                        onClick={() => setMethod("iterative")}
                        className="justify-start"
                      >
                        Итеративный (оптимизация по памяти)
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={calculateFibonacci}
                    className="w-full md:w-auto"
                  >
                    Вычислить Фибоначчи
                  </Button>
                </div>

                {result && (
                  <div className="bg-muted/50 p-6 rounded-lg space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Результат:
                      </span>
                      <span className="text-2xl font-bold font-mono">
                        {result}
                      </span>
                    </div>
                    {executionTime && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Время выполнения:
                        </span>
                        <span className="text-lg font-mono">
                          {executionTime}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-sm">Сравнение методов:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>
                      <strong>Наивный:</strong> O(2ⁿ) по времени —
                      экспоненциальный, очень медленный для больших n
                    </li>
                    <li>
                      <strong>Мемоизация:</strong> O(n) по времени, O(n) по
                      памяти — эффективен с рекурсией
                    </li>
                    <li>
                      <strong>Табуляция:</strong> O(n) по времени, O(n) по
                      памяти — итеративный подход снизу вверх
                    </li>
                    <li>
                      <strong>Итеративный:</strong> O(n) по времени, O(1) по
                      памяти — наиболее эффективный по памяти
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
