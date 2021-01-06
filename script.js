
class Model {

    constructor() {
        this.todo = [
            {id: 1, text: 'Do stuff A', complete: false},
            {id: 2, text: 'Do stuff B', complete: false}
        ]
    }

    addTodo(text) {
        const todo = {
            id: this.todo.length > 0 ? this.todo[this.todo.length - 1].id + 1: 1,
            text: text,
            complete: false
        }

        this.todo.push(todo)
    }

    editTodo(id, text) {
        this.todo = this.todo.map(
            todo => todo.id === id ? {id: id, text: text, complete: todo.complete}: todo
        )

        this.onTodoListChanged(this.todo)
    }

    deleteTodo(id) {
        this.todo = this.todo.filter(todo => todo.id !== id)

        this.onTodoListChanged(this.todo)
    }

    toggleTodo(id) {
        this.todo = this.todo.map(
            todo => todo.id === id ? {id: id, text: todo.text, complete: !todo.complete}: todo
        )

        this.onTodoListChanged(this.todo)
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback
    }
}

class View {

    constructor() {
        this.app = this.getElem('#root')

        this.title = this.createElem('h1')
        this.title.textContent = 'To Dos'

        this.form = this.createElem('form')

        this.input = this.createElem('input')
        this.input.type = 'text'
        this.input.placeholder = 'Add Todo'
        this.input.name = 'todo'

        this.submitButton = this.createElem('button')
        this.submitButton.textContent = 'Submit'

        this.todoList = this.createElem('ul', 'todo-list')

        this.form.append(this.input, this.submitButton)

        this.app.append(this.title, this.form, this.todoList)
    }

    get _todoText() {
        return this.input.value
    }

    _resetInput() {
        this.input.value = ''
    }

    createElem(tag, cls) {
        const elem = document.createElement(tag)
        if (cls) {
            elem.classList.add(cls)
        }
        return elem
    }

    getElem(selector) {
        const elem = document.querySelector(selector)
        return elem
    }

    displayTodo(todos) {
        while (this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild)
        }

        if (todos.length === 0) {
            const p = this.createElem('p')
            p.textContent = 'Nothing to do ! Add a task ?'
            this.todoList.append(p)
        } else {
            todos.forEach(
                todo => {
                    const li = this.createElem('li')
                    li.id = todo.id

                    const checkbox = this.createElem('input')
                    checkbox.type = 'checkbox'
                    checkbox.checked = todo.complete

                    const span = this.createElem('span')
                    span.contentEditable = true
                    span.classList.add('editable')

                    if (todo.complete) {
                        const strike = this.createElem('s')
                        strike.textContent = todo.text
                        span.append(strike)
                    } else {
                        span.textContent = todo.text
                    }

                    const deleteBtn = this.createElem('button', 'delete')
                    deleteBtn.textContent = 'Delete'
                    li.append(checkbox, span, deleteBtn)

                    this.todoList.append(li)
                }
            )
        }
    }

    bindAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            if (this._todoText) {
                handler(this._todoText)
                this._resetInput()
            }
        })
    }

    bindDeleteTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.className === 'delete') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }
}

class Controller {
    
    constructor(model, view) {
        this.model = model
        this.view = view

        this.view.bindAddTodo(this.handleAddTodo)
        this.view.bindDeleteTodo(this.handleDeleteTodo)
        this.view.bindToggleTodo(this.handleToggleTodo)
        this.model.bindTodoListChanged(this.onTodoListChanged)

        this.onTodoListChanged(this.model.todo)
    }

    onTodoListChanged = todos => {
        this.view.displayTodo(todos)
    }

    handleAddTodo = text => {
        this.model.addTodo(text)
    }

    handleEditTodo = (id, text) => {
        this.model.editTodo(id, text)
    }

    handleDeleteTodo = id => {
        this.model.deleteTodo(id)
    }

    handleToggleTodo = id => {
        this.model.toggleTodo(id)
    }

}

const app = new Controller(new Model(), new View())
