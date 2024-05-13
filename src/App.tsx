import TodoForm from "@/components/TodoForm";

import "@/App.css";

function App() {
  return (
    <div className="flex flex-col gap-10 min-w-[calc(100%-64px)] min-h-screen">
      <header>
        <h1>todos</h1>
      </header>

      <main className="flex items-center justify-center">
        <TodoForm />
      </main>

      <footer className="flex flex-col mt-20 text-xs">
        <p>Double-click to edit a todo</p>
        <p>Clone TodoMVC</p>
      </footer>
    </div>
  );
}

export default App;
