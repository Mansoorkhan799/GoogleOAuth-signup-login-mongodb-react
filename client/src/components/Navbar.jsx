import React from 'react';
import { AppBar, Typography, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Logout } from './Logout';

export const Navbar = () => {
    return (
        <AppBar sx={{ backgroundColor: "#ffff", padding: "0.5rem" }}>
            <Toolbar>
                {/* Navbar Title */}
                <Typography variant='h4' sx={{ flexGrow: 1, fontWeight: "bold",color: "#000" }}>
                    Auth Task
                </Typography>

                {/* Button Group for Login, Signup, Logout */}
                <Box sx={{ display: "flex", gap: "1rem" }}>
                    <Button 
                        color='success' 
                        variant="contained" 
                        to="/login" 
                        component={Link} 
                        sx={{
                            fontWeight: "bold",
                            backgroundColor: "#2E7D32",
                            '&:hover': { backgroundColor: "#1B5E20" }
                        }}
                    >
                        Login
                    </Button>
                    
                    <Button 
                        color='warning' 
                        variant="contained" 
                        to="/signup" 
                        component={Link} 
                        sx={{
                            fontWeight: "bold",
                            backgroundColor: "#F57C00",
                            '&:hover': { backgroundColor: "#E65100" }
                        }}
                    >
                        Signup
                    </Button>

                    {/* Logout Button */}
                    <Logout />
                </Box>
            </Toolbar>
        </AppBar>
    );
};