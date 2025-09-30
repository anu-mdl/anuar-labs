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
            ← Back to Menu
          </Button>
          <h1 className="text-4xl font-bold mb-2">Lab 4: Graph Algorithms</h1>
          <p className="text-muted-foreground">
            Explore graph representations, properties, and algorithms including
            A* and MST
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Graph Configuration</CardTitle>
                <CardDescription>Define your graph structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vertices">Number of Vertices</Label>
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
                  <Label>Representation Type</Label>
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
                      Adjacency List
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
                      Adjacency Matrix
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-2 block">Add Edge</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="from" className="text-xs">
                        From
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
                        To
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
                        Weight
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
                    Add Edge
                  </Button>
                </div>

                <div>
                  <Label className="mb-2 block">Edges ({edges.length})</Label>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {edges.map((edge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-muted p-2 rounded text-sm"
                      >
                        <span>
                          {edge.from} → {edge.to} (weight: {edge.weight})
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
                  Build Graph
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Operations Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Graph Operations</CardTitle>
                <CardDescription>Run algorithms and checks</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="properties">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="path">Shortest Path</TabsTrigger>
                    <TabsTrigger value="mst">MST</TabsTrigger>
                  </TabsList>

                  <TabsContent value="properties" className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        onClick={runCompleteness}
                        disabled={!graph}
                        className="w-full"
                      >
                        Check Completeness
                      </Button>
                      {completeness !== null && (
                        <Alert>
                          <AlertDescription className="flex items-center gap-2">
                            {completeness ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                                Graph is complete
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />{" "}
                                Graph is not complete
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
                        Check Connectivity
                      </Button>
                      {connectivity !== null && (
                        <Alert>
                          <AlertDescription className="flex items-center gap-2">
                            {connectivity ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                                Graph is connected
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />{" "}
                                Graph is not connected
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
                        Check Bipartiteness
                      </Button>
                      {bipartiteness && (
                        <Alert>
                          <AlertDescription>
                            <div className="flex items-center gap-2 mb-2">
                              {bipartiteness.isBipartite ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                                  Graph is bipartite
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-red-600" />{" "}
                                  Graph is not bipartite
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
                                    V{idx}: {color === 0 ? "Set A" : "Set B"}
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
                        <Label htmlFor="start">Start Vertex</Label>
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
                        <Label htmlFor="end">End Vertex</Label>
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
                      Find Shortest Path (A*)
                    </Button>
                    {shortestPath && (
                      <Alert>
                        <AlertDescription>
                          {shortestPath.path.length > 0 ? (
                            <>
                              <div className="font-semibold mb-2">
                                Path found!
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
                                Total cost: <strong>{shortestPath.cost}</strong>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" /> No
                              path exists
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
                      Generate MST (Prim's Algorithm)
                    </Button>
                    {mst && (
                      <Alert>
                        <AlertDescription>
                          {mst.edges.length > 0 ? (
                            <>
                              <div className="font-semibold mb-2">
                                Minimum Spanning Tree
                              </div>
                              <div className="space-y-1 mb-2">
                                {mst.edges.map((edge, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm bg-muted p-2 rounded"
                                  >
                                    {edge.from} ↔ {edge.to} (weight:{" "}
                                    {edge.weight})
                                  </div>
                                ))}
                              </div>
                              <div className="text-sm font-semibold">
                                Total weight: {mst.totalWeight}
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" /> Graph
                              is not connected
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
                <CardTitle>Theory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong className="text-foreground">Complete Graph:</strong>
                  <p className="text-muted-foreground">
                    Every vertex is connected to every other vertex
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">Connected Graph:</strong>
                  <p className="text-muted-foreground">
                    There exists a path between any two vertices
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">Bipartite Graph:</strong>
                  <p className="text-muted-foreground">
                    Vertices can be divided into two sets with no edges within
                    sets
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">A* Algorithm:</strong>
                  <p className="text-muted-foreground">
                    Finds shortest path using heuristic-based search
                  </p>
                </div>
                <div>
                  <strong className="text-foreground">
                    MST (Minimum Spanning Tree):
                  </strong>
                  <p className="text-muted-foreground">
                    Connects all vertices with minimum total edge weight
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
