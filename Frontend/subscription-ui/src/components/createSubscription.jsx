import React, { useState } from 'react';
import currencyCodes from 'currency-codes';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Prepare currency list with INR and USD prioritized
const allCurrencyCodes = currencyCodes.codes();
const prioritized = ['INR', 'USD'];
const rest = allCurrencyCodes.filter(code => !prioritized.includes(code));
const sortedCurrencyList = [...prioritized, ...rest];

const CreateSubscription = ({ onCreated }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    currency: 'INR',       // default to INR
    frequency: '',
    category: '',
    paymentMethod: '',
    status: 'active',      // default status
    startDate: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    // For price, allow only numbers or empty string
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value.trimStart()
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    // Basic validation: startDate ISO format yyyy-mm-dd required by backend
    if (!form.startDate) {
      setMessage('Please select a valid start date.');
      return;
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Subscription created!');
      setForm({
        name: '',
        price: '',
        currency: 'INR',
        frequency: '',
        category: '',
        paymentMethod: '',
        status: 'active',
        startDate: '',
      });
      if (onCreated) onCreated(data);
    } else {
      setMessage(data.error || 'Failed to create subscription');
    }
  };

  return (
    <form className="glass-card mb-4" onSubmit={handleSubmit}>
      <h2 className="text-center mb-4 form-title">Create Subscription</h2>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Subscription Name"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={100}
          />
        </div>
        <div className="col-12 col-md-6">
          <input
            type="number"
            name="price"
            className="form-control"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            min={0}
            required
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-md-4">
          <select
            name="currency"
            className="form-select"
            value={form.currency}
            onChange={handleChange}
            required
          >
            <option value="">Currency</option>
            {sortedCurrencyList.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4">
          <select
            name="frequency"
            className="form-select"
            value={form.frequency}
            onChange={handleChange}
            required
          >
            <option value="">Frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <select
            name="status"
            className="form-select"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-md-6">
          <input
            type="date"
            name="startDate"
            className="form-control"
            value={form.startDate}
            onChange={handleChange}
            required
            max={new Date().toISOString().split("T")[0]} // prevent future dates
          />
        </div>
        <div className="col-12 col-md-6">
          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12">
          <select
            name="paymentMethod"
            className="form-select"
            value={form.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="netbanking">Net Banking</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100 fw-bold mt-4">Create</button>
      {message && <div className="mt-3 text-center text-success">{message}</div>}
    </form>
  );
};

export default CreateSubscription;
