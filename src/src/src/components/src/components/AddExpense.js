// src/components/AddExpense.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AddExpense = ({ user }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState('expense');

  const categories = ['food', 'transport', 'shopping', 'entertainment', 'bills', 'health', 'other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'transactions'), {
        amount: parseFloat(amount),
        description,
        category,
        type,
        date: new Date(),
        userId: user.uid
      });
      setAmount('');
      setDescription('');
      alert('Transaction added successfully!');
    } catch (error) {
      alert('Error adding transaction: ' + error.message);
    }
  };

  return (
    <div className="add-expense">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default AddExpense;