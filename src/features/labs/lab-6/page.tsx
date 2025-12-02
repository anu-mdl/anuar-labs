"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TreePine,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// BST Node class
class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  parent: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

// Binary Search Tree with Successor/Predecessor
class BinarySearchTree {
  root: TreeNode | null = null;

  insert(value: number): void {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    let parent: TreeNode | null = null;

    while (current) {
      parent = current;
      if (value < current.value) {
        current = current.left!;
      } else if (value > current.value) {
        current = current.right!;
      } else {
        return; // Duplicate values not allowed
      }
    }

    newNode.parent = parent;
    if (value < parent!.value) {
      parent!.left = newNode;
    } else {
      parent!.right = newNode;
    }
  }

  find(value: number): TreeNode | null {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      if (value < current.value) current = current.left;
      else current = current.right;
    }
    return null;
  }

  // Find minimum node in subtree
  findMin(node: TreeNode): TreeNode {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  // Find maximum node in subtree
  findMax(node: TreeNode): TreeNode {
    while (node.right) {
      node = node.right;
    }
    return node;
  }

  // Find successor (next larger value)
  findSuccessor(value: number): number | null {
    const node = this.find(value);
    if (!node) return null;

    // Case 1: Node has right subtree - successor is minimum of right subtree
    if (node.right) {
      return this.findMin(node.right).value;
    }

    // Case 2: No right subtree - go up until we find a node that is left child
    let successor = node.parent;
    let current = node;
    while (successor && current === successor.right) {
      current = successor;
      successor = successor.parent;
    }

    return successor ? successor.value : null;
  }

  // Find predecessor (previous smaller value)
  findPredecessor(value: number): number | null {
    const node = this.find(value);
    if (!node) return null;

    // Case 1: Node has left subtree - predecessor is maximum of left subtree
    if (node.left) {
      return this.findMax(node.left).value;
    }

    // Case 2: No left subtree - go up until we find a node that is right child
    let predecessor = node.parent;
    let current = node;
    while (predecessor && current === predecessor.left) {
      current = predecessor;
      predecessor = predecessor.parent;
    }

    return predecessor ? predecessor.value : null;
  }

  // In-order traversal (sorted order)
  inOrder(): number[] {
    const result: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (node) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  // Get tree structure for visualization
  getTreeStructure(): { value: number; level: number; position: string }[] {
    const result: { value: number; level: number; position: string }[] = [];

    const traverse = (
      node: TreeNode | null,
      level: number,
      position: string
    ) => {
      if (node) {
        result.push({ value: node.value, level, position });
        traverse(node.left, level + 1, position + "L");
        traverse(node.right, level + 1, position + "R");
      }
    };

    traverse(this.root, 0, "");
    return result;
  }
}

export default function Lab6Page() {
  const [bst] = useState(() => {
    const tree = new BinarySearchTree();
    // Initialize with sample values
    [50, 30, 70, 20, 40, 60, 80, 15, 25, 35, 45, 55, 65, 75, 85].forEach((v) =>
      tree.insert(v)
    );
    return tree;
  });

  const [searchValue, setSearchValue] = useState("");
  const [successor, setSuccessor] = useState<number | null | undefined>(
    undefined
  );
  const [predecessor, setPredecessor] = useState<number | null | undefined>(
    undefined
  );
  const [highlightedValue, setHighlightedValue] = useState<number | null>(null);
  const [insertValue, setInsertValue] = useState("");
  const [treeVersion, setTreeVersion] = useState(0);

  const handleSearch = () => {
    const value = Number.parseInt(searchValue);
    if (isNaN(value)) return;

    const node = bst.find(value);
    if (node) {
      setHighlightedValue(value);
      setSuccessor(bst.findSuccessor(value));
      setPredecessor(bst.findPredecessor(value));
    } else {
      setHighlightedValue(null);
      setSuccessor(undefined);
      setPredecessor(undefined);
      alert(`Value ${value} not found in tree`);
    }
  };

  const handleInsert = () => {
    const value = Number.parseInt(insertValue);
    if (isNaN(value)) return;

    bst.insert(value);
    setInsertValue("");
    setTreeVersion((v) => v + 1);
  };

  const sortedValues = bst.inOrder();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад в меню</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Title Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <TreePine className="w-6 h-6 text-primary" />
            </div>
            <Badge variant="secondary">Лабораторная 6</Badge>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Деревья сортировки и операции балансировки
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Изучение поисковых деревьев, AVL-деревьев и красно-чёрных деревьев.
            Реализация алгоритмов поиска преемника и предшественника.
          </p>
        </div>

        <Tabs defaultValue="theory" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="theory">Теория</TabsTrigger>
            <TabsTrigger value="implementation">Реализация</TabsTrigger>
            <TabsTrigger value="interactive">Интерактив</TabsTrigger>
          </TabsList>

          {/* Theory Tab */}
          <TabsContent value="theory" className="space-y-6">
            {/* BST Theory */}
            <Card>
              <CardHeader>
                <CardTitle>Бинарное дерево поиска (BST)</CardTitle>
                <CardDescription>
                  Основа отсортированных древовидных структур
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Бинарное дерево поиска — это узловое бинарное дерево, где
                  каждый узел имеет ключ больше всех ключей в его левом
                  поддереве и меньше всех ключей в его правом поддереве.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Свойства</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Левое поддерево содержит меньшие значения</li>
                      <li>• Правое поддерево содержит большие значения</li>
                      <li>• In-order обход даёт отсортированную последовательность</li>
                      <li>• Средняя сложность операций: O(log n)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Операции</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Поиск: O(h), где h — высота</li>
                      <li>• Вставка: O(h)</li>
                      <li>• Удаление: O(h)</li>
                      <li>• Преемник/Предшественник: O(h)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AVL Tree Theory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  AVL-дерево
                </CardTitle>
                <CardDescription>
                  Самобалансирующееся бинарное дерево поиска
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  AVL-дерево — это самобалансирующееся BST, в котором высоты
                  двух дочерних поддеревьев любого узла отличаются не более чем
                  на единицу. Балансировка выполняется посредством вращений
                  после вставок и удалений.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-semibold mb-2">Фактор балансировки</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      BF(узел) = высота(левого) - высота(правого)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Допустимые значения: -1, 0, +1
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-semibold mb-2">Вращения</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Левое вращение (LL)</li>
                      <li>• Правое вращение (RR)</li>
                      <li>• Лево-правое (LR)</li>
                      <li>• Право-левое (RL)</li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Случаи вращений</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Лево-левое (LL):</p>
                      <p className="text-muted-foreground">
                        Правое вращение на несбалансированном узле
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Право-правое (RR):</p>
                      <p className="text-muted-foreground">
                        Левое вращение на несбалансированном узле
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Лево-правое (LR):</p>
                      <p className="text-muted-foreground">
                        Левое вращение на левом потомке, затем правое вращение
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Право-левое (RL):</p>
                      <p className="text-muted-foreground">
                        Правое вращение на правом потомке, затем левое вращение
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Red-Black Tree Theory */}
            <Card>
              <CardHeader>
                <CardTitle>Красно-чёрное дерево</CardTitle>
                <CardDescription>
                  Самобалансирующееся с цветовыми свойствами
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Красно-чёрное дерево — это самобалансирующееся BST, где каждый
                  узел имеет дополнительный бит для цвета (красный или чёрный).
                  Дерево поддерживает баланс через цветовые ограничения и
                  вращения.
                </p>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-3">Пять свойств</h4>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-mono bg-foreground text-background px-2 rounded">
                        1
                      </span>
                      <span>Каждый узел либо красный, либо чёрный</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono bg-foreground text-background px-2 rounded">
                        2
                      </span>
                      <span>Корень всегда чёрный</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono bg-foreground text-background px-2 rounded">
                        3
                      </span>
                      <span>Все листья (узлы NIL) чёрные</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono bg-foreground text-background px-2 rounded">
                        4
                      </span>
                      <span>
                        Если узел красный, оба его потомка чёрные (нет двух
                        последовательных красных)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono bg-foreground text-background px-2 rounded">
                        5
                      </span>
                      <span>
                        Каждый путь от корня до листьев имеет одинаковое
                        количество чёрных узлов
                      </span>
                    </li>
                  </ol>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <h4 className="font-semibold">Красный узел</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Не может иметь красных потомков. Может иметь чёрных или
                      NIL потомков.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-foreground/30 bg-foreground/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full bg-foreground"></div>
                      <h4 className="font-semibold">Чёрный узел</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Может иметь потомков любого цвета. Вносит вклад в
                      чёрную-высоту.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Successor/Predecessor Theory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChevronLeft className="w-5 h-5" />
                  Преемник и предшественник
                  <ChevronRight className="w-5 h-5" />
                </CardTitle>
                <CardDescription>
                  Поиск следующего и предыдущего значений в BST
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">
                      Преемник (следующее большее)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Преемник узла — это узел с наименьшим ключом, большим чем
                      данный узел.
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-2">
                      <p className="font-medium">Алгоритм:</p>
                      <ol className="text-muted-foreground space-y-1 ml-4">
                        <li>
                          1. Если у узла есть правое поддерево → найти минимум в
                          правом поддереве
                        </li>
                        <li>
                          2. Иначе → подниматься вверх, пока текущий узел не
                          окажется левым потомком
                        </li>
                        <li>3. Родитель этого узла является преемником</li>
                      </ol>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary">
                      Предшественник (предыдущее меньшее)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Предшественник узла — это узел с наибольшим ключом,
                      меньшим чем данный узел.
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-2">
                      <p className="font-medium">Алгоритм:</p>
                      <ol className="text-muted-foreground space-y-1 ml-4">
                        <li>
                          1. Если у узла есть левое поддерево → найти максимум в
                          левом поддереве
                        </li>
                        <li>
                          2. Иначе → подниматься вверх, пока текущий узел не
                          окажется правым потомком
                        </li>
                        <li>3. Родитель этого узла является предшественником</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Implementation Tab */}
          <TabsContent value="implementation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Реализация BST с преемником/предшественником
                </CardTitle>
                <CardDescription>
                  Основные алгоритмы для поиска следующего и предыдущего значений
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto text-sm">
                  <code>{`class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.parent = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        new_node = TreeNode(value)
        if not self.root:
            self.root = new_node
            return
        
        current = self.root
        while True:
            if value < current.value:
                if current.left is None:
                    current.left = new_node
                    new_node.parent = current
                    break
                current = current.left
            elif value > current.value:
                if current.right is None:
                    current.right = new_node
                    new_node.parent = current
                    break
                current = current.right
            else:
                break  # Duplicate
    
    def find_min(self, node):
        """Find minimum value in subtree"""
        while node.left:
            node = node.left
        return node
    
    def find_max(self, node):
        """Find maximum value in subtree"""
        while node.right:
            node = node.right
        return node
    
    def find_successor(self, value):
        """Find the next larger value"""
        node = self.find(value)
        if not node:
            return None
        
        # Case 1: Has right subtree
        if node.right:
            return self.find_min(node.right).value
        
        # Case 2: Go up to find successor
        successor = node.parent
        current = node
        while successor and current == successor.right:
            current = successor
            successor = successor.parent
        
        return successor.value if successor else None
    
    def find_predecessor(self, value):
        """Find the previous smaller value"""
        node = self.find(value)
        if not node:
            return None
        
        # Case 1: Has left subtree
        if node.left:
            return self.find_max(node.left).value
        
        # Case 2: Go up to find predecessor
        predecessor = node.parent
        current = node
        while predecessor and current == predecessor.left:
            current = predecessor
            predecessor = predecessor.parent
        
        return predecessor.value if predecessor else None`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Анализ временной сложности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Операция</th>
                        <th className="text-left py-2 px-4">BST (средняя)</th>
                        <th className="text-left py-2 px-4">BST (худшая)</th>
                        <th className="text-left py-2 px-4">AVL/КЧ-дерево</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Поиск</td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                        <td className="py-2 px-4 font-mono text-destructive">
                          O(n)
                        </td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Вставка</td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                        <td className="py-2 px-4 font-mono text-destructive">
                          O(n)
                        </td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Удаление</td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                        <td className="py-2 px-4 font-mono text-destructive">
                          O(n)
                        </td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4 font-medium">Преемник</td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                        <td className="py-2 px-4 font-mono text-destructive">
                          O(n)
                        </td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 font-medium">Предшественник</td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                        <td className="py-2 px-4 font-mono text-destructive">
                          O(n)
                        </td>
                        <td className="py-2 px-4 font-mono text-primary">
                          O(log n)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interactive Tab */}
          <TabsContent value="interactive" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Операции с деревом</CardTitle>
                  <CardDescription>
                    Вставка значений и поиск преемника/предшественника
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Insert */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Вставить значение</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Введите значение..."
                        value={insertValue}
                        onChange={(e) => setInsertValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleInsert()}
                      />
                      <Button onClick={handleInsert}>Вставить</Button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Найти преемника/предшественника
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Введите значение для поиска..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button onClick={handleSearch} variant="secondary">
                        <Search className="w-4 h-4 mr-2" />
                        Найти
                      </Button>
                    </div>
                  </div>

                  {/* Results */}
                  {highlightedValue !== null && (
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Выбранное значение:
                        </span>
                        <Badge variant="default" className="text-lg px-3 py-1">
                          {highlightedValue}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-background border">
                          <div className="flex items-center gap-2 mb-1">
                            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              Предшественник
                            </span>
                          </div>
                          <span className="text-2xl font-bold text-primary">
                            {predecessor !== undefined
                              ? predecessor !== null
                                ? predecessor
                                : "Нет"
                              : "-"}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-background border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              Преемник
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-2xl font-bold text-primary">
                            {successor !== undefined
                              ? successor !== null
                                ? successor
                                : "Нет"
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sorted Values */}
              <Card>
                <CardHeader>
                  <CardTitle>In-Order обход (отсортированный)</CardTitle>
                  <CardDescription>
                    {sortedValues.length} узлов в дереве (версия {treeVersion})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {sortedValues.map((value, index) => {
                      const isHighlighted = value === highlightedValue;
                      const isPredecessor =
                        predecessor !== undefined && value === predecessor;
                      const isSuccessor =
                        successor !== undefined && value === successor;

                      return (
                        <div
                          key={`${value}-${index}`}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-mono transition-all cursor-pointer
                            ${
                              isHighlighted
                                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                                : isPredecessor
                                ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/50"
                                : isSuccessor
                                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/50"
                                : "bg-muted/50 hover:bg-muted"
                            }
                          `}
                          onClick={() => {
                            setSearchValue(value.toString());
                            setHighlightedValue(value);
                            setSuccessor(bst.findSuccessor(value));
                            setPredecessor(bst.findPredecessor(value));
                          }}
                        >
                          {value}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary"></div>
                      <span className="text-muted-foreground">Выбрано</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-amber-500/50"></div>
                      <span className="text-muted-foreground">Предшественник</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-emerald-500/50"></div>
                      <span className="text-muted-foreground">Преемник</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Example Walkthrough */}
            <Card>
              <CardHeader>
                <CardTitle>Пошаговый пример алгоритма</CardTitle>
                <CardDescription>Подробный разбор</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Поиск преемника для 40
                    </h4>
                    <ol className="text-sm space-y-2 text-muted-foreground">
                      <li>1. Найти узел со значением 40</li>
                      <li>2. Узел 40 имеет правого потомка (45)</li>
                      <li>3. Найти минимум в правом поддереве</li>
                      <li>4. Минимум поддерева с корнем 45 равен 45</li>
                      <li className="text-emerald-600 dark:text-emerald-400 font-medium">
                        → Преемник — 45
                      </li>
                    </ol>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ChevronLeft className="w-4 h-4" />
                      Поиск предшественника для 60
                    </h4>
                    <ol className="text-sm space-y-2 text-muted-foreground">
                      <li>1. Найти узел со значением 60</li>
                      <li>2. Узел 60 имеет левого потомка (55)</li>
                      <li>3. Найти максимум в левом поддереве</li>
                      <li>4. Максимум поддерева с корнем 55 равен 55</li>
                      <li className="text-amber-600 dark:text-amber-400 font-medium">
                        → Предшественник — 55
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
