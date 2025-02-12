import React, { useState } from 'react';
import { FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa';  

const ShareButton = ({ productUrl }) => {
  const [showOptions, setShowOptions] = useState(false);  
  const shareLink = productUrl || window.location.href;  

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=Check out this product!`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=Check out this product! ${encodeURIComponent(shareLink)}`;
  const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(shareLink)}`;

  const toggleShareOptions = (e) => {
    e.stopPropagation();  
    setShowOptions(!showOptions);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginLeft: '43px', marginTop: '-400px' }}>
      {/* Share Button */}
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#0073e6' }}
        onClick={toggleShareOptions}
      >
        <FaShareAlt />
      </button>

      {/* Share Options - Positioned Absolutely */}
      {showOptions && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '100%',  
            left: '-30%',  
            transform: 'translateX(-50%)',  
            padding: '0px', 
            display: 'flex',
            gap: '2px',
            zIndex: 10,
            marginTop:'-35px'
          }}
        >
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#1877f2' }}
            onClick={() => window.open(facebookShareUrl, '_blank')}
          >
            <FaFacebook />
          </button>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#1da1f2' }}
            onClick={() => window.open(twitterShareUrl, '_blank')}
          >
            <FaTwitter />
          </button>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#25d366' }}
            onClick={() => window.open(whatsappShareUrl, '_blank')}
          >
            <FaWhatsapp />
          </button>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#e4405f' }}
            onClick={() => window.open(instagramShareUrl, '_blank')}
          >
            <FaInstagram />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
