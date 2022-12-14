const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checkAccount(req, res, next) {
    const { username } = req.headers;
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).json({error: "user not found"});
    };

    req.user = user;

    return next();
};

app.post('/user', (req, res) => {
    const { name, username } = req.body;
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(400).json({error: "user already exists!"});
    };

    const id = uuidv4();

    users.push({
        id,
        username,
        name,
        todos: [],
    });

    return res.status(201).send();
});

app.get('/todos', checkAccount, (req, res) => {
    const { user } = req;

    return res.json(user.todos);
});

app.post('/todo', checkAccount, (req, res) => {
    const { user } = req;
    const id = uuidv4();
    const { title } = req.body;

    user.todos.push({
        id,
        title,
        done: false,
        deadline: new Date(2022-11-04),
        createdAt: new Date(),
    });

    return res.json(user.todos);
});

app.put('/todo/:id', checkAccount, (req, res) => {
    const { user } = req;
    const { title, deadline } = req.body;
    const { id } = req.params;
    const updatedTodo = user.todos.find(todo => todo.id === id);

    updatedTodo.title = title;
    updatedTodo.deadline = new Date(deadline);

    return res.json(updatedTodo);
});

app.patch('/todo/:id/done', checkAccount, (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const patchedTodo = user.todos.find(todo => todo.id === id);

    patchedTodo.done = true;

    return res.json(patchedTodo);
});

app.delete('/todo/:id', checkAccount, (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const deletedTodo = user.todos.findIndex(todo => todo.id === id);

    if (deletedTodo === -1) {
        return res.status(404).json({ error: 'todo not found' });
    };

    user.todos.splice(deletedTodo, 1);

    return res.json(user);
});

app.listen(3333, () => console.log('server is running'));
