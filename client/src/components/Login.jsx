import React, { useState } from 'react';
import { Box, Paper, TextField, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/login", { email, password }, { withCredentials: true })
            .then(() => navigate('/home'))
            .catch(err => alert(err.response?.data?.error || "Login failed"));
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx={{ padding: "2rem", borderRadius: "1rem", textAlign: "center" }}>
                <Typography variant="h4">Login</Typography>
                <form onSubmit={handleLogin}>
                    <TextField fullWidth label="Email" onChange={e => setEmail(e.target.value)} required sx={{ mt: 2 }} />
                    <TextField fullWidth label="Password" type='password' onChange={e => setPassword(e.target.value)} required sx={{ mt: 2 }} />
                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
                </form>
                <Typography sx={{ mt: 2 }}></Typography>
                <GoogleLogin onSuccess={() => window.location.href = "http://localhost:3001/auth/google"} />
            </Paper>
        </Box>
    );
};
