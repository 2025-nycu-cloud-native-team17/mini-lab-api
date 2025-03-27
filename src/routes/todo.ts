import express, { Router } from 'express';
import { addTodo, deleteTodo, getTodos, updateTodoStatus } from '../services/todo';
import { TodoBody } from '../types/todo';

export const TodoRouter: Router = express.Router();

// GET all todos
TodoRouter.get('/v1/todos', async (req, res) => {
  try {
    const todos = await getTodos();
    return res.status(200).json({ todos });
  } catch (error) {
    console.error(`GET /v1/todos Error: ${error}`);
    return res.status(500).send(`[Server Error]: ${error}`);
  }
});

// POST create a new todo
TodoRouter.post('/v1/todos', async (req, res) => {
  try {
    const todoBody = req.body as TodoBody;
    const todo = await addTodo(todoBody);
    return res.status(201).json({ todo });
  } catch (error) {
    console.error(`POST /v1/todos Error: ${error}`);
    return res.status(500).send(`[Server Error]: ${error}`);
  }
});

// PUT update todo status
TodoRouter.put('/v1/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const todo = await updateTodoStatus(id, status);
    if (todo) {
      return res.status(200).json({ todo });
    } else {
      return res.status(404).json({ msg: `Not Found Todo:${id}` });
    }
  } catch (error) {
    console.error(`PUT /v1/todos/${req.params.id} Error: ${error}`);
    return res.status(500).send(`[Server Error]: ${error}`);
  }
});

// DELETE remove a todo
TodoRouter.delete('/v1/todos/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await deleteTodo(id);
    if (todo) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ msg: `Not Found Todo:${id}` });
    }
  } catch (error) {
    console.error(`DELETE /v1/todos/${req.params.id} Error: ${error}`);
    return res.status(500).send(`[Server Error]: ${error}`);
  }
});