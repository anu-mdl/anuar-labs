"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Hash Table Node for Chaining
interface HashNode {
  key: string;
  value: string;
  next: HashNode | null;
}

// Hash Table Class with Chaining
class HashTable {
  private buckets: (HashNode | null)[];
  private size: number;
  private count: number;

  constructor(size = 11) {
    this.size = size;
    this.buckets = new Array(size).fill(null);
    this.count = 0;
  }

  // Hash function: sum of cubes of ASCII codes mod table size
  hash(key: string): number {
    let sum = 0;
    for (let i = 0; i < key.length; i++) {
      const ascii = key.charCodeAt(i);
      sum += ascii * ascii * ascii; // cube of ASCII code
    }
    return sum % this.size;
  }

  // Insert key-value pair
  insert(key: string, value: string): { index: number; isCollision: boolean } {
    const index = this.hash(key);
    const isCollision = this.buckets[index] !== null;

    const newNode: HashNode = { key, value, next: null };

    // Check if key already exists
    let current = this.buckets[index];
    while (current) {
      if (current.key === key) {
        current.value = value; // Update existing
        return { index, isCollision };
      }
      current = current.next;
    }

    // Add to front of chain (chaining method)
    newNode.next = this.buckets[index];
    this.buckets[index] = newNode;
    this.count++;

    return { index, isCollision };
  }

  // Search for a key
  search(key: string): { value: string | null; index: number; steps: number } {
    const index = this.hash(key);
    let current = this.buckets[index];
    let steps = 0;

    while (current) {
      steps++;
      if (current.key === key) {
        return { value: current.value, index, steps };
      }
      current = current.next;
    }

    return { value: null, index, steps };
  }

  // Delete a key
  delete(key: string): boolean {
    const index = this.hash(key);
    let current = this.buckets[index];
    let prev: HashNode | null = null;

    while (current) {
      if (current.key === key) {
        if (prev) {
          prev.next = current.next;
        } else {
          this.buckets[index] = current.next;
        }
        this.count--;
        return true;
      }
      prev = current;
      current = current.next;
    }

    return false;
  }

  // Get all buckets for visualization
  getBuckets(): { index: number; chain: { key: string; value: string }[] }[] {
    return this.buckets.map((bucket, index) => {
      const chain: { key: string; value: string }[] = [];
      let current = bucket;
      while (current) {
        chain.push({ key: current.key, value: current.value });
        current = current.next;
      }
      return { index, chain };
    });
  }

  getSize(): number {
    return this.size;
  }

  getCount(): number {
    return this.count;
  }

  getLoadFactor(): number {
    return this.count / this.size;
  }
}

// Calculate hash step by step for visualization
function calculateHashSteps(
  key: string,
  tableSize: number
): { char: string; ascii: number; cube: number }[] {
  const steps: { char: string; ascii: number; cube: number }[] = [];
  for (let i = 0; i < key.length; i++) {
    const char = key[i];
    const ascii = key.charCodeAt(i);
    const cube = ascii * ascii * ascii;
    steps.push({ char, ascii, cube });
  }
  return steps;
}

export default function Lab7Page() {
  const [hashTable] = useState(() => new HashTable(11));
  const [buckets, setBuckets] = useState(hashTable.getBuckets());
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    value?: string;
    index?: number;
    steps?: number;
  } | null>(null);
  const [lastOperation, setLastOperation] = useState<{
    type: string;
    key: string;
    index: number;
    isCollision?: boolean;
  } | null>(null);
  const [hashSteps, setHashSteps] = useState<
    { char: string; ascii: number; cube: number }[] | null
  >(null);
  const [activeTab, setActiveTab] = useState<"theory" | "practice">("theory");

  const handleInsert = () => {
    if (!key.trim() || !value.trim()) return;
    const steps = calculateHashSteps(key, hashTable.getSize());
    setHashSteps(steps);
    const result = hashTable.insert(key, value);
    setBuckets(hashTable.getBuckets());
    setLastOperation({
      type: "insert",
      key,
      index: result.index,
      isCollision: result.isCollision,
    });
    setKey("");
    setValue("");
  };

  const handleSearch = () => {
    if (!searchKey.trim()) return;
    const steps = calculateHashSteps(searchKey, hashTable.getSize());
    setHashSteps(steps);
    const result = hashTable.search(searchKey);
    setSearchResult({
      found: result.value !== null,
      value: result.value || undefined,
      index: result.index,
      steps: result.steps,
    });
    setLastOperation({ type: "search", key: searchKey, index: result.index });
  };

  const handleDelete = () => {
    if (!searchKey.trim()) return;
    const index = hashTable.hash(searchKey);
    const deleted = hashTable.delete(searchKey);
    setBuckets(hashTable.getBuckets());
    setLastOperation({ type: "delete", key: searchKey, index });
    setSearchResult(deleted ? { found: false } : null);
  };

  const loadSampleData = () => {
    const samples = [
      ["apple", "A sweet red fruit"],
      ["banana", "A yellow tropical fruit"],
      ["cherry", "A small red stone fruit"],
      ["date", "A sweet brown fruit"],
      ["elderberry", "A dark purple berry"],
      ["fig", "A soft sweet fruit"],
      ["grape", "A small juicy fruit"],
      ["honeydew", "A green melon"],
    ];
    samples.forEach(([k, v]) => hashTable.insert(k, v));
    setBuckets(hashTable.getBuckets());
    setLastOperation(null);
    setHashSteps(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад в меню
          </Link>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-sm font-mono text-muted-foreground">
              Лабораторная 7
            </span>
            <h1 className="text-3xl font-light text-foreground">
              Хеш-таблицы и обработка коллизий
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Реализация хеш-функции с использованием кубов ASCII-кодов и
            обработка коллизий методом цепочек.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("theory")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "theory"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Теоретическая часть
            </button>
            <button
              onClick={() => setActiveTab("practice")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "practice"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Практическая часть
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === "theory" ? (
          <div className="space-y-12">
            {/* Hash Tables Overview */}
            <section>
              <h2 className="text-2xl font-light text-foreground mb-6">
                Хеш-таблицы
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Хеш-таблица — это структура данных, реализующая
                  ассоциативный массив, структуру, которая может отображать
                  ключи на значения. Она использует хеш-функцию для вычисления
                  индекса в массиве корзин или слотов, из которого можно найти
                  нужное значение. В идеале хеш-функция присваивает каждому
                  ключу уникальную корзину, но большинство дизайнов хеш-таблиц
                  используют несовершенную хеш-функцию, которая может вызывать
                  коллизии хешей.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Ключевые свойства
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <span className="text-foreground font-mono text-sm">
                        O(1)
                      </span>
                      <span>
                        Средняя временная сложность для вставки, поиска, удаления
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-foreground font-mono text-sm">
                        O(n)
                      </span>
                      <span>Худший случай, когда все ключи хешируются в одну корзину</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-foreground font-mono text-sm">
                        O(n)
                      </span>
                      <span>Сложность по памяти для n элементов</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Требования к хеш-функции
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <p>
                      <span className="text-foreground">Детерминированность:</span>{" "}
                      Один и тот же вход всегда дает один и тот же выход
                    </p>
                    <p>
                      <span className="text-foreground">
                        Равномерное распределение:
                      </span>{" "}
                      Ключи равномерно распределяются по корзинам
                    </p>
                    <p>
                      <span className="text-foreground">Эффективность:</span>{" "}
                      Быстрое вычисление
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Hash Function */}
            <section>
              <h2 className="text-2xl font-light text-foreground mb-6">
                Наша хеш-функция
              </h2>
              <Card className="border-border bg-muted/30">
                <CardContent className="p-6">
                  <div className="font-mono text-center text-lg mb-4">
                    h(ключ) = (Σ ASCII(символ)³) mod размерТаблицы
                  </div>
                  <p className="text-muted-foreground text-center">
                    Суммировать кубы ASCII-кодов всех символов, затем взять
                    остаток от деления на размер таблицы
                  </p>
                </CardContent>
              </Card>

              <div className="mt-6 p-6 bg-muted/30 rounded-lg">
                <h3 className="font-medium text-foreground mb-4">
                  Пример: hash("cat") с размером таблицы 11
                </h3>
                <div className="space-y-2 font-mono text-sm">
                  <p className="text-muted-foreground">
                    'c' = 99 → 99³ ={" "}
                    <span className="text-foreground">970,299</span>
                  </p>
                  <p className="text-muted-foreground">
                    'a' = 97 → 97³ ={" "}
                    <span className="text-foreground">912,673</span>
                  </p>
                  <p className="text-muted-foreground">
                    't' = 116 → 116³ ={" "}
                    <span className="text-foreground">1,560,896</span>
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Сумма = 970,299 + 912,673 + 1,560,896 ={" "}
                    <span className="text-foreground">3,443,868</span>
                  </p>
                  <p className="text-foreground mt-2">
                    hash("cat") = 3,443,868 mod 11 ={" "}
                    <span className="text-primary font-bold">5</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Collision Handling */}
            <section>
              <h2 className="text-2xl font-light text-foreground mb-6">
                Обработка коллизий: метод цепочек
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Когда два ключа хешируются в один и тот же индекс (коллизия),
                метод цепочек сохраняет несколько элементов в одной корзине,
                используя связанный список. Каждая корзина указывает на голову
                связанного списка, содержащего все элементы, которые хешируются
                в этот индекс.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-green-600 dark:text-green-400">
                      Преимущества
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>Простота реализации</p>
                    <p>Хеш-таблица никогда не заполняется полностью</p>
                    <p>Менее чувствительна к качеству хеш-функции</p>
                    <p>Удаление выполняется просто</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-amber-600 dark:text-amber-400">
                      Недостатки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground">
                    <p>Дополнительная память для указателей связанного списка</p>
                    <p>Может ухудшиться производительность кэша</p>
                    <p>Длинные цепочки деградируют до поиска O(n)</p>
                    <p>Потерянное пространство при коротких цепочках</p>
                  </CardContent>
                </Card>
              </div>

              {/* Visual representation of chaining */}
              <div className="mt-8 p-6 bg-muted/30 rounded-lg">
                <h3 className="font-medium text-foreground mb-4">
                  Визуализация цепочек
                </h3>
                <div className="flex flex-col gap-2 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-muted-foreground">[0]</span>
                    <span className="text-muted-foreground">→ null</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-muted-foreground">[1]</span>
                    <span className="px-2 py-1 bg-primary/20 rounded text-foreground">
                      ключ1
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="px-2 py-1 bg-primary/20 rounded text-foreground">
                      ключ2
                    </span>
                    <span className="text-muted-foreground">→ null</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-muted-foreground">[2]</span>
                    <span className="px-2 py-1 bg-primary/20 rounded text-foreground">
                      ключ3
                    </span>
                    <span className="text-muted-foreground">→ null</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-muted-foreground">...</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Other Collision Methods */}
            <section>
              <h2 className="text-2xl font-light text-foreground mb-6">
                Другие методы разрешения коллизий
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Линейное зондирование
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p className="mb-2">
                      Если слот занят, попробуйте следующий слот последовательно,
                      пока не найдете пустой слот.
                    </p>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      h(k, i) = (h(k) + i) mod m
                    </code>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Квадратичное зондирование
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p className="mb-2">
                      Используйте квадратичную функцию для поиска следующего
                      слота, уменьшая кластеризацию.
                    </p>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      h(k, i) = (h(k) + i²) mod m
                    </code>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Двойное хеширование
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    <p className="mb-2">
                      Используйте вторую хеш-функцию для определения
                      последовательности зондирования.
                    </p>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      h(k,i) = (h₁(k) + i·h₂(k)) mod m
                    </code>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Controls */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Вставить пару ключ-значение
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Ключ (напр., apple)"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                    />
                    <Input
                      placeholder="Значение"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleInsert} className="flex-1">
                      Вставить
                    </Button>
                    <Button onClick={loadSampleData} variant="outline">
                      Загрузить примеры
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Поиск / Удаление
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Введите ключ для поиска/удаления"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleSearch} className="flex-1">
                      Искать
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hash Calculation Steps */}
            {hashSteps && hashSteps.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Шаги вычисления хеша
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 font-medium">
                            Символ
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            ASCII-код
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Куб (ASCII³)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hashSteps.map((step, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-2 px-3 font-mono">
                              '{step.char}'
                            </td>
                            <td className="py-2 px-3 font-mono">
                              {step.ascii}
                            </td>
                            <td className="py-2 px-3 font-mono">
                              {step.cube.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-muted/30">
                          <td className="py-2 px-3 font-medium" colSpan={2}>
                            Сумма кубов
                          </td>
                          <td className="py-2 px-3 font-mono font-medium">
                            {hashSteps
                              .reduce((sum, s) => sum + s.cube, 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="py-2 px-3 font-medium" colSpan={2}>
                            Индекс хеша (mod {hashTable.getSize()})
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-primary">
                            {hashSteps.reduce((sum, s) => sum + s.cube, 0) %
                              hashTable.getSize()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Operation Result */}
            {lastOperation && (
              <Card className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        lastOperation.type === "insert"
                          ? "default"
                          : lastOperation.type === "search"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {lastOperation.type.toUpperCase()}
                    </Badge>
                    <span className="text-muted-foreground">
                      Key "{lastOperation.key}" → Bucket [{lastOperation.index}]
                    </span>
                    {lastOperation.isCollision && (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-600"
                      >
                        Collision! Added to chain
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Result */}
            {searchResult && (
              <Card
                className={`border-2 ${
                  searchResult.found
                    ? "border-green-500/50"
                    : "border-red-500/50"
                }`}
              >
                <CardContent className="p-4">
                  {searchResult.found ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">Найдено</Badge>
                        <span className="text-foreground font-medium">
                          Значение: {searchResult.value}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Находится в корзине [{searchResult.index}] после{" "}
                        {searchResult.steps}{" "}
                        {searchResult.steps === 1
                          ? "шага"
                          : searchResult.steps < 5
                          ? "шагов"
                          : "шагов"}{" "}
                        в цепочке
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Не найдено</Badge>
                      <span className="text-muted-foreground">
                        Ключ не существует в хеш-таблице
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Hash Table Visualization */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    Визуализация хеш-таблицы
                  </CardTitle>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Размер: {hashTable.getSize()}</span>
                    <span>Элементов: {hashTable.getCount()}</span>
                    <span>
                      Коэффициент загрузки: {hashTable.getLoadFactor().toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {buckets.map((bucket) => (
                    <div
                      key={bucket.index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        lastOperation?.index === bucket.index
                          ? "bg-primary/10"
                          : "bg-muted/30"
                      }`}
                    >
                      <span className="w-8 font-mono text-sm text-muted-foreground">
                        [{bucket.index}]
                      </span>
                      {bucket.chain.length === 0 ? (
                        <span className="text-muted-foreground/50 italic">
                          пусто
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          {bucket.chain.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {i > 0 && (
                                <span className="text-muted-foreground">→</span>
                              )}
                              <div className="px-3 py-1.5 bg-primary/20 rounded border border-primary/30">
                                <span className="font-medium text-foreground">
                                  {item.key}
                                </span>
                                <span className="text-muted-foreground mx-1">
                                  :
                                </span>
                                <span className="text-muted-foreground text-sm truncate max-w-[150px] inline-block align-bottom">
                                  {item.value}
                                </span>
                              </div>
                            </div>
                          ))}
                          <span className="text-muted-foreground">→ null</span>
                        </div>
                      )}
                      {bucket.chain.length > 1 && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Цепочка: {bucket.chain.length}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-light text-foreground mb-2">
                    {hashTable.getCount()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Всего элементов
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-light text-foreground mb-2">
                    {buckets.filter((b) => b.chain.length > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Занятых корзин
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-light text-foreground mb-2">
                    {buckets.filter((b) => b.chain.length > 1).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Корзин с коллизиями
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
