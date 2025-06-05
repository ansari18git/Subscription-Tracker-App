import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const SignUp = ({ onSignUp }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(`${API_BASE_URL}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Signup successful! Please sign in.');
      setForm({ name: '', email: '', password: '' });
      if (onSignUp) onSignUp();
    } else {
      setMessage(data.error || 'Signup failed');
    }
  };

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <h2 className="text-center mb-4 form-title">Sign Up</h2>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12 col-md-6">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-12 col-md-12 position-relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="form-control"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: 'pointer', zIndex: 2 }}
            onClick={() => setShowPassword(v => !v)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100 fw-bold mt-4">
        Sign Up
      </button>
      {message && <div className="mt-3 text-center text-danger">{message}</div>}
    </form>
  );
};

export default SignUp;