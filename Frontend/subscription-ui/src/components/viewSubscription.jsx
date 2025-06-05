import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const ViewSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setSubscriptions(data.data || []);
        } else {
          setError(data.error || 'Failed to fetch subscriptions');
        }
      } catch (err) {
        setError('Network error');
      }
      setLoading(false);
    };
    fetchSubscriptions();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSubscriptions(prev => prev.filter(sub => sub._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete subscription');
      }
    } catch {
      alert('Network error');
    }
  };

  if (loading) return <div>Loading subscriptions...</div>;
  if (error) return <div>{error}</div>;
  if (!subscriptions.length) return <div>No subscriptions found.</div>;

  return (
    <div className="row g-3">
      {subscriptions.map(sub => (
        <div key={sub._id} className="col-12 col-sm-6 col-lg-4">
          <div className="glass-card h-100 p-3">
            <h5 className="fw-bold mb-2 text-truncate">{sub.name}</h5>
            <div className={`badge-status ${sub.status} mb-2`}>{sub.status}</div>
            <p className="mb-1"><strong>Price:</strong> {sub.price} {sub.currency}</p>
            <p className="mb-1"><strong>Frequency:</strong> {sub.frequency}</p>
            <p className="mb-1"><strong>Category:</strong> {sub.category}</p>
            <p className="mb-1"><strong>Payment:</strong> {sub.paymentMethod}</p>
            <p className="mb-1"><strong>Start:</strong> {sub.startDate?.slice(0,10)}</p>
            <button
              className="btn btn-danger btn-sm mt-2 btn-custom"
              onClick={() => handleDelete(sub._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewSubscription;