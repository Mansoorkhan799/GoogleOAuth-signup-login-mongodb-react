import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signup');
    };

    return (
        <Button 
            color='error' 
            variant="contained" 
            onClick={handleLogout}
            sx={{
                fontWeight: "bold",
                backgroundColor: "#D32F2F",
                '&:hover': { backgroundColor: "#B71C1C" }
            }}
        >
            Logout
        </Button>
    );
};