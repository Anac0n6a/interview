const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// GET /todos
app.get('/todos', (req, res) => {
  const todos = db.all('SELECT id, text, completed, created_at FROM todos ORDER BY id DESC');
  res.json(todos);
});

// POST /todos
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  const result = db.run('INSERT INTO todos (text, completed) VALUES (?, ?)', [text, 0]);
  const todo = db.get('SELECT id, text, completed, created_at FROM todos WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json(todo);
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  db.run('DELETE FROM todos WHERE id = ?', [id]);
  res.status(204).end();
});

// PATCH /todos/:id/toggle
app.patch('/todos/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const todo = db.get('SELECT id, completed FROM todos WHERE id = ?', [id]);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  const newCompleted = todo.completed ? 0 : 1;
  db.run('UPDATE todos SET completed = ? WHERE id = ?', [newCompleted, id]);
  const updated = db.get('SELECT id, text, completed, created_at FROM todos WHERE id = ?', [id]);
  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
