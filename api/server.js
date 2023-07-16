const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json()); // allows to use content type app/json
app.use(cors()); // stops cors errors

mongoose.connect("mongodb://127.0.0.1:27017/mern-todo", {
    useNewUrlParser: true, // tells Mongoose to use the new URL parser instead of the deprecated one. recommended to set this as true for compatibility with latest versions of MongoDB and Mongoose.
    useUnifiedTopology: true // enables the new unified topology engine for handling MongoDB server discovery and monitoring. It is recommended to set this option to true for compatibility with the latest versions of MongoDB and Mongoose.
}) // {} is an options object which contains various configurations for the mongodb connection
.then(() => console.log("Connected to DB"))
.catch(console.error);

// import the model and use it inside the application
const Todo = require('./models/Todo');

// if we make a request to localhost 3001/todos, it will find our Todos using our model connected to mongoose database, and pass it back. Asynchronous function
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save();
    res.json(todo);
});

app.delete('/todo/delete/:id', async(req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
});

app.get('/todo/complete/:id', async (req, res) =>{
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
});

app.listen(3001, () => console.log("Server started on port 3001"));