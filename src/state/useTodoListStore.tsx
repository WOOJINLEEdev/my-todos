import { create } from "zustand";

export interface Todo {
  id: string;
  todo: string;
  completed: boolean;
}

interface UseTodoListStoreProps {
  todoList: Todo[];
  count: number;
  addTodoItem: (todoItem: Todo) => void;
  setTodoList: (todos: Todo[]) => void;
  setCount: () => void;
}

const useTodoListStore = create<UseTodoListStoreProps>()((set) => ({
  todoList: [],
  count: 0,

  addTodoItem: (todoItem) => {
    set((state) => ({
      ...state,
      todoList: [...state.todoList, todoItem],
    }));
  },
  setTodoList: (todos) => {
    set((state) => ({
      ...state,
      todoList: todos,
    }));
  },
  setCount: () => {
    set((state) => ({
      ...state,
      count: state.count + 1,
    }));
  },
}));

export default useTodoListStore;
