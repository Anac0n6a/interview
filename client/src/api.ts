const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export type Todo = {
  id: number;
  text: string;
  completed: number;
  created_at: string;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${API_BASE}/todos`);
  return res.json();
}

export async function addTodo(text: string): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ text })
  });
  return res.json();
}

export async function deleteTodo(id: number) {
  await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
}

export async function toggleTodo(id: number) {
  const res = await fetch(`${API_BASE}/todos/${id}/toggle`, { method: 'PATCH' });
  return res.json();
}
