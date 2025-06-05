import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const SignIn = ({ onSignIn }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch(`${API_BASE_URL}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      if (onSignIn) onSignIn(data.token);
      setMessage('Sign in successful!');
    } else {
      setMessage(data.error || 'Sign in failed');
    }
  };

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <h2 className="text-center mb-4 form-title">Sign In</h2>

      <div className="row g-3">
        <div className="col-12 col-md-12">
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
        Sign In
      </button>
      {message && <div className="mt-3 text-center text-danger">{message}</div>}
    </form>
  );
};

export default SignIn;