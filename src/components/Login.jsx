import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");

    async function loginClick() {
        const body = {
            "username": username,
            "password": pass
        };
        try {
            const r = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const j = await r.json();

            if (r.status === 401) {
                toast.error("Incorrect username. Please try again.");
            } else if (r.status === 403) {
                toast.error("Incorrect password. Please try again.");
            } else if (j["access_token"]) {
                localStorage.setItem("username", username);
                toast.success("Logged in successfully!");
                navigate("/dashboard");
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        } catch (error) {
            toast.error("An error occurred during login. Please try again later.");
            console.error("Login error:", error);
        }
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}>
                <div style={{ fontSize: "2rem", textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>Login</div>

                <TextField
                    label="Username"
                    placeholder='Enter your username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Password"
                    type="password"
                    placeholder='Enter your password'
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />

                <Button onClick={loginClick} variant="contained" size='large' fullWidth style={{ marginTop: '20px', backgroundColor: '#5A67D8', color: 'white' }}>
                    Login
                </Button>

                <div style={{ marginTop: '20px', textAlign: 'center', color: '#555' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#5A67D8' }}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export { Login };
