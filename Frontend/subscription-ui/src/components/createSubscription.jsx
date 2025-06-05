import React, { useState } from 'react';
import currencyCodes from 'currency-codes';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const CreateSubscription = ({ onCreated }) => {
  const [form, setForm] = useState({
    name: '', price: '', currency: '', frequency: '', category: '', paymentMethod: '', status: '', startDate: ''
  });
  const [message, setMessage] = useState('');
  const currencyList = currencyCodes.data.map(c => c.code).filter((v, i, a) => a.indexOf(v) === i);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setMessage('');
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/subscriptions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Subscription created!');
      setForm({ name: '', price: '', currency: '', frequency: '', category: '', paymentMethod: '', status: '', startDate: '' });
      if (onCreated) onCreated(data);
    } else setMessage(data.error || 'Failed to create subscription');
  };

  return (
    <form className="glass-card mb-4" onSubmit={handleSubmit}>
      <h2 className="text-center mb-4 form-title">Create Subscription</h2>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <input type="text" name="name" className="form-control" placeholder="Subscription Name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <input type="number" name="price" className="form-control" placeholder="Price" value={form.price} onChange={handleChange} required />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-md-4">
          <select name="currency" className="form-select" value={form.currency} onChange={handleChange} required>
            <option value="">Currency</option>
            {currencyList.map(code => <option key={code} value={code}>{code}</option>)}
          </select>
        </div>
        <div className="col-12 col-md-4">
          <select name="frequency" className="form-select" value={form.frequency} onChange={handleChange} required>
            <option value="">Frequency</option>
            <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <select name="status" className="form-select" value={form.status} onChange={handleChange} required>
            <option value="">Status</option>
            <option value="active">Active</option><option value="paused">Paused</option><option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-md-6">
          <input type="date" name="startDate" className="form-control" value={form.startDate} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <input type="text" name="category" className="form-control" placeholder="Category" value={form.category} onChange={handleChange} required />
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