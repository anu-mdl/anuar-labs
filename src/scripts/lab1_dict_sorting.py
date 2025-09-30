"""
Lab 1: Dictionary Sorting Implementation
This script demonstrates sorting a list of dictionaries by specific key values.
The list contains 50+ student records with various attributes.
"""

import random
from typing import List, Dict, Any, Union

def generate_student_data(count: int = 55) -> List[Dict[str, Any]]:
    """Generate a list of student dictionaries with random data."""
    
    names = [
        "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Edward Norton",
        "Fiona Apple", "George Lucas", "Hannah Montana", "Ian Fleming", "Julia Roberts",
        "Kevin Hart", "Luna Lovegood", "Michael Jordan", "Nina Simone", "Oscar Wilde",
        "Penny Lane", "Quincy Jones", "Rachel Green", "Steve Jobs", "Tina Turner",
        "Uma Thurman", "Victor Hugo", "Wendy Williams", "Xavier Woods", "Yara Shahidi",
        "Zoe Saldana", "Aaron Paul", "Bella Swan", "Chris Evans", "Demi Moore",
        "Emma Stone", "Frank Sinatra", "Grace Kelly", "Henry Ford", "Iris West",
        "Jack Sparrow", "Kate Winslet", "Liam Neeson", "Maya Angelou", "Noah Webster",
        "Olivia Pope", "Peter Parker", "Queen Latifah", "Ryan Reynolds", "Scarlett Johansson",
        "Tom Hanks", "Ursula Burns", "Viola Davis", "Will Smith", "Xena Warrior",
        "Yoda Master", "Zendaya Coleman", "Anthony Hopkins", "Beyonce Knowles", "Celine Dion",
        "David Beckham", "Eva Longoria", "Forest Whitaker", "Gal Gadot", "Hugh Jackman"
    ]
    
    majors = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Engineering", "Psychology"]
    years = [1, 2, 3, 4]
    
    students = []
    for i in range(count):
        student = {
            "id": i + 1,
            "name": names[i % len(names)],
            "age": random.randint(18, 25),
            "gpa": round(random.uniform(2.5, 4.0), 2),
            "major": random.choice(majors),
            "year": random.choice(years),
            "credits": random.randint(30, 150)
        }
        students.append(student)
    
    return students

def sort_dictionaries_by_key(data: List[Dict[str, Any]], key: str, reverse: bool = False) -> List[Dict[str, Any]]:
    """
    Sort a list of dictionaries by a specific key.
    
    Args:
        data: List of dictionaries to sort
        key: The key to sort by
        reverse: If True, sort in descending order
    
    Returns:
        Sorted list of dictionaries
    """
    try:
        return sorted(data, key=lambda x: x[key], reverse=reverse)
    except KeyError:
        print(f"Error: Key '{key}' not found in dictionaries")
        return data
    except TypeError:
        print(f"Error: Cannot compare values for key '{key}'")
        return data

def display_students(students: List[Dict[str, Any]], title: str, limit: int = 10):
    """Display student data in a formatted table."""
    print(f"\n{title}")
    print("=" * 80)
    print(f"{'ID':<4} {'Name':<20} {'Age':<4} {'GPA':<5} {'Major':<15} {'Year':<5} {'Credits':<8}")
    print("-" * 80)
    
    for i, student in enumerate(students[:limit]):
        print(f"{student['id']:<4} {student['name']:<20} {student['age']:<4} "
              f"{student['gpa']:<5} {student['major']:<15} {student['year']:<5} {student['credits']:<8}")
    
    if len(students) > limit:
        print(f"... and {len(students) - limit} more records")
    
    print(f"\nTotal records: {len(students)}")

def main():
    """Main function to demonstrate dictionary sorting."""
    print("Lab 1: Dictionary Sorting Implementation")
    print("Generating student data with 55 records...")
    
    # Generate student data (55 records, more than required 50)
    students = generate_student_data(55)
    
    # Display original data
    display_students(students, "Original Student Data (First 10 records):")
    
    # Sort by different keys
    sorting_examples = [
        ("name", False, "Students sorted by Name (A-Z)"),
        ("gpa", True, "Students sorted by GPA (Highest to Lowest)"),
        ("age", False, "Students sorted by Age (Youngest to Oldest)"),
        ("credits", True, "Students sorted by Credits (Most to Least)"),
        ("major", False, "Students sorted by Major (A-Z)")
    ]
    
    for key, reverse, title in sorting_examples:
        sorted_students = sort_dictionaries_by_key(students, key, reverse)
        display_students(sorted_students, title)
    
    # Demonstrate error handling
    print("\nTesting error handling:")
    invalid_sorted = sort_dictionaries_by_key(students, "invalid_key")
    print("Attempted to sort by non-existent key - handled gracefully")
    
    print("\nLab 1 implementation completed successfully!")
    print(f"✓ Created list with {len(students)} elements (requirement: at least 50)")
    print("✓ Implemented sorting function for dictionaries by specific keys")
    print("✓ Demonstrated sorting by multiple different keys")
    print("✓ Added error handling for invalid keys")

if __name__ == "__main__":
    main()
