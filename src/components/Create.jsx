import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';

function Create() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");
    const [cpass, setCpass] = useState("");

    async function handleClick() {
        if (pass !== cpass) {
            toast.error("Passwords do not match");
            return;
        }
        const body = {
            "name": name,
            "email": email,
            "phone": phone,
            "username": username,
            "password": pass,
            "profile_picture": ""
        };
        try {
            const response = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                setName("");
                setEmail("");
                setPass("");
                setPhone("");
                setCpass("");
                setUsername("");
                navigate("/login");
            } else {
                toast.error(data.message || "An error occurred during registration.");
            }
        } catch (error) {
            toast.error("A network error occurred.");
            console.error("Registration error:", error);
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
            background: 'linear-gradient(135deg,rgb(109, 115, 139), #764ba2)',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ fontSize: "2rem", textAlign: 'center', marginBottom: '20px', color: '#333' }}>Create an Account</div>

                <TextField label="Name" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" variant="outlined" />
                <TextField label="Email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" variant="outlined" />
                <TextField label="Phone" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth margin="normal" variant="outlined" />
                <TextField label="Username" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" variant="outlined" />
                <TextField label="Password" type="password" placeholder='Password' value={pass} onChange={(e) => setPass(e.target.value)} fullWidth margin="normal" variant="outlined" />
                <TextField label="Confirm Password" type="password" placeholder='Confirm Password' value={cpass} onChange={(e) => setCpass(e.target.value)} fullWidth margin="normal" variant="outlined" />

                <Button variant="contained" size='large' fullWidth onClick={handleClick} style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white' }}>Create Account</Button>
                <div style={{ marginTop: '20px', textAlign: 'center', color: '#555' }}>
                    Already have an account? <Link to="/login" style={{ color: '#007bff' }}>Login</Link>
                </div>
            </div>
        </div>
    );
}

export { Create };
