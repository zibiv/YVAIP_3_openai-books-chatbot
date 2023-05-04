//clsx конкатинирует называние классов в строку разделенную пробелами
import { clsx, type ClassValue } from "clsx"
// twMerge позволяет решить конфликты если будут совпадающие классы tailwind
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  //clsx фильтрует пустые falsy значения и убирает ненужные пробелы, twMerge решает возникшие конфликты и делает запись более эффективной переписывая некоторые классы в один в полученной строке классов
  return twMerge(clsx(inputs))
}
