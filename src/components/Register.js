import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repassword: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: null,
    gender: '',
    contact_number: '',
    address: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date_of_birth: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const formattedData = {
      ...formData,
      date_of_birth: formData.date_of_birth ? formData.date_of_birth.toISOString().split('T')[0] : null,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formattedData);
      
      if (response.status === 201) {
        setMessage(response.data.message || 'Registration successful.');
        setTimeout(() => {
          const { user_id: userId } = response.data; 
          navigate(`/VerifyOTP?userId=${userId}&email=${formattedData.email}`);
        }, 2000);
      } else {
        setMessage(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Create an Account</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
        <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" required />
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
        
        <DatePicker 
          selected={formData.date_of_birth} 
          onChange={handleDateChange} 
          dateFormat="yyyy-MM-dd" // Use a standard format
          placeholderText="Date of Birth"
          required
        />
        
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
        <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" required />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <input type="password" name="repassword" value={formData.repassword} onChange={handleChange} placeholder="Confirm Password" required />
        <button type="submit" className="register-btn">Register</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p className="login-message">
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </div>
  );
}

export default Register;
