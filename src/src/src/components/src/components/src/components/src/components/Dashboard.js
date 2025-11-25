// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(10000);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, [user]);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Prepare chart data
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      }
    ]
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Expense Tracker 💰</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Balance</h3>
          <p className={balance >= 0 ? 'positive' : 'negative'}>₹{balance}</p>
        </div>
        <div className="card">
          <h3>Total Income</h3>
          <p className="positive">₹{totalIncome}</p>
        </div>
        <div className="card">
          <h3>Total Expense</h3>
          <p className="negative">₹{totalExpense}</p>
        </div>
        <div className="card">
          <h3>Monthly Budget</h3>
          <p>₹{budget}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-panel">
          <AddExpense user={user} />
          <ExpenseList user={user} />
        </div>

        <div className="right-panel">
          <div className="chart-container">
            <h3>Expense by Category</h3>
            {Object.keys(expenseByCategory).length > 0 ? (
              <Pie data={pieData} />
            ) : (
              <p>No expense data to show</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;