import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import './Paymentpage.css';

const PaymentPage = () => {
  const { productId } = useParams();
  const { userData, cartItems, totalAmount } = useLocation().state;
  const navigate = useNavigate();
  
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [orderStages, setOrderStages] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/delivery/${productId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDeliveryInfo(response.data);

        const currentTime = new Date();
        const stages = {};

        // Stage 1: Order Placed (current time)
        stages["Order Placed"] = currentTime.toLocaleString();

        // Stage 2: Order in Progress (12 hours after Order Placed)
        const orderInProgressTime = new Date(currentTime);
        orderInProgressTime.setHours(orderInProgressTime.getHours() + 12);
        stages["Order in Progress"] = orderInProgressTime.toLocaleString();

        // Stage 3: Order at Shop (12 hours after Order in Progress)
        const orderAtShopTime = new Date(orderInProgressTime);
        orderAtShopTime.setHours(orderAtShopTime.getHours() + 12);
        stages["Order at Shop"] = orderAtShopTime.toLocaleString();

        // Stage 4: Order Delivered (12 hours after Order at Shop)
        const orderDeliveredTime = new Date(orderAtShopTime);
        orderDeliveredTime.setHours(orderDeliveredTime.getHours() + 12);
        stages["Order Delivered"] = orderDeliveredTime.toLocaleString();

        setOrderStages(stages);

        const countdownEndTime = new Date(orderInProgressTime).getTime();
        const updateCountdown = () => {
          const now = new Date().getTime();
          const distance = countdownEndTime - now;

          if (distance > 0) {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setCountdown(`${hours}h ${minutes}m ${seconds}s`);
          } else {
            setCountdown('Time completed!');
          }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
      } catch (error) {
        setError('Failed to fetch delivery details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryInfo();
  }, [productId]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Delivery Information', 10, 10);
    doc.setFontSize(12);
    doc.text(`Product: ${deliveryInfo.productName}`, 10, 20);

    if (orderStages) {
      let yPosition = 30;
      for (const [stage, time] of Object.entries(orderStages)) {
        doc.text(`${stage}: ${time}`, 10, yPosition);
        yPosition += 10;
      }
    }

    doc.save(`${deliveryInfo.productName}-delivery-info.pdf`);
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('/api/place_order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData,
          cartItems,
          totalAmount,
        }),
      });
      const result = await response.json();

      if (result.success) {
        alert('Order placed successfully!');
        navigate('/account');
      } else {
        alert('Error placing order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (loading) {
    return <div>Loading delivery details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Payment Page</h1>
      
      <h2>User Info</h2>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Phone: {userData.phone}</p>
      <p>Address: {userData.address}</p>

      <h2>Cart Details</h2>
      {cartItems && cartItems.map((item) => (
        <div key={item.id}>
          <p>{item.name} - ${item.price} x {item.quantity}</p>
        </div>
      ))}
      <h3>Total: ${totalAmount}</h3>

      <h2>Delivery Information</h2>
      <p><strong>Product:</strong> {deliveryInfo.productName}</p>
      
      {orderStages ? (
        <div className="order-timeline">
          <div className="stage">
            <div className={`circle ${new Date() >= new Date(orderStages["Order Placed"]) ? "" : "pending"}`}>
              Order Placed
            </div>
          </div>
          <div className={`line ${new Date() >= new Date(orderStages["Order in Progress"]) ? "active" : ""}`}></div>
          <div className="stage">
            <div className={`circle ${new Date() >= new Date(orderStages["Order in Progress"]) ? "" : "pending"}`}>
              In Progress
            </div>
          </div>
          <div className={`line ${new Date() >= new Date(orderStages["Order at Shop"]) ? "active" : ""}`}></div>
          <div className="stage">
            <div className={`circle ${new Date() >= new Date(orderStages["Order at Shop"]) ? "" : "pending"}`}>
              At Shop
            </div>
          </div>
          <div className={`line ${new Date() >= new Date(orderStages["Order Delivered"]) ? "active" : ""}`}></div>
          <div className="stage">
            <div className={`circle ${new Date() >= new Date(orderStages["Order Delivered"]) ? "" : "pending"}`}>
              Delivered
            </div>
          </div>
        </div>
      ) : (
        <p>Processing order stages...</p>
      )}

      <p>{countdown}</p>

      <button onClick={downloadPDF} className="download-btn">
        Download Delivery Info PDF
      </button>

      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default PaymentPage;
