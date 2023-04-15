"use strict";

//Selected Elements
const listContainer = document.querySelector(".list-container");
const toDoItem = document.querySelector(".todo-item");
const inputForm = document.querySelector(".create-todo");
const createInput = document.querySelector(".create-input");
const closeBtn = document.querySelector(".close");
const itemCountEl = document.querySelector(".item-count");
const allButtonDisplay = document.querySelector(".all-btn");
const activeButtonDisplay = document.querySelector(".active-btn");
const completedButtonDisplay = document.querySelector(".clear-btn");
const clearCompletedButton = document.querySelector(".clear-completed");

//GLOBAL VARIABLES
let todos = [];
let id = 0;

//FUNCTIONS

//load from local storage
function loadFromLocalStorage() {
  const storedToDos = localStorage.getItem("todos");
  // console.log(storedToDos);

  if (!storedToDos) return;

  todos = JSON.parse(storedToDos);
  // console.log(todos);

  if (todos.length === 0) return todos;

  id = todos.at(-1)["id"] + 1;
  // console.log(id);

  for (let todo of todos) {
    createToDoItemElement(todo);
  }

  updateItemCount();
}

loadFromLocalStorage();

//insert into local storage
function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//create todo item element
function createToDoItemElement(data) {
  let html = `
  <div id=${data.id} class="row todo-item item-1 border-bottom">
    <div class="check ${data.complete === true ? "active-check" : ""}">
      <img src="images/icon-check.svg" alt=" " />
    </div>
    <p class= "${data.complete === true ? "complete" : ""}">${data.text}</p>
    <button class="close">
      <img src="images/icon-cross.svg" alt=" " />
    </button>
  </div>`;

  listContainer.insertAdjacentHTML("afterbegin", html);
}

//remove todo item element and todo item
//data from array
function removeToDoItemElement(element) {
  todos = todos.filter(
    (todo) => todo.id !== parseInt(element.parentElement.id)
  );

  updateItemCount();
  updateLocalStorage();

  element.parentElement.remove();
  // console.log(todos);
}

//insert todo item to todo array
function insertItemToArray(data) {
  todos.push(data);
  id++;
}

//mark complete in todo array (set complete to true)
function markComplete(element) {
  todos = todos.map((todo) => {
    if (todo.id === parseInt(element.parentElement.id)) {
      todo.complete = !todo.complete;
    }
    return todo;
  });

  updateItemCount();
  updateLocalStorage();
}

//clear complete in todo array (set complete to false)
function clearComplete(element) {
  todos = todos.map((todo) => {
    if (todo.id === parseInt(element.parentElement.id)) {
      todo.complete = !todo.complete;
    }
    return todo;
  });

  updateItemCount();
  updateLocalStorage();
}

//update Item count function
function updateItemCount() {
  const count = todos.reduce((acc, todo) => {
    if (todo.complete === false) acc++;
    return acc;
  }, 0);

  // console.log(todos);
  itemCountEl.textContent = `${count} items left`;
}

//EVENT LISTENERS
inputForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let createInputValue = createInput.value;
  console.log(createInputValue);

  let data = { id: id, text: createInputValue, complete: false };

  createToDoItemElement(data);
  insertItemToArray(data);

  updateLocalStorage();
  updateItemCount();
});

listContainer.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("check")) {
    e.target.classList.toggle("active-check");
    markComplete(e.target);
    e.target.parentElement.children[1].classList.toggle("complete");
  }

  if (e.target && e.target.parentElement.classList.contains("close")) {
    removeToDoItemElement(e.target.parentElement);
    clearComplete(e.target.parentElement);
  }

  updateLocalStorage();
  updateItemCount();
});

//HTML LIVE COLLECTION
let toDoItemsAll = document.getElementsByClassName("todo-item");

//BUTTON EVENT LISTENERS
allButtonDisplay.addEventListener("click", function (e) {
  for (let el of [...toDoItemsAll]) {
    el.remove();
  }

  todos.forEach((todo) => {
    if (todo.complete === false || todo.complete === true) {
      createToDoItemElement(todo);
    }
  });
});

activeButtonDisplay.addEventListener("click", function (e) {
  for (let el of [...toDoItemsAll]) {
    el.remove();
  }

  todos.forEach((todo) => {
    if (todo.complete === false) {
      createToDoItemElement(todo);
    }
  });
});

completedButtonDisplay.addEventListener("click", function (e) {
  for (let el of [...toDoItemsAll]) {
    el.remove();
  }

  todos.forEach((todo) => {
    if (todo.complete === true) {
      createToDoItemElement(todo);
    }
  });
});

clearCompletedButton.addEventListener("click", function (e) {
  todos = todos.filter((todo) => todo.complete === false);

  updateLocalStorage();
  updateItemCount();

  for (let el of [...toDoItemsAll]) {
    if (el.querySelector(".active-check")) {
      el.remove();
    }
  }
});
