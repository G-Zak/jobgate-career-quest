import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAttempts = create()(
 persist(
 (set, get) => ({
 attempts: [],

 addAttempt: (attempt) =>
 set((state) => ({
 attempts: [attempt, ...state.attempts]
 })),

 hydrate: (list) =>
 set(() => ({
 attempts: [...list]
 })),

 clearAttempts: () =>
 set(() => ({
 attempts: []
 })),

 getAttemptsForTest: (testId) =>
 get().attempts.filter(attempt => attempt.test_id === testId)
 }),
 {
 name: 'test-attempts-storage',
 version: 1,
 }
 )
);
