import { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('pro_todos_light');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('pro_todos_light', JSON.stringify(todos));
  }, [todos]);

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

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-zinc-200 text-slate-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-xl shadow-slate-200/60 p-6 md:p-8">
        
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Taskify Pro ✨
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Apne daily goals ko clean aur smart tarike se manage karo</p>
          </div>
          <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] text-violet-600 font-bold uppercase tracking-wider block">Progress</span>
            <span className="text-lg font-extrabold text-slate-700">{progressPercent}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="w-full bg-slate-100 h-2.5 rounded-full mb-6 overflow-hidden border border-slate-200">
            <div 
              className="bg-gradient-to-r from-violet-500 to-indigo-600 h-full transition-all duration-500 rounded-full"
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
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-white placeholder-slate-400 text-sm font-medium transition shadow-sm"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 px-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition cursor-pointer shadow-sm"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-violet-500/25 transition duration-200 text-sm tracking-wide"
          >
            + Add New Task
          </button>
        </form>

        {/* Filter Tabs & Clear Completed */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg transition ${filter === 'all' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3.5 py-1.5 rounded-lg transition ${filter === 'active' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Active ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3.5 py-1.5 rounded-lg transition ${filter === 'completed' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Done ({completedCount})
            </button>
          </div>

          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition"
            >
              Clear Completed
            </button>
          )}
        </div>

        {/* Task List Container */}
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-base font-semibold">Yahan koi task nahi mila! ✨</p>
              <p className="text-xs mt-1 text-slate-400">Naya task add karke apni productivity shuru karo.</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 shadow-sm ${
                  todo.completed
                    ? 'bg-slate-50/60 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200/80 hover:border-violet-300 hover:shadow-md'
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
                    className="mt-1 w-4 h-4 accent-violet-600 cursor-pointer rounded"
                  />
                  <div>
                    <p
                      className={`font-semibold text-sm leading-snug select-none ${
                        todo.completed ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        todo.priority === 'High' ? 'bg-rose-50 border-rose-200 text-rose-600' :
                        todo.priority === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                        'bg-emerald-50 border-emerald-200 text-emerald-600'
                      }`}>
                        {todo.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{todo.createdAt}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition opacity-80 md:opacity-0 group-hover:opacity-100"
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Total: {totalCount} tasks</span>
          <span>Clean Minimalist Edition ⚡</span>
        </div>

      </div>
    </div>
  );
}

export default App;