import React, { useEffect, useState } from 'react'
import { fetchTodos, addTodo, deleteTodo, toggleTodo, Todo } from './api'

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')

  async function load() {
    const data = await fetchTodos()
    setTodos(data)
  }

  useEffect(() => { load() }, [])

  async function onAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    const t = await addTodo(text.trim())
    setTodos(prev => [t, ...prev])
    setText('')
  }

  async function onDelete(id: number) {
    await deleteTodo(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  async function onToggle(id: number) {
    const updated = await toggleTodo(id)
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Todo Fullstack (Sandbox)</h1>
      <form onSubmit={onAdd} style={{ marginBottom: 20 }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="New todo" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map(t => (
          <li key={t.id} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <input type="checkbox" checked={!!t.completed} onChange={() => onToggle(t.id)} />
            <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.text}</span>
            <button onClick={() => onDelete(t.id)} style={{ marginLeft: 'auto' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
