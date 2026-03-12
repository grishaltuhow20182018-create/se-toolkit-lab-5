import React, { useState } from 'react';
import { Dashboard } from './Dashboard';

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const [draft, setDraft] = useState('');
  const [view, setView] = useState<'items' | 'dashboard'>('items');

  if (!token) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); setToken(draft); }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Token" />
        <button type="submit">Connect</button>
      </form>
    );
  }
  return (
    <div>
      <nav>
        <button onClick={() => setView('items')}>Items</button>
        <button onClick={() => setView('dashboard')}>Dashboard</button>
      </nav>
      {view === 'items' ? <div>Items</div> : <Dashboard />}
    </div>
  );
};

export default App;
