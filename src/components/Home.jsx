import React from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

function Home() {
  return (
    <div className="home-container" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100%",
      padding: "20px",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      color: "#fff",
    }}>
      <h1 style={{
        fontSize: "2.5rem",
        marginBottom: "20px",
        textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
      }}>
        Welcome to our Todo App! 🚀
      </h1>
      <p style={{
        fontSize: "1.2rem",
        marginBottom: "30px",
        lineHeight: "1.6",
        maxWidth: "600px",
      }}>
        Stay organized and boost your productivity by managing your tasks effortlessly.
      </p>
      <Link to="/login" style={{ textDecoration: "none", marginBottom: "15px", width: "100%", maxWidth: "300px" }}>
        <button style={{
          padding: "12px 20px",
          fontSize: "1rem",
          color: "#fff",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "0.3s",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}>
          <FaSignInAlt style={{ marginRight: "8px" }} /> Go to Login
        </button>
      </Link>
      <Link to="/signup" style={{ textDecoration: "none", width: "100%", maxWidth: "300px" }}>
        <button style={{
          padding: "12px 20px",
          fontSize: "1rem",
          color: "#fff",
          backgroundColor: "#28a745",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "0.3s",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#1e7e34"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}>
          Create Account
        </button>
      </Link>
    </div>
  );
}

export { Home };
