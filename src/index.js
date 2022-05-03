import "./style.css";

class UI {
  static displayTodos() {
    const todos = document.querySelector("#todos");
    todos.innerHTML = "";
    const todoitems = Store.getTodos();

    todoitems.forEach(({ text }, index) => {
      todos.innerHTML += `
        <div class="todo" data-id="${index}">
        <input class="todo-text" type="text" placeholder="todo" value="${text}" readonly />
        <button class="edit">Edit</button>
        <button class="remove">Remove</button>
      </div>`;
    });

    //Edit buttons eventlistener
    document.querySelectorAll(".edit").forEach((e) => {
      e.addEventListener("click", (e) => {
        e.target.parentElement.firstElementChild.removeAttribute("readonly");
      });
    });

    //Listening for enter while editing the todos to save
    document.querySelectorAll(".todo").forEach((e) => {
      e.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
          if (!e.target.getAttribute("readonly")) {
            const id = e.target.parentElement.getAttribute("data-id");
            Store.editTodo(id, e.target.value);
            UI.displayTodos();
          }
        }
      });
    });
    //Event listener for remove buttons
    document.querySelectorAll(".remove").forEach((e) => {
      e.addEventListener("click", (e) => {
        const id = e.target.parentElement.getAttribute("data-id");
        Store.removeTodo(id);
        UI.displayTodos();
      });
    });
  }
}

class Store {
  static getTodos() {
    if (!localStorage.getItem("todos"))
      localStorage.setItem("todos", JSON.stringify([]));
    const todos = JSON.parse(localStorage.getItem("todos"));
    return todos;
  }
  static addTodo(text) {
    let todos = JSON.parse(localStorage.getItem("todos"));
    todos.push({ text });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  static editTodo(i, text) {
    let todos = JSON.parse(localStorage.getItem("todos"));
    if (i > todos.length) return;
    todos[i] = { text };
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  static removeTodo(i) {
    let todos = JSON.parse(localStorage.getItem("todos"));
    if (i > todos.length) return;
    todos.splice(i, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

// Event listener for new todo form
document.querySelector("#todo-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = document.querySelector("#todo-input").value;
  if (!text) return;
  Store.addTodo(text);
  UI.displayTodos();
});

UI.displayTodos();
