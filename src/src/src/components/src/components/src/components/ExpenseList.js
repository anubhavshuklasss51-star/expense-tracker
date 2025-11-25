// src/components/ExpenseList.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const ExpenseList = ({ user }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData = [];
      querySnapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsData);
    });

    return () => unsubscribe();
  }, [user]);

  const formatDate = (timestamp) => {
    return timestamp.toDate().toLocaleDateString();
  };

  return (
    <div className="expense-list">
      <h3>Recent Transactions</h3>
      <div className="transactions">
        {transactions.map(transaction => (
          <div key={transaction.id} className={`transaction ${transaction.type}`}>
            <div className="transaction-info">
              <span className="description">{transaction.description}</span>
              <span className="category">{transaction.category}</span>
              <span className="date">{formatDate(transaction.date)}</span>
            </div>
            <span className={`amount ${transaction.type}`}>
              {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;