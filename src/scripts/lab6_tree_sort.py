"""
Lab 6: Sorting Trees - Successor and Predecessor Finding
Topic: Trees - Using Trees for Searching
Objective: Implement a binary tree class with methods for finding 
the successor and predecessor of a given value.
"""

class TreeNode:
    """Node class with parent pointer for efficient traversal"""
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.parent = None
    
    def __repr__(self):
        return f"TreeNode({self.value})"


class BinarySearchTree:
    """
    Binary Search Tree implementation with successor/predecessor methods.
    Supports parent pointers for efficient navigation.
    """
    
    def __init__(self):
        self.root = None
        self.size = 0
    
    def insert(self, value):
        """Insert a value into the BST. Time: O(h)"""
        new_node = TreeNode(value)
        self.size += 1
        
        if not self.root:
            self.root = new_node
            return new_node
        
        current = self.root
        while True:
            if value < current.value:
                if current.left is None:
                    current.left = new_node
                    new_node.parent = current
                    return new_node
                current = current.left
            elif value > current.value:
                if current.right is None:
                    current.right = new_node
                    new_node.parent = current
                    return new_node
                current = current.right
            else:
                # Duplicate value - don't insert
                self.size -= 1
                return current
    
    def find(self, value):
        """Find a node by value. Time: O(h)"""
        current = self.root
        while current:
            if value == current.value:
                return current
            elif value < current.value:
                current = current.left
            else:
                current = current.right
        return None
    
    def find_min(self, node):
        """Find minimum node in subtree. Time: O(h)"""
        if node is None:
            return None
        while node.left:
            node = node.left
        return node
    
    def find_max(self, node):
        """Find maximum node in subtree. Time: O(h)"""
        if node is None:
            return None
        while node.right:
            node = node.right
        return node
    
    def find_successor(self, value):
        """
        Find the successor (next larger value) of a given value.
        
        Algorithm:
        1. If node has right subtree: successor is minimum of right subtree
        2. Else: traverse up until we find a node that is a left child
           The parent of that node is the successor
        
        Time Complexity: O(h) where h is the height of the tree
        
        Returns: successor value or None if no successor exists
        """
        node = self.find(value)
        if not node:
            return None
        
        # Case 1: Node has right subtree
        if node.right:
            return self.find_min(node.right).value
        
        # Case 2: No right subtree - go up to find successor
        successor = node.parent
        current = node
        
        # Move up while current is a right child
        while successor and current == successor.right:
            current = successor
            successor = successor.parent
        
        return successor.value if successor else None
    
    def find_predecessor(self, value):
        """
        Find the predecessor (previous smaller value) of a given value.
        
        Algorithm:
        1. If node has left subtree: predecessor is maximum of left subtree
        2. Else: traverse up until we find a node that is a right child
           The parent of that node is the predecessor
        
        Time Complexity: O(h) where h is the height of the tree
        
        Returns: predecessor value or None if no predecessor exists
        """
        node = self.find(value)
        if not node:
            return None
        
        # Case 1: Node has left subtree
        if node.left:
            return self.find_max(node.left).value
        
        # Case 2: No left subtree - go up to find predecessor
        predecessor = node.parent
        current = node
        
        # Move up while current is a left child
        while predecessor and current == predecessor.left:
            current = predecessor
            predecessor = predecessor.parent
        
        return predecessor.value if predecessor else None
    
    def in_order_traversal(self):
        """Return sorted list of all values. Time: O(n)"""
        result = []
        
        def traverse(node):
            if node:
                traverse(node.left)
                result.append(node.value)
                traverse(node.right)
        
        traverse(self.root)
        return result
    
    def get_height(self, node=None):
        """Get height of tree/subtree. Time: O(n)"""
        if node is None:
            node = self.root
        if node is None:
            return -1
        
        left_height = self.get_height(node.left) if node.left else -1
        right_height = self.get_height(node.right) if node.right else -1
        
        return 1 + max(left_height, right_height)
    
    def print_tree(self, node=None, level=0, prefix="Root: "):
        """Print tree structure visually"""
        if node is None:
            node = self.root
        if node is None:
            print("Empty tree")
            return
        
        print(" " * (level * 4) + prefix + str(node.value))
        
        if node.left or node.right:
            if node.left:
                self.print_tree(node.left, level + 1, "L--- ")
            else:
                print(" " * ((level + 1) * 4) + "L--- None")
            
            if node.right:
                self.print_tree(node.right, level + 1, "R--- ")
            else:
                print(" " * ((level + 1) * 4) + "R--- None")


def demonstrate_successor_predecessor():
    """Main demonstration of successor/predecessor algorithms"""
    
    print("=" * 60)
    print("Lab 6: Binary Search Tree - Successor & Predecessor")
    print("=" * 60)
    
    # Create BST with sample values
    bst = BinarySearchTree()
    values = [50, 30, 70, 20, 40, 60, 80, 15, 25, 35, 45, 55, 65, 75, 85]
    
    print("\n1. Building BST with values:")
    print(f"   {values}")
    
    for v in values:
        bst.insert(v)
    
    print("\n2. Tree Structure:")
    print("-" * 40)
    bst.print_tree()
    
    print("\n3. In-Order Traversal (Sorted):")
    sorted_values = bst.in_order_traversal()
    print(f"   {sorted_values}")
    
    print(f"\n4. Tree Statistics:")
    print(f"   - Size: {bst.size} nodes")
    print(f"   - Height: {bst.get_height()}")
    
    # Test successor and predecessor for all values
    print("\n5. Successor and Predecessor for Each Node:")
    print("-" * 50)
    print(f"{'Value':<10}{'Predecessor':<15}{'Successor':<15}")
    print("-" * 50)
    
    for value in sorted_values:
        pred = bst.find_predecessor(value)
        succ = bst.find_successor(value)
        pred_str = str(pred) if pred is not None else "None"
        succ_str = str(succ) if succ is not None else "None"
        print(f"{value:<10}{pred_str:<15}{succ_str:<15}")
    
    # Detailed walkthrough examples
    print("\n6. Detailed Algorithm Walkthrough:")
    print("=" * 50)
    
    # Example 1: Node with right subtree
    print("\n   Example 1: Finding Successor of 30")
    print("   " + "-" * 40)
    print("   - Node 30 has right child (40)")
    print("   - Find minimum in right subtree of 30")
    print("   - Subtree rooted at 40 has min value 35")
    print(f"   → Successor of 30 is: {bst.find_successor(30)}")
    
    # Example 2: Node without right subtree
    print("\n   Example 2: Finding Successor of 45")
    print("   " + "-" * 40)
    print("   - Node 45 has no right child")
    print("   - Go up: 45 is right child of 40")
    print("   - Go up: 40 is right child of 30")
    print("   - Go up: 30 is left child of 50 ← STOP")
    print(f"   → Successor of 45 is: {bst.find_successor(45)}")
    
    # Example 3: Node with left subtree (predecessor)
    print("\n   Example 3: Finding Predecessor of 70")
    print("   " + "-" * 40)
    print("   - Node 70 has left child (60)")
    print("   - Find maximum in left subtree of 70")
    print("   - Subtree rooted at 60 has max value 65")
    print(f"   → Predecessor of 70 is: {bst.find_predecessor(70)}")
    
    # Example 4: Node without left subtree (predecessor)
    print("\n   Example 4: Finding Predecessor of 55")
    print("   " + "-" * 40)
    print("   - Node 55 has no left child")
    print("   - Go up: 55 is left child of 60")
    print("   - 60's parent is 70, but we came from left")
    print("   - Go up: 60 is left child of 70 ← Continue")
    print("   - 70 is right child of 50 ← STOP")
    print(f"   → Predecessor of 55 is: {bst.find_predecessor(55)}")
    
    # Edge cases
    print("\n7. Edge Cases:")
    print("-" * 50)
    
    min_val = sorted_values[0]
    max_val = sorted_values[-1]
    
    print(f"   - Predecessor of minimum ({min_val}): {bst.find_predecessor(min_val)}")
    print(f"   - Successor of maximum ({max_val}): {bst.find_successor(max_val)}")
    print(f"   - Successor of non-existent (100): {bst.find_successor(100)}")
    
    # Verification
    print("\n8. Verification (Successor chain from min to max):")
    print("-" * 50)
    
    chain = []
    current = min_val
    while current is not None:
        chain.append(current)
        current = bst.find_successor(current)
    
    print(f"   Chain: {' → '.join(map(str, chain))}")
    print(f"   Matches sorted order: {chain == sorted_values}")
    
    print("\n" + "=" * 60)
    print("Lab 6 Complete!")
    print("=" * 60)


if __name__ == "__main__":
    demonstrate_successor_predecessor()
