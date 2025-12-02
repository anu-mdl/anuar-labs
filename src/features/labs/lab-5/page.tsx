"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TreePine, Search, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

class BinarySearchTree {
  root: TreeNode | null = null;

  insert(value: number): void {
    const newNode: TreeNode = { value, left: null, right: null };
    if (!this.root) {
      this.root = newNode;
      return;
    }
    this.insertNode(this.root, newNode);
  }

  private insertNode(node: TreeNode, newNode: TreeNode): void {
    if (newNode.value < node.value) {
      if (!node.left) node.left = newNode;
      else this.insertNode(node.left, newNode);
    } else {
      if (!node.right) node.right = newNode;
      else this.insertNode(node.right, newNode);
    }
  }

  // Collect all values using in-order traversal
  inOrderTraversal(
    node: TreeNode | null = this.root,
    result: number[] = []
  ): number[] {
    if (node) {
      this.inOrderTraversal(node.left, result);
      result.push(node.value);
      this.inOrderTraversal(node.right, result);
    }
    return result;
  }

  // Find all pairs that sum to target using HashSet approach
  findPairsWithSum(target: number): [number, number][] {
    const values = this.inOrderTraversal();
    const pairs: [number, number][] = [];
    const seen = new Set<number>();

    for (const value of values) {
      const complement = target - value;
      if (seen.has(complement)) {
        // Ensure smaller number comes first to avoid duplicates
        pairs.push([Math.min(value, complement), Math.max(value, complement)]);
      }
      seen.add(value);
    }

    return pairs;
  }

  // Two-pointer approach for BST (uses sorted property)
  findPairsTwoPointer(target: number): [number, number][] {
    const sortedValues = this.inOrderTraversal(); // Already sorted for BST
    const pairs: [number, number][] = [];
    let left = 0;
    let right = sortedValues.length - 1;

    while (left < right) {
      const sum = sortedValues[left] + sortedValues[right];
      if (sum === target) {
        pairs.push([sortedValues[left], sortedValues[right]]);
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }

    return pairs;
  }

  getHeight(node: TreeNode | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  isBalanced(node: TreeNode | null = this.root): boolean {
    if (!node) return true;
    const leftHeight = this.getHeight(node.left);
    const rightHeight = this.getHeight(node.right);
    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  }
}

// Visual tree node component
function TreeNodeVisual({
  node,
  highlightedValues,
}: {
  node: TreeNode | null;
  highlightedValues: Set<number>;
}) {
  if (!node) return null;

  const isHighlighted = highlightedValues.has(node.value);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all ${
          isHighlighted
            ? "bg-primary text-primary-foreground border-primary scale-110"
            : "bg-card text-card-foreground border-border"
        }`}
      >
        {node.value}
      </div>
      {(node.left || node.right) && (
        <div className="flex gap-2 mt-2">
          <div className="flex flex-col items-center">
            {node.left && <div className="w-px h-4 bg-border" />}
            <TreeNodeVisual
              node={node.left}
              highlightedValues={highlightedValues}
            />
          </div>
          <div className="flex flex-col items-center">
            {node.right && <div className="w-px h-4 bg-border" />}
            <TreeNodeVisual
              node={node.right}
              highlightedValues={highlightedValues}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Lab5() {
  const [tree] = useState(() => {
    const bst = new BinarySearchTree();
    // Insert sample values
    [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 90].forEach((v) =>
      bst.insert(v)
    );
    return bst;
  });

  const [targetSum, setTargetSum] = useState("100");
  const [newValue, setNewValue] = useState("");
  const [pairs, setPairs] = useState<[number, number][]>([]);
  const [highlightedValues, setHighlightedValues] = useState<Set<number>>(
    new Set()
  );
  const [method, setMethod] = useState<"hashset" | "twopointer">("hashset");
  const [, forceUpdate] = useState({});

  const findPairs = () => {
    const target = Number.parseInt(targetSum);
    if (isNaN(target)) return;

    const foundPairs =
      method === "hashset"
        ? tree.findPairsWithSum(target)
        : tree.findPairsTwoPointer(target);

    setPairs(foundPairs);

    // Highlight all values that are part of pairs
    const highlighted = new Set<number>();
    foundPairs.forEach(([a, b]) => {
      highlighted.add(a);
      highlighted.add(b);
    });
    setHighlightedValues(highlighted);
  };

  const addNode = () => {
    const value = Number.parseInt(newValue);
    if (isNaN(value)) return;
    tree.insert(value);
    setNewValue("");
    setPairs([]);
    setHighlightedValues(new Set());
    forceUpdate({});
  };

  const resetTree = () => {
    tree.root = null;
    [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 90].forEach((v) =>
      tree.insert(v)
    );
    setPairs([]);
    setHighlightedValues(new Set());
    forceUpdate({});
  };

  const treeValues = tree.inOrderTraversal();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад в меню
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TreePine className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Лабораторная работа №5: Поисковые деревья
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Работа с деревьями, алгоритмами деревьев, связностью, обходом,
            итерацией и балансировкой.
          </p>
        </div>

        {/* Theory Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Теоретическая часть</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Бинарное дерево поиска (BST)
              </h3>
              <p>
                Бинарное дерево поиска — это иерархическая структура данных, где
                каждый узел имеет не более двух потомков. Левое поддерево
                содержит только узлы со значениями меньше родительского, а
                правое поддерево содержит только узлы со значениями больше
                родительского. Это свойство обеспечивает эффективный поиск со
                средней временной сложностью O(log n).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Методы обхода дерева
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>In-order (LNR):</strong> Левый → Узел → Правый –
                  создаёт отсортированную последовательность для BST
                </li>
                <li>
                  <strong>Pre-order (NLR):</strong> Узел → Левый → Правый –
                  полезен для копирования деревьев
                </li>
                <li>
                  <strong>Post-order (LRN):</strong> Левый → Правый → Узел –
                  полезен для удаления
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Поиск пар с заданной суммой
              </h3>
              <p className="mb-2">Реализованы два подхода:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Подход с HashSet O(n):</strong> Обход дерева, для
                  каждого значения проверяется наличие (target - value) в
                  множестве
                </li>
                <li>
                  <strong>Подход с двумя указателями O(n):</strong>
                  Использование отсортированного in-order обхода, перемещение
                  указателей с обоих концов
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Балансировка дерева
              </h3>
              <p>
                Сбалансированное дерево обладает свойством, что для каждого
                узла высоты левого и правого поддеревьев отличаются не более чем
                на 1. Сбалансированные деревья (такие как AVL, красно-чёрные)
                поддерживают операции за O(log n) даже в худших случаях, в
                отличие от обычного BST, которое может деградировать до O(n)
                при вставке в отсортированном порядке.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Tree Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Бинарное дерево поиска</span>
                <Button variant="outline" size="sm" onClick={resetTree}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Сбросить
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center overflow-auto p-4 bg-muted/30 rounded-lg min-h-[300px]">
                {tree.root ? (
                  <TreeNodeVisual
                    node={tree.root}
                    highlightedValues={highlightedValues}
                  />
                ) : (
                  <p className="text-muted-foreground">Дерево пусто</p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  type="number"
                  placeholder="Значение для вставки"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addNode}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить узел
                </Button>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <strong>In-order обход:</strong> [{treeValues.join(", ")}]
                </p>
                <p>
                  <strong>Высота:</strong> {tree.getHeight()} |{" "}
                  <strong>Сбалансировано:</strong>{" "}
                  {tree.isBalanced() ? "Да" : "Нет"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pair Finding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Поиск пар с заданной суммой
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Целевая сумма
                  </label>
                  <Input
                    type="number"
                    value={targetSum}
                    onChange={(e) => setTargetSum(e.target.value)}
                    placeholder="Введите целевую сумму"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Алгоритм
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={method === "hashset" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMethod("hashset")}
                      className="flex-1"
                    >
                      HashSet O(n)
                    </Button>
                    <Button
                      variant={method === "twopointer" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMethod("twopointer")}
                      className="flex-1"
                    >
                      Два указателя O(n)
                    </Button>
                  </div>
                </div>

                <Button onClick={findPairs} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Найти все пары
                </Button>

                {/* Results */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Результаты</h4>
                  {pairs.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Найдено {pairs.length}{" "}
                        {pairs.length === 1
                          ? "пара"
                          : pairs.length < 5
                          ? "пары"
                          : "пар"}
                        , сумма которых равна {targetSum}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pairs.map(([a, b], i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            ({a}, {b})
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Пары не найдены. Нажмите «Найти все пары» для поиска.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Algorithm Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>Реализация алгоритма</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{`// Подход с HashSet - O(n) время, O(n) память
function findPairsWithSum(root, target):
    values = inOrderTraversal(root)  // Собрать все значения
    pairs = []
    seen = new HashSet()

    for each value in values:
        complement = target - value
        if seen.contains(complement):
            pairs.add((complement, value))
        seen.add(value)

    return pairs

// Подход с двумя указателями - O(n) время, O(n) память
function findPairsTwoPointer(root, target):
    sorted = inOrderTraversal(root)  // Уже отсортировано для BST
    pairs = []
    left = 0, right = length - 1

    while left < right:
        sum = sorted[left] + sorted[right]
        if sum == target:
            pairs.add((sorted[left], sorted[right]))
            left++; right--
        else if sum < target:
            left++
        else:
            right--

    return pairs`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
