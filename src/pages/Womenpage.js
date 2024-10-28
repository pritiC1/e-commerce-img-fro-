// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './WomenPage.css'; // Ensure this file contains styles for your page
// import logo from '../Assets/logo.png'; // Path to your logo image
// import profile from '../Assets/profile.jpg'; // Path to profile image
// import dress1 from '../Assets/logo.jpg'; // Path to category and product images
// import dress2 from '../Assets/logo.jpg'; // Add more images as needed

// const WomenPage = () => {
//   const categories = [
//     { img: logo, name: 'Category 1' },
//     { img: logo, name: 'Category 2' },
//     // Add more categories
//   ];

//   const products = [
//     { img: logo, name: 'Dress 1', price: '$100' },
//     { img: logo, name: 'Dress 2', price: '$120' },
//     // Add more products
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === categories.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 3000); // 3 seconds interval for auto-sliding
//     return () => clearInterval(interval);
//   }, [categories.length]);

//   return (
//     <div className="women-page">
//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <div className="nav-links">
//           <Link to="/men">Men</Link>
//           <Link to="/women">Women</Link>
//           <Link to="/kids">Kids</Link>
//         </div>
//         <div className="search-bar">
//           <input type="text" placeholder="Search..." />
//         </div>
//         <div className="auth-buttons">
//           <button className="login-button">Login</button>
//           <img src={profile} alt="Profile" className="profile-pic" />
//           <button className="cart-button">Cart</button>
//         </div>
//       </nav>

//       {/* Categories Section */}
//       <div className="categories-section">
//         <h2>Categories</h2>
//         <div className="categories-slider">
//           {categories.map((category, index) => (
//             <div
//               key={index}
//               className={`slider-item ${
//                 index === currentIndex ? 'active' : 'inactive'
//               }`}
//             >
//               <img src={category.img} alt={category.name} className="category-img" />
//               <p>{category.name}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Products Section */}
//       <div className="products-section">
//         <h3>Our Collection</h3>
//         <div className="products-grid">
//           {products.map((product, index) => (
//             <div key={index} className="product-card">
//               <img src={product.img} alt={product.name} className="product-img" />
//               <h4>{product.name}</h4>
//               <p>{product.price}</p>
//               <button className="like-button">❤️</button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WomenPage;
