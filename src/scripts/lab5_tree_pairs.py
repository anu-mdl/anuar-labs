"""
Lab 5: Trees – Using Trees for Searching
Task: Find all pairs of nodes in a tree whose values sum up to a given target
"""

from typing import List, Tuple, Optional, Set
from collections import deque


class TreeNode:
    """Binary Search Tree Node"""
    def __init__(self, value: int):
        self.value = value
        self.left: Optional['TreeNode'] = None
        self.right: Optional['TreeNode'] = None


class BinarySearchTree:
    """Binary Search Tree implementation with pair-finding algorithms"""
    
    def __init__(self):
        self.root: Optional[TreeNode] = None
    
    def insert(self, value: int) -> None:
        """Insert a value into the BST"""
        if not self.root:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)
    
    def _insert_recursive(self, node: TreeNode, value: int) -> None:
        if value < node.value:
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_recursive(node.left, value)
        else:
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_recursive(node.right, value)
    
    def in_order_traversal(self, node: Optional[TreeNode] = None, first_call: bool = True) -> List[int]:
        """In-order traversal (Left -> Node -> Right) - produces sorted sequence"""
        if first_call:
            node = self.root
        
        result = []
        if node:
            result.extend(self.in_order_traversal(node.left, False))
            result.append(node.value)
            result.extend(self.in_order_traversal(node.right, False))
        return result
    
    def pre_order_traversal(self, node: Optional[TreeNode] = None, first_call: bool = True) -> List[int]:
        """Pre-order traversal (Node -> Left -> Right)"""
        if first_call:
            node = self.root
        
        result = []
        if node:
            result.append(node.value)
            result.extend(self.pre_order_traversal(node.left, False))
            result.extend(self.pre_order_traversal(node.right, False))
        return result
    
    def post_order_traversal(self, node: Optional[TreeNode] = None, first_call: bool = True) -> List[int]:
        """Post-order traversal (Left -> Right -> Node)"""
        if first_call:
            node = self.root
        
        result = []
        if node:
            result.extend(self.post_order_traversal(node.left, False))
            result.extend(self.post_order_traversal(node.right, False))
            result.append(node.value)
        return result
    
    def level_order_traversal(self) -> List[List[int]]:
        """Level-order (BFS) traversal - returns values level by level"""
        if not self.root:
            return []
        
        result = []
        queue = deque([self.root])
        
        while queue:
            level = []
            level_size = len(queue)
            
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.value)
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            result.append(level)
        
        return result
    
    def find_pairs_hashset(self, target: int) -> List[Tuple[int, int]]:
        """
        Find all pairs with sum equal to target using HashSet approach
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        values = self.in_order_traversal()
        pairs = []
        seen: Set[int] = set()
        
        for value in values:
            complement = target - value
            if complement in seen:
                # Add pair with smaller value first
                pairs.append((min(value, complement), max(value, complement)))
            seen.add(value)
        
        return pairs
    
    def find_pairs_two_pointer(self, target: int) -> List[Tuple[int, int]]:
        """
        Find all pairs with sum equal to target using Two-Pointer approach
        Utilizes the sorted property of BST in-order traversal
        Time Complexity: O(n)
        Space Complexity: O(n) for storing traversal
        """
        sorted_values = self.in_order_traversal()  # Already sorted for BST
        pairs = []
        left = 0
        right = len(sorted_values) - 1
        
        while left < right:
            current_sum = sorted_values[left] + sorted_values[right]
            
            if current_sum == target:
                pairs.append((sorted_values[left], sorted_values[right]))
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        
        return pairs
    
    def get_height(self, node: Optional[TreeNode] = None, first_call: bool = True) -> int:
        """Calculate the height of the tree"""
        if first_call:
            node = self.root
        
        if not node:
            return 0
        
        return 1 + max(self.get_height(node.left, False), self.get_height(node.right, False))
    
    def is_balanced(self, node: Optional[TreeNode] = None, first_call: bool = True) -> bool:
        """Check if tree is balanced (height difference <= 1 for all nodes)"""
        if first_call:
            node = self.root
        
        if not node:
            return True
        
        left_height = self.get_height(node.left, False)
        right_height = self.get_height(node.right, False)
        
        return (abs(left_height - right_height) <= 1 and 
                self.is_balanced(node.left, False) and 
                self.is_balanced(node.right, False))
    
    def count_nodes(self, node: Optional[TreeNode] = None, first_call: bool = True) -> int:
        """Count total nodes in tree"""
        if first_call:
            node = self.root
        
        if not node:
            return 0
        
        return 1 + self.count_nodes(node.left, False) + self.count_nodes(node.right, False)
    
    def print_tree(self, node: Optional[TreeNode] = None, level: int = 0, prefix: str = "Root: ", first_call: bool = True):
        """Print tree structure visually"""
        if first_call:
            node = self.root
        
        if node is not None:
            print(" " * (level * 4) + prefix + str(node.value))
            if node.left is not None or node.right is not None:
                if node.left:
                    self.print_tree(node.left, level + 1, "L--- ", False)
                else:
                    print(" " * ((level + 1) * 4) + "L--- None")
                if node.right:
                    self.print_tree(node.right, level + 1, "R--- ", False)
                else:
                    print(" " * ((level + 1) * 4) + "R--- None")


def main():
    print("=" * 70)
    print("LAB 5: Trees – Using Trees for Searching")
    print("Task: Find all pairs of nodes whose values sum to a target")
    print("=" * 70)
    
    # Create BST with sample values
    bst = BinarySearchTree()
    values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 90]
    
    print("\n1. Building Binary Search Tree")
    print("-" * 40)
    print(f"Inserting values: {values}")
    
    for value in values:
        bst.insert(value)
    
    print("\nTree Structure:")
    bst.print_tree()
    
    # Tree Properties
    print("\n2. Tree Properties")
    print("-" * 40)
    print(f"Total nodes: {bst.count_nodes()}")
    print(f"Tree height: {bst.get_height()}")
    print(f"Is balanced: {bst.is_balanced()}")
    
    # Traversals
    print("\n3. Tree Traversals")
    print("-" * 40)
    print(f"In-order (sorted):   {bst.in_order_traversal()}")
    print(f"Pre-order:           {bst.pre_order_traversal()}")
    print(f"Post-order:          {bst.post_order_traversal()}")
    print(f"Level-order (BFS):   {bst.level_order_traversal()}")
    
    # Find pairs with target sum
    print("\n4. Finding Pairs with Target Sum")
    print("-" * 40)
    
    test_targets = [100, 90, 120, 50, 150]
    
    for target in test_targets:
        print(f"\nTarget Sum: {target}")
        
        # HashSet approach
        pairs_hashset = bst.find_pairs_hashset(target)
        print(f"  HashSet Approach:     {pairs_hashset if pairs_hashset else 'No pairs found'}")
        
        # Two-pointer approach
        pairs_two_pointer = bst.find_pairs_two_pointer(target)
        print(f"  Two-Pointer Approach: {pairs_two_pointer if pairs_two_pointer else 'No pairs found'}")
        
        # Verify results
        if pairs_hashset:
            print(f"  Verification: ", end="")
            all_correct = all(a + b == target for a, b in pairs_hashset)
            print(f"{'All pairs sum correctly!' if all_correct else 'Error in pairs!'}")
    
    # Algorithm comparison
    print("\n5. Algorithm Comparison")
    print("-" * 40)
    print("""
    ┌─────────────────┬────────────────┬─────────────────┐
    │ Algorithm       │ Time           │ Space           │
    ├─────────────────┼────────────────┼─────────────────┤
    │ HashSet         │ O(n)           │ O(n)            │
    │ Two-Pointer     │ O(n)           │ O(n)            │
    │ Brute Force     │ O(n²)          │ O(n)            │
    └─────────────────┴────────────────┴─────────────────┘
    
    Both HashSet and Two-Pointer approaches have the same complexity,
    but Two-Pointer is more elegant for BST as it uses the sorted property.
    """)
    
    # Additional test with larger tree
    print("\n6. Testing with Larger Tree")
    print("-" * 40)
    
    large_bst = BinarySearchTree()
    import random
    random.seed(42)
    large_values = random.sample(range(1, 201), 50)  # 50 unique values
    
    for val in large_values:
        large_bst.insert(val)
    
    print(f"Created tree with {large_bst.count_nodes()} nodes")
    print(f"Height: {large_bst.get_height()}, Balanced: {large_bst.is_balanced()}")
    
    target = 150
    pairs = large_bst.find_pairs_hashset(target)
    print(f"\nPairs summing to {target}: {len(pairs)} pairs found")
    if pairs:
        print(f"First 5 pairs: {pairs[:5]}")
    
    print("\n" + "=" * 70)
    print("Lab 5 Complete!")
    print("=" * 70)


if __name__ == "__main__":
    main()
