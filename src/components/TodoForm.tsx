import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { capitalizeFirstLetter } from "@/utils/common";

import useTodoListStore, { Todo } from "@/state/useTodoListStore";

interface FormData {
  todo: string;
}

const FILTERS = ["all", "active", "completed"];

const TodoForm = () => {
  const ulRef = useRef<HTMLUListElement>(null);
  const editRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLUListElement>(null);

  const [isSelected, setIsSelected] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [index, setIndex] = useState<number | null>(null);
  const [isFilterClicked, setIsFilterClicked] = useState(false);
  const [clickedFilter, setClickedFilter] = useState("all");

  const { todoList, count, setCount, setTodoList, addTodoItem } =
    useTodoListStore();

  const { register, handleSubmit, resetField } = useForm<FormData>({
    defaultValues: {
      todo: "",
    },
  });

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent): void {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(e.target as Node)
      ) {
        setIsFilterClicked(false);
      }

      if (ulRef.current?.contains(e.target as Node)) {
        if (editRef && e.target !== editRef.current) {
          setIsSelected(false);
          setIndex(null);
        }
      }

      if (ulRef.current && !ulRef.current.contains(e.target as Node)) {
        setIsSelected(false);
        setIndex(null);
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [ulRef]);

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

  const handleKeyDown = (e: KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      if (editText.trim().length < 2) {
        return;
      }

      setIsSelected(false);
      const findTodoItem = todoList.find((item) => item.id === id);
      if (findTodoItem) {
        findTodoItem.todo = editText;
      }
    }
  };

  const handleFilterBtnClick = (value: string) => {
    setClickedFilter(value);
  };

  const handleAllCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    const clone: Todo[] = JSON.parse(JSON.stringify(todoList));
    if (e.currentTarget.checked) {
      const allCompletedFields = clone.map((item) => {
        return {
          ...item,
          completed: true,
        };
      });
      setTodoList(allCompletedFields);
    } else {
      const notCompletedFields = clone.map((item) => {
        return {
          ...item,
          completed: false,
        };
      });
      setTodoList(notCompletedFields);
    }
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const clone: Todo[] = JSON.parse(JSON.stringify(todoList));
    const findTodoItem = clone.find((item) => item.id === id);
    if (findTodoItem) {
      findTodoItem.completed = e.currentTarget.checked;
    }

    setTodoList(clone);
  };

  const handleTodoItemDelete = (id: string) => {
    const filteredTodoList = todoList.filter((todoItem) => todoItem.id !== id);
    setTodoList(filteredTodoList);
  };

  const handleCompletedTodoClear = () => {
    const filteredTodoList = todoList.filter((item) => !item.completed);

    if (filteredTodoList.length === 0) {
      setTodoList([]);
      setClickedFilter("all");
      return;
    }

    setTodoList(filteredTodoList);
  };

  function getTodoCount() {
    return todoList.filter((todo) => !todo.completed).length;
  }

  function filterFields(fields: Todo[]) {
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
  }

  function showAllCheckbox() {
    if (
      clickedFilter === "active" &&
      todoList.filter((todo) => !todo.completed).length === 0
    ) {
      return false;
    }

    if (
      clickedFilter === "completed" &&
      todoList.filter((todo) => todo.completed).length === 0
    ) {
      return false;
    }

    if (todoList && todoList.length > 0) {
      return true;
    }
  }

  function checkAllCheckbox() {
    if (clickedFilter === "completed") {
      return true;
    }

    return todoList.every((todo) => todo.completed);
  }

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

        <ul className={`${todoList.length > 0 ? "mt-1" : ""}`} ref={ulRef}>
          {filterFields(todoList)?.map((todo, i) => {
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
                      onKeyDown={(e) => handleKeyDown(e, todo.id)}
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

        {(isFilterClicked || todoList.length > 0) && (
          <div className="flex justify-between min-h-5 px-4 py-2.5 border border-t-0 border-solid border-gray-200">
            <span>{getTodoCount()} item left!</span>

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
