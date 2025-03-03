import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Home } from './components/Home';
import { Navbar } from './components/Navbar';
import { Box } from '@mui/material';

function App() {
    return (
        <GoogleOAuthProvider clientId="26741230842-bapau7n0tqcucli8iuudgjfla5c9lvlo.apps.googleusercontent.com"> {/* ✅ Ensure the correct Client ID */}
            <BrowserRouter>
                <Navbar />
                <Box
                    sx={{
                        minHeight: "100vh",
                        width: "100vw",
                        background: "linear-gradient(to right, #84fab0, #8fd3f4)",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        zIndex: -1,
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100vh",
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Navigate to="/signup" />} /> {/* ✅ Redirects to Signup Page */}
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </Box>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;