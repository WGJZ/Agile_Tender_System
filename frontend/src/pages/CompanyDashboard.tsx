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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { tenderAPI, bidAPI } from '../services/api';

interface Tender {
  id: number;
  title: string;
  description: string;
  budget: number;
  submission_deadline: string;
  status: string;
}

const CompanyDashboard = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [open, setOpen] = useState(false);
  const [bidData, setBidData] = useState({
    bid_amount: '',
    documents: null as File | null,
  });

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

  const handleSubmitBid = async () => {
    if (!selectedTender) return;

    const formData = new FormData();
    formData.append('tender', selectedTender.id.toString());
    formData.append('bid_amount', bidData.bid_amount);
    if (bidData.documents) {
      formData.append('documents', bidData.documents);
    }

    try {
      await bidAPI.submitBid(formData);
      setOpen(false);
      setBidData({ bid_amount: '', documents: null });
      alert('Bid submitted successfully!');
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Error submitting bid');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Company Dashboard
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenders.map((tender) => (
              <TableRow key={tender.id}>
                <TableCell>{tender.title}</TableCell>
                <TableCell>{tender.description}</TableCell>
                <TableCell>${tender.budget}</TableCell>
                <TableCell>{new Date(tender.submission_deadline).toLocaleDateString()}</TableCell>
                <TableCell>{tender.status}</TableCell>
                <TableCell>
                  {tender.status === 'OPEN' && (
                    <Button
                      color="primary"
                      size="small"
                      onClick={() => {
                        setSelectedTender(tender);
                        setOpen(true);
                      }}
                    >
                      Submit Bid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Submit Bid</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Bid Amount"
            margin="normal"
            type="number"
            value={bidData.bid_amount}
            onChange={(e) => setBidData({ ...bidData, bid_amount: e.target.value })}
          />
          <input
            type="file"
            onChange={(e) => setBidData({ ...bidData, documents: e.target.files?.[0] || null })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitBid} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompanyDashboard; 