import React, { useState } from 'react';
import currencyCodes from 'currency-codes';


const API_BASE_URL = import.meta.env.VITE_API_URL;


const CreateSubscription = ({ onCreated }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    currency: '',
    frequency: '',
    category: '',
    paymentMethod: '',
    status: '',
    startDate: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
       const res = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Subscription created!');
        setForm({
          name: '',
          price: '',
          currency: '',
          frequency: '',
          category: '',
          paymentMethod: '',
          status: '',
          startDate: ''
        });
        if (onCreated) onCreated(data);
      } else {
        setMessage(data.error || 'Failed to create subscription');
      }
    } catch (err) {
      setMessage('Network error');
    }
  };
const currencyList = currencyCodes.data.map(c => c.code).filter((v, i, a) => a.indexOf(v) === i);

  return (
    <form className="glass-card mb-4" onSubmit={handleSubmit}>
      <h2 className="text-center mb-4 form-title">Create Subscription</h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Subscription Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          name="price"
          className="form-control"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>
     <div className="mb-3">
  <select
    name="currency"
    className="form-select"
    value={form.currency}
    onChange={handleChange}
    required
  >
    <option value="">Select Currency</option>
    {currencyList.map(code => (
      <option key={code} value={code}>{code}</option>
    ))}
  </select>
</div>
      <div className="mb-3">
        <select
          name="frequency"
          className="form-select"
          value={form.frequency}
          onChange={handleChange}
          required
        >
          <option value="">Select Frequency</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="mb-3">
  <select
    name="category"
    className="form-select"
    value={form.category}
    onChange={handleChange}
    required
  >
    <option value="">Select Category</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Education">Education</option>
    <option value="Health">Health</option>
    <option value="Software">Software</option>
    <option value="Other">Other</option>
  </select>
</div>
      <div className="mb-3">
  <select
    name="paymentMethod"
    className="form-select"
    value={form.paymentMethod}
    onChange={handleChange}
    required
  >
    <option value="">Select Payment Method</option>
    <option value="UPI">UPI</option>
    <option value="NetBanking">Net Banking</option>
    <option value="Wallet">Wallet</option>
    <option value="Credit Card">Credit Card</option>
    <option value="Debit Card">Debit Card</option>
    <option value="PayPal">PayPal</option>
    <option value="Cash">Cash</option>
    <option value="Other">Other</option>
  </select>
</div>
      <div className="mb-3">
        <select
          name="status"
          className="form-select"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="paused">Paused</option>
        </select>
      </div>
      <div className="mb-3">
        <input
          type="date"
          name="startDate"
          className="form-control"
          placeholder="Start Date"
          value={form.startDate}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100 fw-bold">
        Create
      </button>
      {message && <div className="mt-3 text-center text-success">{message}</div>}
    </form>
  );
};

export default CreateSubscription;