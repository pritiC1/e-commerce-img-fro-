import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VerifyOTP.css'; 

const VerifyOTP = () => {
    const [username, setUsername] = useState(''); // Username input
    const [otp, setOtp] = useState(''); // OTP input
    const [message, setMessage] = useState(''); // Message for success/error
    const [isVerified, setIsVerified] = useState(false); // Track if OTP is verified
    const [loading, setLoading] = useState(false); // Track loading state
    const navigate = useNavigate();

    // Handle OTP verification submission
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear any previous messages
        setLoading(true); // Start loader

        // Validate inputs
        if (!username || !otp) {
            setMessage('Username and OTP are required.');
            setLoading(false); // Stop loader if validation fails
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/VerifyOTP/', {
                username: username,
                otp_code: otp, // Correct field name here
            });

            if (response.status === 200) {
                // OTP verification successful
                setMessage(response.data.message); // Display success message from server
                setIsVerified(true); // Set OTP as verified
                // Optionally save username to localStorage or context
                localStorage.setItem('username', username); 
                setTimeout(() => {
                    navigate('/Login'); // Redirect to login page after success
                }, 2000); // Delay for 2 seconds before redirecting
            } else {
                // Handle non-200 responses
                setMessage(response.data.error || 'An error occurred. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                // Display server-side error messages
                setMessage(error.response.data.error || 'An error occurred. Please try again.');
            } else {
                setMessage('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loader
        }
    };

    return (
        <div className="verify-otp-container">
            <h2>Verify OTP</h2>
            <form onSubmit={handleVerifyOTP}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>OTP:</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Verify OTP</button>
            </form>
            {loading && <div className="spinner"></div>} {/* Spinner */}

            {message && <p className={`message ${isVerified ? 'success' : 'error'}`}>{message}</p>}
        </div>
    );
};

export default VerifyOTP;
