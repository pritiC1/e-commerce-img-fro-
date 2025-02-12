import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const [products, setProducts] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(''); // Ensure this is declared only once
  const [invoicePdf, setInvoicePdf] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state || !location.state.product_ids) {
      toast.error('No products found in the cart!');
      return;
    }
    const { product_ids } = location.state;
    fetchProducts(product_ids);
  }, [location]);

  const fetchProducts = async (productIds) => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/', {
        params: { ids: productIds.join(',') },
      });
      setProducts(response.data);
    } catch (err) {
      toast.error('Failed to fetch product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async () => {
    if (!isShippingDetailsValid()) {
      toast.error('Please fill out all shipping details.');
      return;
    }

    const productIds = products.map((product) => product.id);
    if (productIds.length === 0) {
      toast.error('No products to order');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/checkout/',
        {
          product_ids: productIds,
          shipping_details: shippingDetails,
          payment_method: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      toast.success('Order placed successfully!');

      if (paymentMethod === 'cash_on_delivery') {
        setInvoicePdf(response.data.invoice_pdf); // Assuming this is the filename or URL
      } else {
        navigate('/payment');
      }
    } catch (err) {
      toast.error('Failed to place order.');
    }
  };



  const isShippingDetailsValid = () => {
    return (
      shippingDetails.address.trim() &&
      shippingDetails.phone.trim() &&
      shippingDetails.email.trim()
    );
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSendInvoiceEmail = async () => {
    try {
     await axios.post(
        'http://localhost:8000/api/send_invoice_email/', // API endpoint to send email
        {
          email: shippingDetails.email, // Use the email from the shipping details
          invoice_pdf: invoicePdf, // Pass the invoice PDF path or URL
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      toast.success('Invoice sent to your email!');
    } catch (err) {
      toast.error('Failed to send invoice. Please try again later.');
    }
  };

  return (
    <div className="checkout-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Checkout</h2>
          <div>
            <h3>Products</h3>
            <div className="product-list">
              {products.map((product) => (
                <div key={product.id} className="product-item">
                  <p>{product.name}</p>
                  <p>₹{product.price}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Shipping Details</h3>
            <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              value={shippingDetails.name}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, name: e.target.value })
              }
            />
          </div>

            <div className="input-group">
              <label htmlFor="address">Shipping Address</label>
              <input
                type="text"
                id="address"
                placeholder="Street Address, City, State, Zip"
                value={shippingDetails.address}
                onChange={(e) =>
                  setShippingDetails({ ...shippingDetails, address: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                placeholder="Phone Number"
                value={shippingDetails.phone}
                onChange={(e) =>
                  setShippingDetails({ ...shippingDetails, phone: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                value={shippingDetails.email}
                onChange={(e) =>
                  setShippingDetails({ ...shippingDetails, email: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <h3>Payment Method</h3>
            <div className="payment-method">
              <label>
                <input
                  type="radio"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={handlePaymentMethodChange}
                />
                Cash on Delivery
              </label>
              <label>
                <input
                  type="radio"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={handlePaymentMethodChange}
                />
                Credit/Debit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                />
                PayPal
              </label>
            </div>
          </div>
          <button onClick={handleOrderSubmit}>Place Order</button>

          {/* Display PDF Download Link and Email Option for Cash on Delivery */}
          {paymentMethod === 'cash_on_delivery' && invoicePdf && (
            <div>
              <h4>Order Placed Successfully!</h4>
              <div>
                {/* Button to download the PDF */}
                <a href={`/media/invoices/${invoicePdf}`} download>
                  <button>Download Invoice PDF</button>
                </a>
                <br />
                {/* Button to send the PDF via email */}
                <button onClick={handleSendInvoiceEmail}>Send Invoice via Email</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;