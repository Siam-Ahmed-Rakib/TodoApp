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
            const r = await fetch("http://3.109.211.104:8001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const j = await r.json();
            if (j["access_token"]) {
                localStorage.setItem("username", username);
                toast.success("Logged in");
                navigate("/dashboard");
            } else {
                toast.error(j["detail"]);
            }
        } catch (error) {
            toast.error("An error occurred during login."); 
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
            background: 'linear-gradient(135deg,rgb(178, 190, 244), #764ba2)', 
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
                <div style={{ fontSize: "2rem", textAlign: 'center', marginBottom: '20px', color: '#333' }}>Login</div>

                <TextField
                    label="Username"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Password"
                    type="password"
                    placeholder='Password'
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />

                <Button onClick={loginClick} variant="contained" size='large' fullWidth style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white' }}>
                    Login
                </Button>

                <div style={{ marginTop: '20px', textAlign: 'center', color: '#555' }}>
                    Do not have an account? <Link to="/signup" style={{ color: '#007bff' }}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export { Login };
