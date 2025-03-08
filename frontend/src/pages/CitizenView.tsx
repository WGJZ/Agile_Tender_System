import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
} from '@mui/material';
import { tenderAPI } from '../services/api';

interface Tender {
  id: number;
  title: string;
  description: string;
  budget: number;
  submission_deadline: string;
  status: string;
}

const CitizenView = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await tenderAPI.getAllTenders();
      setTenders(response.data);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
  };

  const filteredTenders = tenders.filter(
    (tender) =>
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Public Tender Listings
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Tenders"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTenders.map((tender) => (
              <TableRow key={tender.id}>
                <TableCell>{tender.title}</TableCell>
                <TableCell>{tender.description}</TableCell>
                <TableCell>${tender.budget}</TableCell>
                <TableCell>{new Date(tender.submission_deadline).toLocaleDateString()}</TableCell>
                <TableCell>{tender.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CitizenView; 