import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showMessage, setShowMessage] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const navigate = useNavigate();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const showPopup = (message) => {
    setShowMessage(message);
    setTimeout(() => setShowMessage(""), 1500);
  };

  const handleShorten = (e) => {
    e.preventDefault();

    if (!urlInput.trim()) {
      showPopup("⚠️ Please enter a URL!");
      return;
    }

    showPopup("🔐 Please login first!");
    setTimeout(() => navigate("/auth"), 1500);
  };

  return (
    <>
      <style>
        {`
          .landing-page {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #001f4d;
            text-align: center;
            flex-direction: column;
            padding: 40px 20px;
          }

          .landing-content {
            font-size: 4.5rem;
            font-weight: 700;
            color: white;
            font-family: "Poppins", "Segoe UI", Arial, sans-serif;
            line-height: 1.2;
            text-shadow: 0 0 15px #00f7ff, 0 0 30px #00f7ff;
            margin-bottom: 40px;
          }

          .url-form {
            width: 100%;
            max-width: 700px;
            display: flex;
            justify-content: center;
            margin-bottom: 50px;
          }

          .url-input {
            flex: 1;
            padding: 15px 20px;
            font-size: 1.2rem;
            border: none;
            border-radius: 8px 0 0 8px;
            outline: none;
          }

          .url-submit {
            background-color: #ffcc00;
            color: #001f4d;
            font-size: 1.2rem;
            font-weight: 600;
            border: none;
            padding: 15px 30px;
            border-radius: 0 8px 8px 0;
            cursor: pointer;
            transition: 0.3s;
          }

          .url-submit:hover {
            background-color: #ffc107;
          }

          .banner-container {
            width: 100%;
            display: flex;
            justify-content: center;
            background-color: #001f4d;
            padding: 40px 0;
          }

          .banner-img {
            width: 80%;
            max-width: 1200px;
            height: auto;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.4);
          }

          .accordion-section {
            background: #f4f4f4;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .accordion-container {
            width: 80%;
            max-width: 800px;
          }

          .accordion-item {
            background: white;
            margin-bottom: 10px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          }

          .accordion-title {
            padding: 15px 20px;
            font-size: 1.2rem;
            font-weight: 600;
            background: #001f4d;
            color: white;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .accordion-content {
            padding: 15px 20px;
            font-size: 1rem;
            color: #333;
            background: #fff;
          }

          /* Neon Popup */
          .popup-message {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffcc00;
            color: #001f4d;
            padding: 15px 30px;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 8px;
            box-shadow: 0 0 15px #ffcc00, 0 0 30px #ffcc00;
            z-index: 1000;
            animation: fadeInOut 1.5s ease forwards;
          }

          @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -30px); }
            20% { opacity: 1; transform: translate(-50%, 0); }
            80% { opacity: 1; }
            100% { opacity: 0; transform: translate(-50%, -30px); }
          }
        `}
      </style>

      {/* Landing Page */}
      <div className="landing-page">
        <div className="landing-content">
          The only URL Shortener <br /> you will ever need!
        </div>

        {/* URL Shortener Form */}
        <form className="url-form" onSubmit={handleShorten}>
          <input
            type="text"
            className="url-input"
            placeholder="Enter your long URL here..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button type="submit" className="url-submit">Shorten</button>
        </form>
      </div>

      {/* Banner Image */}
      <div className="banner-container">
        <img src="/banner1.jpg" alt="Banner" className="banner-img" />
      </div>

      {/* Accordion Section */}
      <div className="accordion-section">
        <div className="accordion-container">
          {[
            { title: "What is Trimmr?", content: "Trimmr is a fast and secure URL shortener that makes your links easier to share." },
            { title: "Is it free to use?", content: "Yes! Trimmr is free to use with no hidden charges. Premium analytics coming soon." },
            { title: "Do my links expire?", content: "Your links never expire. You can use them forever." }
          ].map((item, index) => (
            <div key={index} className="accordion-item">
              <div
                className="accordion-title"
                onClick={() => toggleAccordion(index)}
              >
                {item.title}
                <span>{activeIndex === index ? "−" : "+"}</span>
              </div>
              {activeIndex === index && (
                <div className="accordion-content">{item.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Neon Popup */}
      {showMessage && <div className="popup-message">{showMessage}</div>}
    </>
  );
}
