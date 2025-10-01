"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Graph,
  checkCompleteness,
  checkConnectivity,
  checkBipartiteness,
  findShortestPathAStar,
  findMinimumSpanningTree,
  type Edge,
  type GraphRepresentation,
} from "./utils";
import { CheckCircle2, XCircle, ArrowRight, Network } from "lucide-react";

export default function Lab4() {
  const [numVertices, setNumVertices] = useState(5);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [edgeInput, setEdgeInput] = useState({ from: 0, to: 1, weight: 1 });
  const [graph, setGraph] = useState<Graph | null>(null);
  const [representation, setRepresentation] =
    useState<GraphRepresentation>("adjacency-list");
  const [pathInput, setPathInput] = useState({ start: 0, end: 4 });

  // Results
  const [completeness, setCompleteness] = useState<boolean | null>(null);
  const [connectivity, setConnectivity] = useState<boolean | null>(null);
  const [bipartiteness, setBipartiteness] = useState<{
    isBipartite: boolean;
    coloring: number[];
  } | null>(null);
  const [shortestPath, setShortestPath] = useState<{
    path: number[];
    cost: number;
  } | null>(null);
  const [mst, setMst] = useState<{ edges: Edge[]; totalWeight: number } | null>(
    null
  );

  const addEdge = () => {
    if (
      edgeInput.from >= 0 &&
      edgeInput.from < numVertices &&
      edgeInput.to >= 0 &&
      edgeInput.to < numVertices &&
      edgeInput.from !== edgeInput.to
    ) {
      setEdges([...edges, { ...edgeInput }]);
    }
  };

  const removeEdge = (index: number) => {
    setEdges(edges.filter((_, i) => i !== index));
  };

  const buildGraph = () => {
    const g = new Graph(numVertices, representation);
    edges.forEach((edge) => g.addEdge(edge.from, edge.to, edge.weight));
    setGraph(g);
    // Reset results
    setCompleteness(null);
    setConnectivity(null);
    setBipartiteness(null);
    setShortestPath(null);
    setMst(null);
  };

  const runCompleteness = () => {
    if (graph) setCompleteness(checkCompleteness(graph));
  };

  const runConnectivity = () => {
    if (graph) setConnectivity(checkConnectivity(graph));
  };

  const runBipartiteness = () => {
    if (graph) setBipartiteness(checkBipartiteness(graph));
  };

  const runShortestPath = () => {
    if (
      graph &&
      pathInput.start >= 0 &&
      pathInput.start < numVertices &&
      pathInput.end >= 0 &&
      pathInput.end < numVertices
    ) {
      setShortestPath(
        findShortestPathAStar(graph, pathInput.start, pathInput.end)
      );
    }
  };

  const runMST = () => {
    if (graph) setMst(findMinimumSpanningTree(graph));
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => window.history.back()}
          >
            ← Назад к меню
          </Button>
          <h1 className="text-4xl font-bold mb-2">Лабораторная 4: Алгоритмы на графах</h1>
          <p className="text-muted-foreground">
            Изучайте представления графов, их свойства и алгоритмы, включая A* и МОД
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Конфигурация графа</CardTitle>
                <CardDescription>Определите структуру графа</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vertices">Количество вершин</Label>
                  <Input
                    id="vertices"
                    type="number"
                    min="2"
                    max="20"
                    value={numVertices}
                    onChange={(e) =>
                      setNumVertices(Number.parseInt(e.target.value) || 2)
                    }
                  />
                </div>

                <div>
                  <Label>Тип представления</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={
                        representation === "adjacency-list"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setRepresentation("adjacency-list")}
                      className="flex-1"
                    >
                      Список смежности
                    </Button>
                    <Button
                      variant={
                        representation === "adjacency-matrix"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setRepresentation("adjacency-matrix")}
                      className="flex-1"
                    >
                      Матрица смежности
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-2 block">Добавить ребро</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="from" className="text-xs">
                        Из
                      </Label>
                      <Input
                        id="from"
                        type="number"
                        min="0"
                        max={numVertices - 1}
                        value={edgeInput.from}
                        onChange={(e) =>
                          setEdgeInput({
                            ...edgeInput,
                            from: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="to" className="text-xs">
                        В
                      </Label>
                      <Input
                        id="to"
                        type="number"
                        min="0"
                        max={numVertices - 1}
                        value={edgeInput.to}
                        onChange={(e) =>
                          setEdgeInput({
                            ...edgeInput,
                            to: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-xs">
                        Вес
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        min="1"
                        value={edgeInput.weight}
                        onChange={(e) =>
                          setEdgeInput({
                            ...edgeInput,
                            weight: Number.parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={addEdge} className="w-full mt-2">
                    Добавить ребро
                  </Button>
                </div>

                <div>
                  <Label className="mb-2 block">Ребра ({edges.length})</Label>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {edges.map((edge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-muted p-2 rounded text-sm"
                      >
                        <span>
                          {edge.from} → {edge.to} (вес: {edge.weight})
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEdge(idx)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={buildGraph} className="w-full" size="lg">
                  <Network className="mr-2 h-4 w-4" />
                  Построить граф
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Operations Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Операции с графом</CardTitle>
                <CardDescription>Запуск алгоритмов и проверок</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="properties">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="properties">Свойства</TabsTrigger>
                    <TabsTrigger value="path">Кратчайший путь</TabsTrigger>
                    <TabsTrigger value="mst">МОД</TabsTrigger>
                  </TabsList>

                  <TabsContent value="properties" className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        onClick={runCompleteness}
                        disabled={!graph}
                        className="w-full"
                      >
                        Проверить полноту
                      </Button>
                      {completeness !== null && (
                        <Alert>
                          <AlertDescription className="flex items-center gap-2">
                            {completeness ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                                Граф полный
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />{" "}
                                Граф не является полным
                              </>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={runConnectivity}
                        disabled={!graph}
                        className="w-full"
                      >
                        Проверить связность
                      </Button>
                      {connectivity !== null && (
                        <Alert>
                          <AlertDescription className="flex items-center gap-2">
                            {connectivity ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                                Граф связный
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />{" "}
                                Граф несвязный
                              </>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={runBipartiteness}
                        disabled={!graph}
                        className="w-full"
                      >
                        Проверить двудольность
                      </Button>
                      {bipartiteness && (
                        <Alert>
                          <AlertDescription>
                            <div className="flex items-center gap-2 mb-2">
                              {bipartiteness.isBipartite ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                                  Граф двудольный
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-600" />{" "}
                                  Граф не двудольный
                                </>
                              )}
                            </div>
                            {bipartiteness.isBipartite && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {bipartiteness.coloring.map((color, idx) => (
                                  <Badge
                                    key={idx}
                                    variant={
                                      color === 0 ? "default" : "secondary"
                                    }
                                  >
                                    V{idx}: {color === 0 ? "Множество A" : "Множество B"}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="path" className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="start">Начальная вершина</Label>
                        <Input
                          id="start"
                          type="number"
                          min="0"
                          max={numVertices - 1}
                          value={pathInput.start}
                          onChange={(e) =>
                            setPathInput({
                              ...pathInput,
                              start: Number.parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="end">Конечная вершина</Label>
                        <Input
                          id="end"
                          type="number"
                          min="0"
                          max={numVertices - 1}
                          value={pathInput.end}
                          onChange={(e) =>
                            setPathInput({
                              ...pathInput,
                              end: Number.parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      onClick={runShortestPath}
                      disabled={!graph}
                      className="w-full"
                    >
                      Найти кратчайший путь (A*)
                    </Button>
                    {shortestPath && (
                      <Alert>
                        <AlertDescription>
                          {shortestPath.path.length > 0 ? (
                            <>
                              <div className="font-semibold mb-2">
                                Путь найден!
                              </div>
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                {shortestPath.path.map((vertex, idx) => (
                                  <div key={idx} className="flex items-center">
                                    <Badge>{vertex}</Badge>
                                    {idx < shortestPath.path.length - 1 && (
                                      <ArrowRight className="h-3 w-3 mx-1" />
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="text-sm">
                                Суммарная стоимость: <strong>{shortestPath.cost}</strong>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" /> Путь
                              не существует
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent value="mst" className="space-y-4">
                    <Button
                      onClick={runMST}
                      disabled={!graph}
                      className="w-full"
                    >
                      Сгенерировать МОД (алгоритм Прима)
                    </Button>
                    {mst && (
                      <Alert>
                        <AlertDescription>
                          {mst.edges.length > 0 ? (
                            <>
                              <div className="font-semibold mb-2">
                                Минимальное остовное дерево
                              </div>
                              <div className="space-y-1 mb-2">
                                {mst.edges.map((edge, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm bg-muted p-2 rounded"
                                  >
                                    {edge.from} ↔ {edge.to} (вес:{" "}
                                    {edge.weight})
                                  </div>
                                ))}
                              </div>
                              <div className="text-sm font-semibold">
                                Суммарный вес: {mst.totalWeight}
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" /> Граф
                              несвязный
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Theory Card */}
            <Card>
              <CardHeader>
                <CardTitle>Теория</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong className="text-foreground">Полный граф:</strong>
                  <p className="text-muted-foreground">
                    Каждая вершина соединена с каждой другой вершиной
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">Связный граф:</strong>
                  <p className="text-muted-foreground">
                    Между любыми двумя вершинами существует путь
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">Двудольный граф:</strong>
                  <p className="text-muted-foreground">
                    Вершины можно разделить на два множества без рёбер внутри
                    множеств
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">Алгоритм A*:</strong>
                  <p className="text-muted-foreground">
                    Находит кратчайший путь с помощью эвристического поиска
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">
                    МОД (минимальное остовное дерево):
                  </strong>
                  <p className="text-muted-foreground">
                    Соединяет все вершины с минимальным суммарным весом рёбер
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
