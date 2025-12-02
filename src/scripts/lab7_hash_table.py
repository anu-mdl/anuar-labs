"""
Lab 7: Hash Tables and Collision Handling
=========================================
Implementation of a hash table using chaining method for collision resolution.
Hash function: sum of cubes of ASCII codes modulo table size.
"""


class HashNode:
    """Node for the linked list in chaining"""

    def __init__(self, key: str, value: str):
        self.key = key
        self.value = value
        self.next = None

    def __repr__(self):
        return f"({self.key}: {self.value})"


class HashTable:
    """Hash Table with chaining collision resolution"""

    def __init__(self, size: int = 11):
        self.size = size
        self.buckets = [None] * size
        self.count = 0

    def hash(self, key: str) -> int:
        """
        Hash function: sum of cubes of ASCII codes modulo table size
        h(key) = (Σ ASCII(char)³) mod size
        """
        total = 0
        for char in key:
            ascii_code = ord(char)
            total += ascii_code ** 3  # Cube of ASCII code
        return total % self.size

    def hash_detailed(self, key: str) -> dict:
        """Calculate hash with detailed steps for demonstration"""
        steps = []
        total = 0
        for char in key:
            ascii_code = ord(char)
            cube = ascii_code ** 3
            total += cube
            steps.append({"char": char, "ascii": ascii_code, "cube": cube})

        return {"key": key, "steps": steps, "sum": total, "index": total % self.size}

    def insert(self, key: str, value: str) -> dict:
        """Insert a key-value pair into the hash table"""
        index = self.hash(key)
        is_collision = self.buckets[index] is not None

        # Check if key already exists and update
        current = self.buckets[index]
        while current:
            if current.key == key:
                old_value = current.value
                current.value = value
                return {
                    "index": index,
                    "collision": is_collision,
                    "updated": True,
                    "old_value": old_value,
                }
            current = current.next

        # Insert new node at the beginning of the chain
        new_node = HashNode(key, value)
        new_node.next = self.buckets[index]
        self.buckets[index] = new_node
        self.count += 1

        return {"index": index, "collision": is_collision, "updated": False}

    def search(self, key: str) -> dict:
        """Search for a key in the hash table"""
        index = self.hash(key)
        current = self.buckets[index]
        steps = 0

        while current:
            steps += 1
            if current.key == key:
                return {"found": True, "value": current.value, "index": index, "steps": steps}
            current = current.next

        return {"found": False, "value": None, "index": index, "steps": steps}

    def delete(self, key: str) -> bool:
        """Delete a key from the hash table"""
        index = self.hash(key)
        current = self.buckets[index]
        prev = None

        while current:
            if current.key == key:
                if prev:
                    prev.next = current.next
                else:
                    self.buckets[index] = current.next
                self.count -= 1
                return True
            prev = current
            current = current.next

        return False

    def display(self):
        """Display the hash table"""
        print("\n" + "=" * 60)
        print("HASH TABLE CONTENTS")
        print("=" * 60)
        for i, bucket in enumerate(self.buckets):
            chain = []
            current = bucket
            while current:
                chain.append(f'"{current.key}": "{current.value}"')
                current = current.next
            chain_str = " -> ".join(chain) if chain else "empty"
            collision_marker = " [CHAIN]" if len(chain) > 1 else ""
            print(f"[{i:2d}] {chain_str}{collision_marker}")
        print("=" * 60)

    def get_statistics(self) -> dict:
        """Get hash table statistics"""
        occupied = sum(1 for b in self.buckets if b is not None)
        collisions = sum(1 for b in self.buckets if b and b.next)
        max_chain = 0
        for bucket in self.buckets:
            length = 0
            current = bucket
            while current:
                length += 1
                current = current.next
            max_chain = max(max_chain, length)

        return {
            "size": self.size,
            "count": self.count,
            "occupied_buckets": occupied,
            "buckets_with_collisions": collisions,
            "load_factor": self.count / self.size,
            "max_chain_length": max_chain,
        }


def demonstrate_hash_function():
    """Demonstrate how the hash function works"""
    print("\n" + "=" * 60)
    print("HASH FUNCTION DEMONSTRATION")
    print("h(key) = (Σ ASCII(char)³) mod table_size")
    print("=" * 60)

    ht = HashTable(11)
    test_keys = ["cat", "dog", "apple", "hello"]

    for key in test_keys:
        details = ht.hash_detailed(key)
        print(f"\nHashing '{key}':")
        print("-" * 40)
        for step in details["steps"]:
            print(f"  '{step['char']}' -> ASCII {step['ascii']} -> {step['ascii']}³ = {step['cube']:,}")
        print(f"  Sum = {details['sum']:,}")
        print(f"  Hash index = {details['sum']:,} mod {ht.size} = {details['index']}")


def main():
    """Main demonstration of hash table operations"""
    print("\n" + "=" * 60)
    print("LAB 7: HASH TABLES WITH CHAINING")
    print("=" * 60)

    # Create hash table
    ht = HashTable(11)

    # Demonstrate hash function
    demonstrate_hash_function()

    # Insert sample data
    print("\n" + "=" * 60)
    print("INSERTING DATA")
    print("=" * 60)

    data = [
        ("apple", "A sweet red fruit"),
        ("banana", "A yellow tropical fruit"),
        ("cherry", "A small red stone fruit"),
        ("date", "A sweet brown fruit"),
        ("elderberry", "A dark purple berry"),
        ("fig", "A soft sweet fruit"),
        ("grape", "A small juicy fruit"),
        ("honeydew", "A green melon"),
        ("kiwi", "A fuzzy brown fruit"),
        ("lemon", "A sour yellow citrus"),
        ("mango", "A tropical stone fruit"),
        ("orange", "A citrus fruit"),
    ]

    for key, value in data:
        result = ht.insert(key, value)
        collision_msg = " (COLLISION!)" if result["collision"] else ""
        print(f"Insert '{key}' -> bucket [{result['index']}]{collision_msg}")

    # Display table
    ht.display()

    # Statistics
    print("\n" + "=" * 60)
    print("HASH TABLE STATISTICS")
    print("=" * 60)
    stats = ht.get_statistics()
    for key, value in stats.items():
        if isinstance(value, float):
            print(f"  {key}: {value:.2f}")
        else:
            print(f"  {key}: {value}")

    # Search operations
    print("\n" + "=" * 60)
    print("SEARCH OPERATIONS")
    print("=" * 60)

    search_keys = ["apple", "grape", "watermelon", "fig"]
    for key in search_keys:
        result = ht.search(key)
        if result["found"]:
            print(f"Search '{key}': FOUND at bucket [{result['index']}] after {result['steps']} step(s)")
            print(f"  Value: {result['value']}")
        else:
            print(f"Search '{key}': NOT FOUND (checked bucket [{result['index']}])")

    # Delete operations
    print("\n" + "=" * 60)
    print("DELETE OPERATIONS")
    print("=" * 60)

    delete_keys = ["cherry", "grape", "watermelon"]
    for key in delete_keys:
        deleted = ht.delete(key)
        print(f"Delete '{key}': {'SUCCESS' if deleted else 'NOT FOUND'}")

    # Display final state
    ht.display()

    # Final statistics
    print("\nFINAL STATISTICS")
    print("-" * 40)
    stats = ht.get_statistics()
    for key, value in stats.items():
        if isinstance(value, float):
            print(f"  {key}: {value:.2f}")
        else:
            print(f"  {key}: {value}")


if __name__ == "__main__":
    main()
