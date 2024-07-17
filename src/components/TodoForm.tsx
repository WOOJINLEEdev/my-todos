import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { capitalizeFirstLetter } from "@/utils/common";

import useTodosStore, { Todo } from "@/state/useTodosStore";

interface FormData {
  todo: string;
}

const FILTERS = ["all", "active", "completed"];

const TodoForm = () => {
  const editRef = useRef<HTMLInputElement>(null);
  const todosRef = useRef<HTMLUListElement>(null);
  const filtersRef = useRef<HTMLUListElement>(null);

  const [index, setIndex] = useState<number | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isFilterClicked, setIsFilterClicked] = useState(false);
  const [clickedFilter, setClickedFilter] = useState("all");

  const { todos, count, setCount, setTodos, addTodoItem } = useTodosStore();

  const { register, handleSubmit, setFocus, resetField } = useForm<FormData>({
    defaultValues: {
      todo: "",
    },
  });

  useEffect(() => {
    setFocus("todo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent): void => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(e.target as Node)
      ) {
        setIsFilterClicked(false);
      }

      if (todosRef.current?.contains(e.target as Node)) {
        if (editRef && e.target !== editRef.current) {
          setIsSelected(false);
          setIndex(null);
        }
      }

      if (todosRef.current && !todosRef.current.contains(e.target as Node)) {
        setIsSelected(false);
        setIndex(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [todosRef]);

  useEffect(() => {
    if ((index && editRef) || index === 0) {
      editRef.current?.focus();
    }
  }, [selectedId, index]);

  const handleFormSubmit = async (data: FormData) => {
    addTodoItem({ id: `todo_${count}`, todo: data.todo, completed: false });
    setCount();
    resetField("todo");
  };

  const handleLabelDoubleClick = (item: Todo, index: number) => {
    setIsSelected((prev) => !prev);
    setSelectedId(item.id);
    setEditText(item.todo);
    setIndex(index);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.currentTarget.value);
  };

  const handleInputBlur = () => {
    setIsSelected(false);
  };

  const handleInputKeyDown = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      if (editText.trim().length < 2) {
        return;
      }

      setIsSelected(false);
      const findTodoItem = todos.find((item) => item.id === id);
      if (findTodoItem) {
        findTodoItem.todo = editText;
      }
    }
  };

  const handleFilterBtnClick = (value: string) => {
    setClickedFilter(value);
  };

  const handleAllCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    const clone: Todo[] = JSON.parse(JSON.stringify(todos));
    if (e.currentTarget.checked) {
      const allCompletedFields = clone.map((item) => {
        return {
          ...item,
          completed: true,
        };
      });
      setTodos(allCompletedFields);
    } else {
      const notCompletedFields = clone.map((item) => {
        return {
          ...item,
          completed: false,
        };
      });
      setTodos(notCompletedFields);
    }
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const clone: Todo[] = JSON.parse(JSON.stringify(todos));
    const findTodoItem = clone.find((item) => item.id === id);
    if (findTodoItem) {
      findTodoItem.completed = e.currentTarget.checked;
    }

    setTodos(clone);
  };

  const handleTodoItemDelete = (id: string) => {
    const filteredtodos = todos.filter((todoItem) => todoItem.id !== id);
    setTodos(filteredtodos);
  };

  const handleCompletedTodoClear = () => {
    const filteredtodos = todos.filter((item) => !item.completed);

    if (filteredtodos.length === 0) {
      setTodos([]);
      setClickedFilter("all");
      return;
    }

    setTodos(filteredtodos);
  };

  const getActiveTodoCount = () => {
    return todos.filter((todo) => !todo.completed).length;
  };

  const filterFields = (fields: Todo[]) => {
    if (fields && fields.length > 0) {
      switch (clickedFilter) {
        case "all":
          return fields;
        case "active":
          return fields.filter((field) => !field.completed);
        case "completed":
          return fields.filter((field) => field.completed);
        default:
          return fields;
      }
    }
  };

  const showAllCheckbox = () => {
    if (
      clickedFilter === "active" &&
      todos.filter((todo) => !todo.completed).length === 0
    ) {
      return false;
    }

    if (
      clickedFilter === "completed" &&
      todos.filter((todo) => todo.completed).length === 0
    ) {
      return false;
    }

    if (todos && todos.length > 0) {
      return true;
    }
  };

  const checkAllCheckbox = () => {
    if (clickedFilter === "completed") {
      return true;
    }

    return todos.every((todo) => todo.completed);
  };

  return (
    <div className="flex flex-col">
      <form
        className="z-10 relative w-[550px] border-t border-solid border-gray-100 shadow-xl"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {showAllCheckbox() && (
          <div className="absolute top-0 left-2 flex items-center justify-center w-8 h-16">
            <label htmlFor="allCheck" className="sr-only">
              전체 선택
            </label>
            <input
              type="checkbox"
              id="allCheck"
              className="w-8 h-8"
              onChange={(e) => handleAllCheckChange(e)}
              checked={checkAllCheckbox()}
            />
          </div>
        )}

        <label htmlFor="todo" className="sr-only">
          todo 입력
        </label>
        <input
          type="text"
          id="todo"
          placeholder="Type..."
          className="todo_input w-full p-4 pl-[60px] text-2xl ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register("todo", {
            required: true,
            minLength: 2,
            validate: (value) => value.trim().length >= 2 && true,
          })}
        />

        <ul className={`${todos.length > 0 ? "mt-1" : ""}`} ref={todosRef}>
          {filterFields(todos)?.map((todo, i) => {
            return (
              <li
                key={todo.id}
                className="relative border border-t-0 border-solid border-gray-200"
              >
                {isSelected && selectedId === todo.id ? (
                  <>
                    <label htmlFor="todoEditInput" className="sr-only">
                      todo 수정
                    </label>
                    <input
                      type="text"
                      id="todoEditInput"
                      className="w-full p-4 pl-[60px] text-2xl"
                      defaultValue={todo.todo}
                      ref={i === index ? editRef : undefined}
                      onKeyDown={(e) => handleInputKeyDown(e, todo.id)}
                      onChange={(e) => handleInputChange(e)}
                      onBlur={handleInputBlur}
                    />
                  </>
                ) : (
                  <div className="flex">
                    <div className="absolute top-0 left-2 flex items-center justify-center w-8 h-full">
                      <label htmlFor="todoItemCheck" className="sr-only">
                        todo 선택 체크박스
                      </label>
                      <input
                        type="checkbox"
                        id="todoItemCheck"
                        className="w-8 h-8"
                        value={todo.id}
                        onChange={(e) => handleCheckboxChange(e, todo.id)}
                        checked={todo.completed}
                      />
                    </div>

                    <label
                      role="button"
                      className={`block w-full p-4 pl-[60px] bg-white text-2xl text-left select-none ${todo.completed ? "line-through" : ""}`}
                      onClick={() => {
                        setIsSelected(false);
                        setIndex(null);
                      }}
                      onDoubleClick={() => handleLabelDoubleClick(todo, i)}
                    >
                      {todo?.todo}
                    </label>

                    <button
                      type="button"
                      className="absolute top-0 right-0 h-full bg-white"
                      aria-label="todo 삭제"
                      onClick={() => handleTodoItemDelete(todo.id)}
                    >
                      x
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {(isFilterClicked || todos.length > 0) && (
          <div className="flex justify-between min-h-5 px-4 py-2.5 border border-t-0 border-solid border-gray-200">
            <span>{getActiveTodoCount()} item left!</span>

            <ul className="flex gap-1" ref={filtersRef}>
              {FILTERS.map((filter, i) => {
                return (
                  <li key={`${filter}_${i}`}>
                    <button
                      type="button"
                      className={`p-0 px-1 bg-white ${clickedFilter === filter ? "border border-solid border-blue-500" : ""} focus:outline-none`}
                      onClick={() => handleFilterBtnClick(filter)}
                    >
                      {capitalizeFirstLetter(filter)}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              className="p-0 bg-white border-0 hover:underline focus:outline-none"
              onClick={() => handleCompletedTodoClear()}
            >
              Clear completed
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TodoForm;
