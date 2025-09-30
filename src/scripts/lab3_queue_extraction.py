"""
Lab 3: Stack and Queue Data Structures
Practical Task: Extract elements from queue until first even element
"""

class Queue:
    """Queue implementation using list with head and tail pointers"""
    
    def __init__(self):
        self.items = []
        self.head = 0
        self.tail = 0
    
    def enqueue(self, element):
        """Add element to the back of the queue - O(1)"""
        self.items.append(element)
        self.tail += 1
    
    def dequeue(self):
        """Remove and return element from front of queue - O(1)"""
        if self.is_empty():
            return None
        
        element = self.items[self.head]
        self.head += 1
        
        # Optimize memory: reset when queue becomes empty
        if self.head == self.tail:
            self.items = []
            self.head = 0
            self.tail = 0
        
        return element
    
    def peek(self):
        """Return front element without removing it - O(1)"""
        if self.is_empty():
            return None
        return self.items[self.head]
    
    def is_empty(self):
        """Check if queue is empty - O(1)"""
        return self.head == self.tail
    
    def size(self):
        """Return number of elements in queue"""
        return self.tail - self.head
    
    def to_list(self):
        """Convert queue to list for display"""
        return self.items[self.head:self.tail]


def extract_until_even(queue):
    """
    Extract elements from queue until the first element becomes even.
    
    Args:
        queue: Queue object containing integers
    
    Returns:
        list: Elements that were extracted (all odd numbers before first even)
    """
    extracted = []
    
    print("\n--- Starting Extraction Process ---")
    
    while not queue.is_empty():
        first = queue.peek()
        print(f"Current head element: {first}")
        
        # Check if first element is even
        if first % 2 == 0:
            print(f"✓ Found even number: {first}")
            print("Stopping extraction.")
            break
        
        # Extract odd element
        element = queue.dequeue()
        extracted.append(element)
        print(f"✗ Extracted odd number: {element}")
        print(f"  Remaining queue: {queue.to_list()}")
    
    if queue.is_empty():
        print("Queue is now empty (no even elements found)")
    
    return extracted


def demonstrate_stack_vs_queue():
    """Demonstrate the difference between Stack (LIFO) and Queue (FIFO)"""
    print("=" * 60)
    print("DEMONSTRATION: Stack vs Queue")
    print("=" * 60)
    
    elements = [1, 2, 3, 4, 5]
    print(f"\nOriginal elements: {elements}")
    
    # Stack (LIFO) - using list
    print("\n--- Stack (LIFO - Last In, First Out) ---")
    stack = []
    for elem in elements:
        stack.append(elem)
        print(f"Push: {elem} → Stack: {stack}")
    
    print("\nPopping from stack:")
    while stack:
        popped = stack.pop()
        print(f"Pop: {popped} → Remaining: {stack}")
    
    # Queue (FIFO)
    print("\n--- Queue (FIFO - First In, First Out) ---")
    queue = Queue()
    for elem in elements:
        queue.enqueue(elem)
        print(f"Enqueue: {elem} → Queue: {queue.to_list()}")
    
    print("\nDequeuing from queue:")
    while not queue.is_empty():
        dequeued = queue.dequeue()
        print(f"Dequeue: {dequeued} → Remaining: {queue.to_list()}")


def main():
    """Main function to demonstrate Lab 3 task"""
    
    print("=" * 60)
    print("LAB 3: STACK AND QUEUE")
    print("Task: Extract elements until first even element")
    print("=" * 60)
    
    # First demonstrate Stack vs Queue
    demonstrate_stack_vs_queue()
    
    # Test cases for the main task
    test_cases = [
        [1, 3, 5, 7, 9, 4, 6, 8],
        [2, 4, 6, 8],
        [1, 3, 5, 7, 9],
        [1, 3, 5, 2, 7, 9, 4],
        [10],
        []
    ]
    
    print("\n" + "=" * 60)
    print("MAIN TASK: Extract Until Even")
    print("=" * 60)
    
    for i, test_array in enumerate(test_cases, 1):
        print(f"\n{'=' * 60}")
        print(f"Test Case {i}")
        print(f"{'=' * 60}")
        print(f"Input array: {test_array}")
        
        # Initialize queue
        queue = Queue()
        for num in test_array:
            queue.enqueue(num)
        
        print(f"Initial queue: {queue.to_list()}")
        print(f"Queue size: {queue.size()}")
        
        # Extract until even
        extracted = extract_until_even(queue)
        
        # Results
        print(f"\n--- Results ---")
        print(f"Extracted elements: {extracted}")
        print(f"Remaining queue: {queue.to_list()}")
        print(f"Number of extracted elements: {len(extracted)}")
        print(f"Remaining queue size: {queue.size()}")


if __name__ == "__main__":
    main()
