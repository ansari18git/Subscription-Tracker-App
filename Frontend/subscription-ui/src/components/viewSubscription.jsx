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
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setSubscriptions(subscriptions.filter(sub => sub._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete subscription');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) return <div>Loading subscriptions...</div>;
  if (error) return <div>{error}</div>;
  if (!subscriptions.length) return <div>No subscriptions found.</div>;

  return (
    <div>
    
      <div className="row g-3">
        {subscriptions.map(sub => (
          <div className="col-12 col-md-6" key={sub._id || sub.id}>
            <div className="glass-card h-100 p-3">
              <h5 className="fw-bold mb-2">{sub.name}</h5>
              <div className="mb-1">
                <span className={`badge-status ${sub.status}`}>{sub.status}</span>
              </div>
              <div className="mb-1">
                <strong>Price:</strong> {sub.price} {sub.currency}
              </div>
              <div className="mb-1">
                <strong>Frequency:</strong> {sub.frequency}
              </div>
              <div className="mb-1">
                <strong>Category:</strong> {sub.category}
              </div>
              <div className="mb-1">
                <strong>Payment:</strong> {sub.paymentMethod}
              </div>
              <div className="mb-1">
                <strong>Start:</strong> {sub.startDate && sub.startDate.slice(0,10)}
              </div>
              <button
                className="btn btn-danger btn-sm mt-2 btn-custom"
                style={{ minWidth: 100, minHeight: 40 }}
                onClick={() => handleDelete(sub._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSubscription;