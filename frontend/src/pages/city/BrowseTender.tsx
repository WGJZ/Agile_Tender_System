import React, { useState, useEffect } from 'react';
import {
  Box,
  styled,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * BrowseTender Component
 * 
 * Displays a list of tenders with filtering and search capabilities
 * Features:
 * - Table view of all tenders
 * - Category-based filtering
 * - Search functionality
 * - Responsive design
 */

const PageContainer = styled('div')({
  width: '100%',
  minHeight: '100vh',
  background: 'linear-gradient(180deg, rgb(55.89, 202.64, 251.55) 0%, rgb(33.22, 120.47, 149.55) 100%)',
  display: 'flex',
  justifyContent: 'center',
  padding: '2vh 0',
});

const ContentWrapper = styled('div')({
  width: '90%',
  maxWidth: '1200px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '20px',
  padding: '2rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
});

const SearchContainer = styled(Box)({
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  alignItems: 'center',
});

interface Tender {
  tender_id: string;
  title: string;
  description: string;
  budget: string;
  notice_date: string;    // created_at from backend
  close_date: string;     // submission_deadline from backend
  winner_date: string;    // will be added later
  status: string;
  category: string;       // will be added later
  created_by: number;
}

const BrowseTender = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  /**
   * Fetches tender data from the backend
   */
  const fetchTenders = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching tenders with token:', token?.substring(0, 10) + '...');
      
      const response = await fetch('http://localhost:8000/api/tenders/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Raw API response:', JSON.stringify(data, null, 2));
        
        // Map the backend data to our frontend Tender interface
        if (Array.isArray(data)) {
          const mappedData = data.map(item => ({
            tender_id: item.id.toString(),
            title: item.title || '',
            description: item.description || '',
            budget: item.budget || '0',
            notice_date: item.notice_date || '',  // Use notice_date from backend
            close_date: item.submission_deadline || '',
            winner_date: '', // Will be added in future
            status: item.status || 'PENDING',
            category: item.category || 'General',
            created_by: item.created_by
          }));
          
          console.log('Mapped tender data:', mappedData);
          setTenders(mappedData);
          setFilteredTenders(mappedData);
          
          // Since category is not yet implemented in backend, we'll use some default categories
          const defaultCategories = ['General', 'Construction', 'Infrastructure', 'Services'];
          setCategories(defaultCategories);
          console.log('Available categories:', defaultCategories);
        } else {
          console.error('Received data is not an array:', data);
        }
      } else {
        const errorData = await response.json();
        console.error('API error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  /**
   * Filters tenders based on search term and selected category
   */
  useEffect(() => {
    let filtered = tenders;
    
    if (selectedCategory) {
      filtered = filtered.filter(tender => tender.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.tender_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTenders(filtered);
  }, [searchTerm, selectedCategory, tenders]);

  /**
   * Formats date string for display
   */
  const formatDate = (dateString: string) => {
    if (!dateString) {
      return '-';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('Invalid date string:', dateString);
        return '-';
      }
      
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '-';
    }
  };

  // Add debug logging for filtered tenders
  useEffect(() => {
    console.log('Current filtered tenders:', filteredTenders);
  }, [filteredTenders]);

  return (
    <PageContainer>
      <ContentWrapper>
        <Typography variant="h4" sx={{ mb: 4, color: '#000', fontFamily: 'Outfit', fontWeight: 300 }}>
          Browse Tenders ({filteredTenders.length})
        </Typography>

        <SearchContainer>
          <TextField
            placeholder="Search by title or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Filter by Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </SearchContainer>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tender ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Notice Date</TableCell>
                <TableCell>Close Date</TableCell>
                <TableCell>Winner Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTenders.map((tender) => (
                <TableRow key={tender.tender_id}>
                  <TableCell>{tender.tender_id}</TableCell>
                  <TableCell>{tender.title}</TableCell>
                  <TableCell>{formatDate(tender.notice_date)}</TableCell>
                  <TableCell>{formatDate(tender.close_date)}</TableCell>
                  <TableCell>{formatDate(tender.winner_date)}</TableCell>
                  <TableCell>{tender.status}</TableCell>
                  <TableCell>{tender.category}</TableCell>
                </TableRow>
              ))}
              {filteredTenders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tenders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default BrowseTender; 