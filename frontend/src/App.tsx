import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginForm from './pages/LoginForm';
import CityDashboard from './pages/CityDashboard';
import NewTender from './pages/city/NewTender';
import ModifyTender from './pages/city/ModifyTender';
import BrowseTender from './pages/city/BrowseTender';
import SelectWinner from './pages/city/SelectWinner';
import CompanyDashboard from './pages/CompanyDashboard';
import CitizenView from './pages/CitizenView';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/:userType" element={<Login />} />
            <Route path="/auth/:userType" element={<LoginForm />} />
            <Route path="/city" element={<CityDashboard />} />
            <Route path="/city/new-tender" element={<NewTender />} />
            <Route path="/city/modify-tender" element={<ModifyTender />} />
            <Route path="/city/browse-tender" element={<BrowseTender />} />
            <Route path="/city/select-winner" element={<SelectWinner />} />
            <Route path="/company/*" element={<CompanyDashboard />} />
            <Route path="/citizen" element={<CitizenView />} />
            <Route path="/browse-tenders" element={<CitizenView />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
