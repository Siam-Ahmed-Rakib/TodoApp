import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
    }}>
      <h1 style={{
        fontSize: "36px",
        color: "#333",
        marginBottom: "20px",
      }}>
        Welcome to our Todo App! 🚀
      </h1>
      <p style={{
        fontSize: "18px",
        color: "#555",
        marginBottom: "30px",
        textAlign: "center",
      }}>
        Stay organized and boost your productivity by managing your tasks effortlessly.
      </p>
      <Link to="/login" style={{
        textDecoration: "none",
      }}>
        <button style={{
          padding: "10px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}>
          Go to Login
        </button>
      </Link>
    </div>
  );
}

export { Home };
