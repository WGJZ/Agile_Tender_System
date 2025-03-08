import React, { useState, useEffect } from 'react';
import {
  Box,
  styled,
  TextField,
  Button,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  description: string;
  budget: string;
  deadline: string;
  requirements: string;
  category: string;
}

const ModifyTender = () => {
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
      const response = await fetch('http://localhost:8000/api/tenders/', {
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

  const handleModify = async () => {
    if (!selectedTender) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/tenders/${selectedTender.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(selectedTender),
      });

      if (response.ok) {
        setOpenDialog(false);
        fetchTenders();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to modify tender');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Typography variant="h4" sx={{ mb: 4, color: '#000', fontFamily: 'Outfit', fontWeight: 300 }}>
          Modify Tenders
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
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedTender(tender);
                        setOpenDialog(true);
                      }}
                      sx={{ fontFamily: 'Outfit' }}
                    >
                      Modify
                    </Button>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Modify Tender</DialogTitle>
          <DialogContent>
            {selectedTender && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Title"
                  fullWidth
                  value={selectedTender.title}
                  onChange={(e) => setSelectedTender({ ...selectedTender, title: e.target.value })}
                />
                <TextField
                  label="Category"
                  fullWidth
                  value={selectedTender.category}
                  onChange={(e) => setSelectedTender({ ...selectedTender, category: e.target.value })}
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={selectedTender.description}
                  onChange={(e) => setSelectedTender({ ...selectedTender, description: e.target.value })}
                />
                <TextField
                  label="Budget"
                  fullWidth
                  type="number"
                  value={selectedTender.budget}
                  onChange={(e) => setSelectedTender({ ...selectedTender, budget: e.target.value })}
                />
                <TextField
                  label="Requirements"
                  fullWidth
                  multiline
                  rows={4}
                  value={selectedTender.requirements}
                  onChange={(e) => setSelectedTender({ ...selectedTender, requirements: e.target.value })}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleModify} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </ContentWrapper>
    </PageContainer>
  );
};

export default ModifyTender; 