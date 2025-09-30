from collections import defaultdict, deque
import heapq

class Graph:
    def __init__(self, vertices):
        self.V = vertices
        self.adj_list = defaultdict(list)
        self.adj_matrix = [[0] * vertices for _ in range(vertices)]
    
    def add_edge(self, u, v, weight=1):
        """Add an undirected edge to the graph"""
        self.adj_list[u].append((v, weight))
        self.adj_list[v].append((u, weight))
        self.adj_matrix[u][v] = weight
        self.adj_matrix[v][u] = weight
    
    def get_edges(self):
        """Get all unique edges"""
        edges = []
        seen = set()
        for u in range(self.V):
            for v, weight in self.adj_list[u]:
                edge_key = tuple(sorted([u, v]))
                if edge_key not in seen:
                    edges.append((u, v, weight))
                    seen.add(edge_key)
        return edges

def check_completeness(graph):
    """Check if graph is complete (every vertex connected to every other)"""
    expected_edges = (graph.V * (graph.V - 1)) // 2
    actual_edges = len(graph.get_edges())
    return actual_edges == expected_edges

def check_connectivity_dfs(graph):
    """Check if graph is connected using DFS"""
    if graph.V == 0:
        return True
    
    visited = set()
    stack = [0]
    
    while stack:
        vertex = stack.pop()
        if vertex in visited:
            continue
        visited.add(vertex)
        for neighbor, _ in graph.adj_list[vertex]:
            if neighbor not in visited:
                stack.append(neighbor)
    
    return len(visited) == graph.V

def check_bipartiteness(graph):
    """Check if graph is bipartite using two-coloring (BFS)"""
    coloring = [-1] * graph.V
    
    for start in range(graph.V):
        if coloring[start] != -1:
            continue
        
        queue = deque([start])
        coloring[start] = 0
        
        while queue:
            vertex = queue.popleft()
            for neighbor, _ in graph.adj_list[vertex]:
                if coloring[neighbor] == -1:
                    coloring[neighbor] = 1 - coloring[vertex]
                    queue.append(neighbor)
                elif coloring[neighbor] == coloring[vertex]:
                    return False, []
    
    return True, coloring

def a_star_shortest_path(graph, start, goal):
    """Find shortest path using A* algorithm"""
    def heuristic(vertex):
        # Simple heuristic (makes it equivalent to Dijkstra's)
        return 0
    
    open_set = {start}
    came_from = {}
    g_score = {i: float('inf') for i in range(graph.V)}
    g_score[start] = 0
    f_score = {i: float('inf') for i in range(graph.V)}
    f_score[start] = heuristic(start)
    
    while open_set:
        # Find vertex with lowest f_score
        current = min(open_set, key=lambda v: f_score[v])
        
        if current == goal:
            # Reconstruct path
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path, g_score[goal]
        
        open_set.remove(current)
        
        for neighbor, weight in graph.adj_list[current]:
            tentative_g_score = g_score[current] + weight
            
            if tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = tentative_g_score + heuristic(neighbor)
                open_set.add(neighbor)
    
    return [], float('inf')

def prims_mst(graph):
    """Find Minimum Spanning Tree using Prim's algorithm"""
    if not check_connectivity_dfs(graph):
        return [], 0
    
    mst_edges = []
    visited = {0}
    edges = []
    
    # Add all edges from vertex 0
    for neighbor, weight in graph.adj_list[0]:
        heapq.heappush(edges, (weight, 0, neighbor))
    
    while len(visited) < graph.V and edges:
        weight, u, v = heapq.heappop(edges)
        
        if v in visited:
            continue
        
        visited.add(v)
        mst_edges.append((u, v, weight))
        
        # Add edges from newly visited vertex
        for neighbor, w in graph.adj_list[v]:
            if neighbor not in visited:
                heapq.heappush(edges, (w, v, neighbor))
    
    total_weight = sum(w for _, _, w in mst_edges)
    return mst_edges, total_weight

# Example usage
print("=" * 60)
print("LAB 4: GRAPH ALGORITHMS DEMONSTRATION")
print("=" * 60)

# Create a sample graph
g = Graph(6)
g.add_edge(0, 1, 4)
g.add_edge(0, 2, 3)
g.add_edge(1, 2, 1)
g.add_edge(1, 3, 2)
g.add_edge(2, 3, 4)
g.add_edge(3, 4, 2)
g.add_edge(4, 5, 6)

print("\nGraph Structure:")
print(f"Vertices: {g.V}")
print(f"Edges: {g.get_edges()}")

print("\n" + "=" * 60)
print("GRAPH PROPERTIES")
print("=" * 60)

# Check completeness
is_complete = check_completeness(g)
print(f"\n1. Completeness: {'✓ Complete' if is_complete else '✗ Not Complete'}")
print(f"   Expected edges for complete graph: {(g.V * (g.V - 1)) // 2}")
print(f"   Actual edges: {len(g.get_edges())}")

# Check connectivity
is_connected = check_connectivity_dfs(g)
print(f"\n2. Connectivity: {'✓ Connected' if is_connected else '✗ Not Connected'}")

# Check bipartiteness
is_bipartite, coloring = check_bipartiteness(g)
print(f"\n3. Bipartiteness: {'✓ Bipartite' if is_bipartite else '✗ Not Bipartite'}")
if is_bipartite:
    set_a = [i for i, c in enumerate(coloring) if c == 0]
    set_b = [i for i, c in enumerate(coloring) if c == 1]
    print(f"   Set A: {set_a}")
    print(f"   Set B: {set_b}")

print("\n" + "=" * 60)
print("SHORTEST PATH (A* ALGORITHM)")
print("=" * 60)

start, goal = 0, 5
path, cost = a_star_shortest_path(g, start, goal)
print(f"\nFinding shortest path from vertex {start} to vertex {goal}")
if path:
    print(f"Path: {' → '.join(map(str, path))}")
    print(f"Total cost: {cost}")
else:
    print("No path exists")

print("\n" + "=" * 60)
print("MINIMUM SPANNING TREE (PRIM'S ALGORITHM)")
print("=" * 60)

mst_edges, total_weight = prims_mst(g)
print(f"\nMST Edges:")
for u, v, weight in mst_edges:
    print(f"  {u} ↔ {v} (weight: {weight})")
print(f"\nTotal MST weight: {total_weight}")

print("\n" + "=" * 60)
print("TESTING WITH DIFFERENT GRAPH TYPES")
print("=" * 60)

# Test with a complete graph
print("\n1. Complete Graph (K4):")
complete_g = Graph(4)
for i in range(4):
    for j in range(i + 1, 4):
        complete_g.add_edge(i, j, 1)
print(f"   Complete: {check_completeness(complete_g)}")
print(f"   Connected: {check_connectivity_dfs(complete_g)}")
print(f"   Bipartite: {check_bipartiteness(complete_g)[0]}")

# Test with a bipartite graph
print("\n2. Bipartite Graph:")
bipartite_g = Graph(4)
bipartite_g.add_edge(0, 2, 1)
bipartite_g.add_edge(0, 3, 1)
bipartite_g.add_edge(1, 2, 1)
bipartite_g.add_edge(1, 3, 1)
print(f"   Complete: {check_completeness(bipartite_g)}")
print(f"   Connected: {check_connectivity_dfs(bipartite_g)}")
is_bip, col = check_bipartiteness(bipartite_g)
print(f"   Bipartite: {is_bip}")
if is_bip:
    print(f"   Coloring: {col}")

# Test with a disconnected graph
print("\n3. Disconnected Graph:")
disconnected_g = Graph(5)
disconnected_g.add_edge(0, 1, 1)
disconnected_g.add_edge(2, 3, 1)
print(f"   Complete: {check_completeness(disconnected_g)}")
print(f"   Connected: {check_connectivity_dfs(disconnected_g)}")
print(f"   Bipartite: {check_bipartiteness(disconnected_g)[0]}")

print("\n" + "=" * 60)
print("DEMONSTRATION COMPLETE")
print("=" * 60)
