import React, { useState } from 'react';
import { auth } from './firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  auth.onAuthStateChanged((user) => {
    setUser(user);
  });

  return (
    <div className="App">
      {!user ? <Login /> : <Dashboard user={user} />}
    </div>
  );
}

export default App;