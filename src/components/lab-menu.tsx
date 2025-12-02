import Link from "next/link";

const labProjects = [
  {
    number: 1,
    title: "Сортировка",
    description:
      "Создайте функцию для сортировки списка словарей по значениям определенного ключа в каждом словаре.",
  },
  {
    number: 2,
    title: "Динамическое программирование",
    description: "Найти n-й элемент ряда Фибоначчи.",
  },
  {
    number: 3,
    title: "Стек и очереди",
    description:
      "Элементы целочисленного массива записать в очередь. Написать функцию извлечения элементов из очереди до тех пор, пока первый элемент очереди не станет четным.",
  },
  {
    number: 4,
    title: "Графы",
    description:
      "Напишите функцию для поиска кратчайшего пути между двумя вершинами графа, используя алгоритм A*.",
  },
  {
    number: 5,
    title: "Поисковые деревья",
    description:
      "Создать алгоритм для нахождения всех пар узлов, которые дают заданную сумму.",
  },
  {
    number: 6,
    title: "Деревья сортировки",
    description:
      "Реализуйте класс бинарного дерева с методами поиска преемника и предшественника для заданного значения.",
  },
  {
    number: 7,
    title: "Хеш таблицы",
    description:
      " Реализуйте хеш-функцию, которая складывает кубы ASCII-кодов символов строки и берет остаток от деления на размер хеш-таблицы. Создайте хеш-таблицу и добавьте основные операции, используя метод цепочек для решения коллизий.",
  },
];

export function LabMenu() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-16">
        <h1 className="text-4xl font-light text-foreground mb-4 text-balance">
          Лабораторные проекты
        </h1>
        <p className="text-lg text-muted-foreground font-light leading-relaxed">
          Коллекция лабораторных проектов для учебных заведений и курсов в
          Университете Карагандинский технический университет имени А.С.
          Сагинова
        </p>
      </div>

      <div className="space-y-1">
        {labProjects.map((lab) => (
          <Link
            key={lab.number}
            href={`labs/lab-${lab.number}`}
            className="group block border-b border-border last:border-b-0 py-6 transition-all duration-200 hover:bg-accent/50"
          >
            <div className="flex items-start justify-between gap-8 pl-2">
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-sm font-mono text-muted-foreground">
                    Lab {lab.number}
                  </span>
                  <h2 className="text-xl font-light text-foreground group-hover:text-primary transition-colors">
                    {lab.title}
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {lab.description}
                </p>
              </div>
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pr-6">
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground font-light">
          Кафедра ИВС • Академический год 2025-2026
        </p>
      </div>
    </div>
  );
}
