import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthForm.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithCustomToken } from "firebase/auth";


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Authentication logic will go here
        try {
            // Get custom token from our backend
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) // Note: Password isn't used for validation here, just for the request
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Failed to log in');

            // Use the custom token to sign in on the client
            await signInWithCustomToken(auth, data.token);

            navigate('/map'); // Redirect to the map after login

        } catch (error) {
            alert(error.message);
        }
        console.log({ email, password });
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Log In to Sentinel</h2>
                <p>Access your account to contribute reviews.</p>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="auth-button">Log In</button>
                <div className="auth-switch">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;