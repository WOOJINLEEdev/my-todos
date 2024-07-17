import { create } from "zustand";

export interface Todo {
  id: string;
  todo: string;
  completed: boolean;
}

interface UseTodosStoreProps {
  todos: Todo[];
  count: number;
  addTodoItem: (todoItem: Todo) => void;
  setTodos: (todos: Todo[]) => void;
  setCount: () => void;
}

const useTodosStore = create<UseTodosStoreProps>()((set) => ({
  todos: [],
  count: 0,

  addTodoItem: (todoItem) => {
    set((state) => ({
      ...state,
      todos: [...state.todos, todoItem],
    }));
  },
  setTodos: (todos) => {
    set((state) => ({
      ...state,
      todos: todos,
    }));
  },
  setCount: () => {
    set((state) => ({
      ...state,
      count: state.count + 1,
    }));
  },
}));

export default useTodosStore;
