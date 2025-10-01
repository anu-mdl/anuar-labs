export type GraphRepresentation = "adjacency-list" | "adjacency-matrix";

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export class Graph {
  vertices: number;
  representation: GraphRepresentation;
  adjacencyList: Map<number, { vertex: number; weight: number }[]>;
  adjacencyMatrix: number[][];

  constructor(
    vertices: number,
    representation: GraphRepresentation = "adjacency-list"
  ) {
    this.vertices = vertices;
    this.representation = representation;
    this.adjacencyList = new Map();
    this.adjacencyMatrix = Array(vertices)
      .fill(0)
      .map(() => Array(vertices).fill(0));

    // Initialize adjacency list
    for (let i = 0; i < vertices; i++) {
      this.adjacencyList.set(i, []);
    }
  }

  addEdge(from: number, to: number, weight = 1) {
    // Add to adjacency list
    this.adjacencyList.get(from)?.push({ vertex: to, weight });
    this.adjacencyList.get(to)?.push({ vertex: from, weight });

    // Add to adjacency matrix
    this.adjacencyMatrix[from][to] = weight;
    this.adjacencyMatrix[to][from] = weight;
  }

  getNeighbors(vertex: number): { vertex: number; weight: number }[] {
    if (this.representation === "adjacency-list") {
      return this.adjacencyList.get(vertex) || [];
    } else {
      const neighbors: { vertex: number; weight: number }[] = [];
      for (let i = 0; i < this.vertices; i++) {
        if (this.adjacencyMatrix[vertex][i] > 0) {
          neighbors.push({
            vertex: i,
            weight: this.adjacencyMatrix[vertex][i],
          });
        }
      }
      return neighbors;
    }
  }

  getEdges(): Edge[] {
    const edges: Edge[] = [];
    const seen = new Set<string>();

    for (let from = 0; from < this.vertices; from++) {
      const neighbors = this.getNeighbors(from);
      for (const { vertex: to, weight } of neighbors) {
        const edgeKey = [from, to].sort().join("-");
        if (!seen.has(edgeKey)) {
          edges.push({ from, to, weight });
          seen.add(edgeKey);
        }
      }
    }

    return edges;
  }
}

// Check if graph is complete (every vertex connected to every other vertex)
export function checkCompleteness(graph: Graph): boolean {
  const expectedEdges = (graph.vertices * (graph.vertices - 1)) / 2;
  const actualEdges = graph.getEdges().length;
  return actualEdges === expectedEdges;
}

// Check if graph is connected using DFS
export function checkConnectivity(graph: Graph): boolean {
  if (graph.vertices === 0) return true;

  const visited = new Set<number>();
  const stack = [0];

  while (stack.length > 0) {
    const vertex = stack.pop()!;
    if (visited.has(vertex)) continue;

    visited.add(vertex);
    const neighbors = graph.getNeighbors(vertex);
    for (const { vertex: neighbor } of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return visited.size === graph.vertices;
}

// Check if graph is bipartite using two-coloring (BFS)
export function checkBipartiteness(graph: Graph): {
  isBipartite: boolean;
  coloring: number[];
} {
  const coloring = new Array(graph.vertices).fill(-1);

  for (let start = 0; start < graph.vertices; start++) {
    if (coloring[start] !== -1) continue;

    const queue = [start];
    coloring[start] = 0;

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      const neighbors = graph.getNeighbors(vertex);

      for (const { vertex: neighbor } of neighbors) {
        if (coloring[neighbor] === -1) {
          coloring[neighbor] = 1 - coloring[vertex];
          queue.push(neighbor);
        } else if (coloring[neighbor] === coloring[vertex]) {
          return { isBipartite: false, coloring: [] };
        }
      }
    }
  }

  return { isBipartite: true, coloring };
}

// A* algorithm for shortest path
export function findShortestPathAStar(
  graph: Graph,
  start: number,
  goal: number
): { path: number[]; cost: number } {
  // Simple heuristic: always return 0 (makes it equivalent to Dijkstra's)
  const heuristic = (vertex: number) => 0;

  const openSet = new Set([start]);
  const cameFrom = new Map<number, number>();
  const gScore = new Map<number, number>();
  const fScore = new Map<number, number>();

  for (let i = 0; i < graph.vertices; i++) {
    gScore.set(i, Number.POSITIVE_INFINITY);
    fScore.set(i, Number.POSITIVE_INFINITY);
  }
  gScore.set(start, 0);
  fScore.set(start, heuristic(start));

  while (openSet.size > 0) {
    // Find vertex in openSet with lowest fScore
    let current = -1;
    let lowestF = Number.POSITIVE_INFINITY;
    for (const vertex of openSet) {
      const f = fScore.get(vertex)!;
      if (f < lowestF) {
        lowestF = f;
        current = vertex;
      }
    }

    if (current === goal) {
      // Reconstruct path
      const path: number[] = [];
      let temp = current;
      while (temp !== undefined) {
        path.unshift(temp);
        temp = cameFrom.get(temp)!;
      }
      return { path, cost: gScore.get(goal)! };
    }

    openSet.delete(current);
    const neighbors = graph.getNeighbors(current);

    for (const { vertex: neighbor, weight } of neighbors) {
      const tentativeGScore = gScore.get(current)! + weight;

      if (tentativeGScore < gScore.get(neighbor)!) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor));
        openSet.add(neighbor);
      }
    }
  }

  return { path: [], cost: Number.POSITIVE_INFINITY };
}

// Prim's algorithm for Minimum Spanning Tree
export function findMinimumSpanningTree(graph: Graph): {
  edges: Edge[];
  totalWeight: number;
} {
  if (!checkConnectivity(graph)) {
    return { edges: [], totalWeight: 0 };
  }

  const mstEdges: Edge[] = [];
  const visited = new Set<number>();
  const minHeap: { from: number; to: number; weight: number }[] = [];

  // Start from vertex 0
  visited.add(0);
  const neighbors = graph.getNeighbors(0);
  for (const { vertex, weight } of neighbors) {
    minHeap.push({ from: 0, to: vertex, weight });
  }

  // Sort heap by weight
  minHeap.sort((a, b) => a.weight - b.weight);

  while (visited.size < graph.vertices && minHeap.length > 0) {
    // Get edge with minimum weight
    const edge = minHeap.shift()!;

    if (visited.has(edge.to)) continue;

    // Add edge to MST
    mstEdges.push(edge);
    visited.add(edge.to);

    // Add new edges to heap
    const newNeighbors = graph.getNeighbors(edge.to);
    for (const { vertex, weight } of newNeighbors) {
      if (!visited.has(vertex)) {
        minHeap.push({ from: edge.to, to: vertex, weight });
      }
    }

    // Re-sort heap
    minHeap.sort((a, b) => a.weight - b.weight);
  }

  const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);
  return { edges: mstEdges, totalWeight };
}
