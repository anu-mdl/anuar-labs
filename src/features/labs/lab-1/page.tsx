"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Student = {
  id: number;
  name: string;
  age: number;
  gpa: number;
  major: string;
  year: number;
  credits: number;
};

const generateStudentData = (): Student[] => {
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Edward Norton",
    "Fiona Apple",
    "George Lucas",
    "Hannah Montana",
    "Ian Fleming",
    "Julia Roberts",
    "Kevin Hart",
    "Luna Lovegood",
    "Michael Jordan",
    "Nina Simone",
    "Oscar Wilde",
    "Penny Lane",
    "Quincy Jones",
    "Rachel Green",
    "Steve Jobs",
    "Tina Turner",
    "Uma Thurman",
    "Victor Hugo",
    "Wendy Williams",
    "Xavier Woods",
    "Yara Shahidi",
    "Zoe Saldana",
    "Aaron Paul",
    "Bella Swan",
    "Chris Evans",
    "Demi Moore",
    "Emma Stone",
    "Frank Sinatra",
    "Grace Kelly",
    "Henry Ford",
    "Iris West",
    "Jack Sparrow",
    "Kate Winslet",
    "Liam Neeson",
    "Maya Angelou",
    "Noah Webster",
    "Olivia Pope",
    "Peter Parker",
    "Queen Latifah",
    "Ryan Reynolds",
    "Scarlett Johansson",
    "Tom Hanks",
    "Ursula Burns",
    "Viola Davis",
    "Will Smith",
    "Xena Warrior",
    "Yoda Master",
    "Zendaya Coleman",
    "Anthony Hopkins",
    "Beyonce Knowles",
    "Celine Dion",
  ];

  const majors = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Psychology",
  ];
  const years = [1, 2, 3, 4];

  return names.map((name, index) => ({
    id: index + 1,
    name,
    age: Math.floor(Math.random() * 8) + 18,
    gpa: Number.parseFloat((Math.random() * 2 + 2.5).toFixed(2)),
    major: majors[Math.floor(Math.random() * majors.length)],
    year: years[Math.floor(Math.random() * years.length)],
    credits: Math.floor(Math.random() * 120) + 30,
  }));
};

function sortDictionariesByKey<
  T extends Record<string, string | number>,
  K extends keyof T
>(data: T[], key: K, ascending = true): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[key] as T[K];
    const bValue = b[key] as T[K];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return ascending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (ascending) {
      return (aValue as unknown as number) - (bValue as unknown as number);
    } else {
      return (bValue as unknown as number) - (aValue as unknown as number);
    }
  });
}

export default function Lab1() {
  const [studentData] = useState<Student[]>(() => generateStudentData());
  const [sortedData, setSortedData] = useState<Student[]>(studentData);
  const [sortKey, setSortKey] = useState<keyof Student | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = () => {
    if (!sortKey) return;

    const sorted = sortDictionariesByKey<Student, keyof Student>(
      studentData,
      sortKey as keyof Student,
      sortOrder === "asc"
    );
    setSortedData(sorted);
  };

  const resetData = () => {
    setSortedData(studentData);
    setSortKey("");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          ← Назад к меню
        </Link>
        <h1 className="text-3xl font-light text-foreground mb-2">
          Лабораторная работа 1: Алгоритмы сортировки
        </h1>
        <p className="text-muted-foreground">
          Создайте функцию для сортировки списка словарей по значениям
          определенного ключа в каждом словаре.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-light">
            Управление сортировкой
          </CardTitle>
          <CardDescription>
            Выберите ключ для сортировки данных студентов и порядок сортировки
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end justify-between">
            <div className="flex gap-16">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2 block">
                  Сортировать по ключу
                </label>
                <Select
                  value={sortKey}
                  onValueChange={(value: string) =>
                    setSortKey(value as keyof Student)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите ключ для сортировки" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Имя</SelectItem>
                    <SelectItem value="age">Возраст</SelectItem>
                    <SelectItem value="gpa">Средний балл</SelectItem>
                    <SelectItem value="major">Специальность</SelectItem>
                    <SelectItem value="year">Курс</SelectItem>
                    <SelectItem value="credits">Кредиты</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2 block">
                  Порядок сортировки
                </label>
                <Select
                  value={sortOrder}
                  onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">По возрастанию</SelectItem>
                    <SelectItem value="desc">По убыванию</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSort} disabled={!sortKey}>
                Сортировать данные
              </Button>
              <Button variant="outline" onClick={resetData}>
                Сбросить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-light">
            Данные студентов ({sortedData.length} записей)
          </CardTitle>
          <CardDescription>
            {sortKey
              ? `Отсортировано по ${sortKey} (${
                  sortOrder === "asc" ? "по возрастанию" : "по убыванию"
                })`
              : "Исходный порядок"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">ID</th>
                  <th className="text-left py-2 px-3">Имя</th>
                  <th className="text-left py-2 px-3">Возраст</th>
                  <th className="text-left py-2 px-3">Средний балл</th>
                  <th className="text-left py-2 px-3">Специальность</th>
                  <th className="text-left py-2 px-3">Курс</th>
                  <th className="text-left py-2 px-3">Кредиты</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((student, index) => (
                  <tr
                    key={student.id}
                    className={index % 2 === 0 ? "bg-accent/20" : ""}
                  >
                    <td className="py-2 px-3">{student.id}</td>
                    <td className="py-2 px-3 font-medium">{student.name}</td>
                    <td className="py-2 px-3">{student.age}</td>
                    <td className="py-2 px-3">{student.gpa}</td>
                    <td className="py-2 px-3">{student.major}</td>
                    <td className="py-2 px-3">{student.year}</td>
                    <td className="py-2 px-3">{student.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
