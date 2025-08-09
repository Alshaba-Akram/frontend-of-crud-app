import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all items
  useEffect(() => {
    fetch(`${API_URL}/items`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // Add new item
  const addItem = async () => {
    if (!newItem.trim()) return;
    const res = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newItem }),
    });
    const data = await res.json();
    setItems([...items, data]);
    setNewItem("");
  };

  // Delete item
  const deleteItem = async (id) => {
    await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
    setItems(items.filter((item) => item._id !== id));
  };

  // Start editing
  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingText(name);
  };

  // Save edit
  const saveEdit = async (id) => {
    const res = await fetch(`${API_URL}/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingText }),
    });
    const data = await res.json();
    setItems(items.map((item) => (item._id === id ? data : item)));
    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className="app-container">
      <h1>📋 My Task List</h1>

      {/* Input & Add Button */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={addItem}>➕ Add</button>
      </div>

      {/* Task List */}
      <ul>
        {items.map((item) => (
          <li key={item._id} className="task-item">
            {editingId === item._id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button className="save-btn" onClick={() => saveEdit(item._id)}>
                  💾 Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingId(null)}
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <>
                <span>{item.name}</span>
                <div className="btn-group">
                  <button
                    className="edit-btn"
                    onClick={() => startEditing(item._id, item.name)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
