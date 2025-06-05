import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SignUp from './components/sign-up.jsx';
import SignIn from './components/sign-in.jsx';
import CreateSubscription from './components/createSubscription.jsx';
import ViewSubscription from './components/viewSubscription.jsx';
import './App.css';
import Footer from './components/Footer.jsx';

function MainPage({ handleSignIn, handleSignOut, isSignedIn, setShowSignUp, showSignUp }) {
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-3 px-md-5 min-vh-100 d-flex align-items-center justify-content-center">
      <div className="glass-card mx-auto">
        {!isSignedIn ? (
          <>
            <div className="mb-4 d-flex justify-content-center gap-2 flex-wrap">
              <button
                onClick={() => setShowSignUp(true)}
                disabled={showSignUp}
                className={`btn ${showSignUp ? 'btn-danger' : 'btn-outline-danger'}`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowSignUp(false)}
                disabled={!showSignUp}
                className={`btn ${!showSignUp ? 'btn-primary' : 'btn-outline-primary'}`}
              >
                Sign In
              </button>
            </div>
            <div className="mb-2">
              {showSignUp ? <SignUp /> : <SignIn onSignIn={handleSignIn} />}
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 text-secondary fw-bold m-0">Subscription Tracker</h2>
              <button
                onClick={handleSignOut}
                className="btn btn-danger btn-custom"
              >
                Sign Out
              </button>
            </div>
            <CreateSubscription />
            <button
              className="mt-4 w-100 btn btn-primary btn-custom"
              onClick={() => navigate('/subscriptions')}
            >
              View Subscriptions
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SubscriptionsPage({ handleSignOut }) {
  const navigate = useNavigate();

  const handleSignOutAndRedirect = () => {
    handleSignOut();
    navigate('/');
  };

  return (
    <div className="container-fluid px-3 px-md-5 min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="glass-card w-100 mx-auto" style={{ maxWidth: '800px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <button
            className="btn btn-secondary btn-custom fw-bold"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </button>
          <h2 className="h5 text-secondary fw-bold m-0 flex-grow-1 text-center">Your Subscriptions</h2>
          <button
            onClick={handleSignOutAndRedirect}
            className="btn btn-danger btn-custom fw-bold"
          >
            Sign Out
          </button>
        </div>
        <ViewSubscription />
      </div>
    </div>
  );
}

function App() {
  const [showSignUp, setShowSignUp] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(!!localStorage.getItem('token'));

  const handleSignIn = (token) => {
    localStorage.setItem('token', token);
    setIsSignedIn(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsSignedIn(false);
    setShowSignUp(true);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                handleSignIn={handleSignIn}
                handleSignOut={handleSignOut}
                isSignedIn={isSignedIn}
                showSignUp={showSignUp}
                setShowSignUp={setShowSignUp}
              />
            }
          />
          <Route
            path="/subscriptions"
            element={<SubscriptionsPage handleSignOut={handleSignOut} />}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;