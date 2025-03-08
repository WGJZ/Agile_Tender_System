import React, { useState, useEffect } from 'react';
import {
  Box,
  styled,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

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

const StyledTableCell = styled(TableCell)({
  fontFamily: 'Outfit, sans-serif',
  fontSize: 'clamp(14px, 1.5vw, 16px)',
});

interface Tender {
  id: number;
  title: string;
  category: string;
  budget: string;
  deadline: string;
  status: string;
  bids: Bid[];
}

interface Bid {
  id: number;
  company_name: string;
  amount: string;
  proposal: string;
  status: string;
}

const SelectWinner = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/tenders/with-bids/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTenders(data);
      } else {
        setError('Failed to fetch tenders');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleSelectWinner = async (tenderId: number, bidId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/tenders/${tenderId}/select-winner/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bid_id: bidId }),
      });

      if (response.ok) {
        setOpenDialog(false);
        fetchTenders();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to select winner');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Typography variant="h4" sx={{ mb: 4, color: '#000', fontFamily: 'Outfit', fontWeight: 300 }}>
          Select Winner
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Budget</StyledTableCell>
                <StyledTableCell>Deadline</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenders.map((tender) => (
                <TableRow key={tender.id}>
                  <StyledTableCell>{tender.title}</StyledTableCell>
                  <StyledTableCell>{tender.category}</StyledTableCell>
                  <StyledTableCell>${tender.budget}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(tender.deadline).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell>{tender.status}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedTender(tender);
                        setOpenDialog(true);
                      }}
                      disabled={tender.status === 'COMPLETED'}
                      sx={{ fontFamily: 'Outfit' }}
                    >
                      View Bids
                    </Button>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Select Winner for {selectedTender?.title}</DialogTitle>
          <DialogContent>
            {selectedTender && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Company</StyledTableCell>
                      <StyledTableCell>Amount</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedTender.bids.map((bid) => (
                      <TableRow key={bid.id}>
                        <StyledTableCell>{bid.company_name}</StyledTableCell>
                        <StyledTableCell>${bid.amount}</StyledTableCell>
                        <StyledTableCell>{bid.status}</StyledTableCell>
                        <StyledTableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleSelectWinner(selectedTender.id, bid.id)}
                            disabled={selectedTender.status === 'COMPLETED'}
                            sx={{ fontFamily: 'Outfit' }}
                          >
                            Select as Winner
                          </Button>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </ContentWrapper>
    </PageContainer>
  );
};

export default SelectWinner; 