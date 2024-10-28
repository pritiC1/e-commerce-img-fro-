// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Register.css'; // Import the CSS file for styling

// const Register = () => {
//   const [firstName, setFirstName] = useState('');
//   const [middleName, setMiddleName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
//   const [dob, setDob] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setErrorMessage(''); // Clear previous error messages

//     try {
//       const response = await axios.post('http://localhost:8000/Profile/', {
//         username,
//         first_name: firstName,
//         middle_name: middleName,
//         last_name: lastName,
//         email,
//         contact_number: contactNumber,
//         dob,
//         password,
//       });

//       console.log('Registration successful:', response.data);
//       navigate('/verify-otp'); // Redirect to verify OTP page after successful registration
//     } catch (error) {
//       // Handle error and set error message
//       if (error.response && error.response.data) {
//         setErrorMessage(error.response.data.error || 'Registration failed. Please check your input.');
//       } else {
//         setErrorMessage('Registration failed. Please try again.');
//       }
//       console.error('Registration failed', error);
//     }
//   };

//   return (
//     <form onSubmit={handleRegister} className="register-form">
//       <h2>Register</h2>
//       <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
//       <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle Name" />
//       <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
//       <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
//       <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
//       <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="Contact Number" required />
//       <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
//       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
//       <button type="submit">Register</button>
//       {errorMessage && <div className="error-message">{errorMessage}</div>}
//     </form>
//   );
// };

// export default Register;
