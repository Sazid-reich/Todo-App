// Select various elements from the DOM
const container = document.querySelector('.container');
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('#input-todo');
const todoAddButton = document.querySelector('#addTodoButton');
const todoList = document.querySelector('#lists');
const messageElement = document.querySelector('#message');

// Function to display a message for feedback (e.g., success or error)
const showMessage = (text, status) => {
    // Set the message text and apply a status-specific background class
    messageElement.textContent = text;
    messageElement.classList.add(`bg-${status}`);

    // Remove the message and its styling after 1 second
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.classList.remove(`bg-${status}`);
    }, 1000);
};

// Function to create a new todo item in the DOM
const createTodo = (todoId, todoValue) => {
    // Create a new list item element for the todo
    const todoElement = document.createElement('li');
    todoElement.id = todoId; // Assign a unique ID to the todo
    todoElement.classList.add('li-style'); // Add styling class to the list item

    // Set the inner HTML of the list item, including a delete button
    todoElement.innerHTML = `
        <span>${todoValue}</span>
        <span><button class="btn delete-btn"><i class="fa fa-trash"></i></button></span>
    `;

    // Append the new todo item to the todo list
    todoList.appendChild(todoElement);

    // Add an event listener to the delete button for deleting the todo
    const deleteButton = todoElement.querySelector('.delete-btn');
    deleteButton.addEventListener('click', deleteTodo);
};

// Function to delete a todo item
const deleteTodo = (event) => {
    // Find the closest parent list item element (the todo to be deleted)
    const selectTodo = event.target.closest('li');
    const todoId = selectTodo.id;

    // Remove the todo from the DOM
    todoList.removeChild(selectTodo);

    // Retrieve todos from LocalStorage and filter out the deleted todo
    let todos = getTodosFromLocalStorage();
    todos = todos.filter(todo => todo.todoId !== todoId);

    // Save the updated todo list back to LocalStorage
    localStorage.setItem('todos', JSON.stringify(todos));

    // Show a success message
    showMessage('Todo deleted successfully', 'danger');
};

// Function to retrieve todos from LocalStorage
const getTodosFromLocalStorage = () => {
    // Parse the todos from LocalStorage or return an empty array if none exist
    return JSON.parse(localStorage.getItem('todos')) || [];
};

// Function to handle adding a new todo
const addTodo = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const todoValue = todoInput.value.trim(); // Trim whitespace from the input

    // Validate that the todo input is not empty
    if (todoValue === '') {
        showMessage('Todo cannot be empty', 'danger');
        return;
    }

    // Generate a unique ID for the new todo
    const todoId = Date.now().toString();

    // Create the todo in the DOM
    createTodo(todoId, todoValue);

    // Show a success message
    showMessage('Todo added successfully', 'success');

    // Save the new todo to LocalStorage
    const todos = getTodosFromLocalStorage();
    todos.push({ todoId, todoValue });
    localStorage.setItem('todos', JSON.stringify(todos));

    // Clear the input field after adding the todo
    todoInput.value = '';
};

// Function to load todos from LocalStorage on page load
const loadTodos = () => {
    // Retrieve todos from LocalStorage and render each todo in the DOM
    const todos = getTodosFromLocalStorage();
    todos.forEach(todo => createTodo(todo.todoId, todo.todoValue));
};

// Add event listeners
todoForm.addEventListener('submit', addTodo); // Handle form submission for adding todos
window.addEventListener('DOMContentLoaded', loadTodos); // Load todos when the page finishes loading
