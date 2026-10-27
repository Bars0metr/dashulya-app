import { z } from 'zod';

export const studentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Имя должно содержать хотя бы 2 символа'),
  language: z.enum(['English', 'Arabic']),
  totalLessons: z.number().min(1, 'Минимум 1 занятие'),
  completedLessons: z.number().default(0),
  startDate: z.string(),
  endDate: z.string(),
  price: z.number().min(0),
  duration: z.number().default(60),
  color: z.string().default('#ec4899'), // Цвет ученика для календаря
  notes: z.string().optional(),
});

export type Student = z.infer<typeof studentSchema>;

export const lessonSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  date: z.string(), // ISO format YYYY-MM-DD
  time: z.string(), // HH:mm
  topic: z.string().optional(),
  completed: z.boolean().default(false),
});

export type Lesson = z.infer<typeof lessonSchema>;

export const authSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});
