import { useState, useEffect } from 'react';

function App() {
  // LocalStorage se tasks load karna
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('pro_todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium'); // High, Medium, Low
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('pro_todos', JSON.stringify(todos));
  }, [todos]);

  // Add Task
  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
      completed: false,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setTodos([newTodo, ...todos]);
    setInput('');
    setPriority('Medium');
  };

  // Toggle Status
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete Task
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Clear Completed Tasks
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Filtered Todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Stats calculation
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8">
        
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Taskify Pro 🚀
            </h1>
            <p className="text-sm text-slate-400 mt-1">Apne daily ke goals ko smart tarike se manage karo</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 px-4 py-2 rounded-2xl text-center">
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block">Progress</span>
            <span className="text-lg font-bold text-slate-200">{progressPercent}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="w-full bg-slate-800 h-2 rounded-full mb-6 overflow-hidden border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={addTodo} className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Naya task yahan likho..."
              className="flex-1 bg-slate-800/90 border border-slate-700 text-slate-100 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 text-sm transition"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 px-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 transition duration-200 text-sm tracking-wide"
          >
            + Add New Task
          </button>
        </form>

        {/* Filter Tabs & Clear Completed */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/50 text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${filter === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition ${filter === 'active' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Active ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition ${filter === 'completed' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Done ({completedCount})
            </button>
          </div>

          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition"
            >
              Clear Completed
            </button>
          )}
        </div>

        {/* Task List Container */}
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-base font-medium">Yahan koi task nahi mila! ✨</p>
              <p className="text-xs mt-1 text-slate-600">Naya task add karke apni productivity shuru karo.</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                  todo.completed
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-50'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 shadow-sm'
                }`}
              >
                <div
                  onClick={() => toggleComplete(todo.id)}
                  className="flex items-start gap-3.5 cursor-pointer flex-1 mr-2"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 accent-indigo-500 cursor-pointer rounded"
                  />
                  <div>
                    <p
                      className={`font-medium text-sm leading-snug select-none ${
                        todo.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        todo.priority === 'High' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                        todo.priority === 'Medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                        'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {todo.priority}
                      </span>
                      <span className="text-[10px] text-slate-500">{todo.createdAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition opacity-80 md:opacity-0 group-hover:opacity-100"
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Total: {totalCount} tasks</span>
          <span>Built with React & Tailwind ⚡</span>
        </div>

      </div>
    </div>
  );
}

export default App;