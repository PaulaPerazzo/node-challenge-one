const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const users = []

function checkAccount(req, res, next) {
    const { username } = req.headers;
    const user = user.find(user => user.username === username);

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

    return res.status(201).json(users);
});



app.listen(3333, () => console.log('server is running'));
