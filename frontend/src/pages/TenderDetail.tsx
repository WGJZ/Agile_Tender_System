import React, { useState, useEffect } from 'react';
import {
  Box,
  styled,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import api from '../services/api';
import { API_BASE_URL } from '../api/config';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import DownloadIcon from '@mui/icons-material/Download';

const PageContainer = styled('div')({
  width: '100%',
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #37CAFB 0%, #217895 100%)',
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

const TopSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '2rem',
});

const HeaderSection = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
});

const ImageContainer = styled('div')({
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  overflow: 'hidden',
  marginBottom: '1rem',
});

const TenderInfoCard = styled(Paper)({
  padding: '1.5rem',
  marginBottom: '2rem',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
});

interface Tender {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  requirements: string;
  notice_date: string;
  submission_deadline: string;
  status: 'OPEN' | 'CLOSED' | 'AWARDED';
}

interface Bid {
  id: string;
  company_name: string;
  bidding_price: number;
  documents: string;
  submission_date: string;
  status: string;
  is_winner?: boolean;
}

const TenderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { tenderId } = useParams<{ tenderId: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'city' | 'company' | 'public'>('public');
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState('');
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectWinnerDialogOpen, setSelectWinnerDialogOpen] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Determine user type from URL or token
    const path = window.location.pathname;
    if (path.includes('/city/')) {
      setUserType('city');
    } else if (path.includes('/company/')) {
      setUserType('company');
    } else {
      setUserType('public');
    }

    // Determine user role from localStorage
    setUserRole(localStorage.getItem('userRole'));

    fetchTenderAndBids();
  }, [tenderId]);

  const fetchTenderAndBids = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Ensure tenderId is a string for API calls
      const tenderIdString = tenderId || '';
      
      // Determine if we should use public or private endpoint
      const isPublic = !token;
      const tenderData = await api.tenders.getById(tenderIdString, isPublic);
      setTender(tenderData);

      // Only fetch bids if user is authenticated
      if (token) {
        const bidsData = await api.tenders.getBids(tenderIdString);
        setBids(bidsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load tender details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = () => {
    navigate(`/company/submit-bid/${tenderId}`);
  };

  const handleGoBack = () => {
    if (userType === 'city') {
      navigate('/city');
    } else if (userType === 'company') {
      navigate('/company/browse-tenders');
    } else {
      navigate('/public/tenders');
    }
  };

  const handleViewDocument = (documentUrl: string) => {
    setDocumentPreviewUrl(documentUrl);
    setDocumentPreviewOpen(true);
  };

  const isDeadlinePassed = (deadline: string): boolean => {
    return new Date(deadline) < new Date();
  };

  const handleSelectWinner = (bidId: string) => {
    setSelectedBidId(bidId);
    setSelectWinnerDialogOpen(true);
  };

  const confirmSelectWinner = async () => {
    if (!selectedBidId) return;
    
    try {
      setSubmitting(true);
      await api.bids.selectWinner(selectedBidId);
      
      // Refresh data after selection
      await fetchTenderAndBids();
      setShowWinnerModal(false);
      setSuccessMessage('Winner selected successfully!');
    } catch (error) {
      console.error('Error selecting winner:', error);
      setError('Failed to select winner. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <TopSection>
          <ImageContainer>
            <img
              src="/icon1.png"
              alt="Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </ImageContainer>
          <Typography variant="h4" sx={{ color: '#217895', fontFamily: 'Outfit', fontWeight: 300 }}>
            Tender Details
          </Typography>
        </TopSection>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <HeaderSection>
          <Button 
            variant="outlined" 
            onClick={handleGoBack}
          >
            Back
          </Button>
          
          {userType === 'company' && tender?.status === 'OPEN' && !isDeadlinePassed(tender.submission_deadline) && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSubmitBid}
            >
              Submit Bid
            </Button>
          )}
        </HeaderSection>

        {tender && (
          <TenderInfoCard>
            <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Outfit', fontWeight: 400 }}>
              {tender.title}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Budget</Typography>
                <Typography variant="body1">€{tender.budget}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                <Typography variant="body1">{tender.category}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Chip 
                  label={tender.status} 
                  color={
                    tender.status === 'OPEN' ? 'success' : 
                    tender.status === 'AWARDED' ? 'primary' : 'default'
                  }
                  size="small" 
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Notice Date</Typography>
                <Typography variant="body1">{formatDate(tender.notice_date)}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Submission Deadline</Typography>
                <Typography variant="body1">
                  {formatDate(tender.submission_deadline)}
                  {isDeadlinePassed(tender.submission_deadline) && (
                    <Chip 
                      size="small" 
                      label="Passed" 
                      color="default" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">Description</Typography>
              <Typography variant="body1" paragraph>{tender.description}</Typography>
            </Box>
            
            {tender.requirements && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary">Requirements</Typography>
                <Typography variant="body1">{tender.requirements}</Typography>
              </Box>
            )}
          </TenderInfoCard>
        )}

        {/* Only show bids if user is authenticated and there are bids to show */}
        {userType !== 'public' && bids.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">
              Submitted Bids ({bids.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Bid Amount (EUR)</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Status</TableCell>
                    {userRole === 'CITY' && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>{bid.company_name}</TableCell>
                      <TableCell>€{bid.bidding_price}</TableCell>
                      <TableCell>{formatDate(bid.submission_date)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={bid.status}
                          color={
                            bid.status === 'ACCEPTED' ? 'success' :
                            bid.status === 'REJECTED' ? 'error' :
                            'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      {userRole === 'CITY' && (
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {bid.documents && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DescriptionIcon />}
                                onClick={() => handleViewDocument(bid.documents)}
                              >
                                Document
                              </Button>
                            )}
                            {userRole === 'CITY' && tender?.status === 'OPEN' && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleSelectWinner(bid.id)}
                              >
                                Select as Winner
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {userType === 'public' && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Interested in bidding?</Typography>
            <Typography paragraph>
              You need to be registered and logged in as a company to submit bids.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/auth/company')}
            >
              Log in as Company
            </Button>
          </Box>
        )}
      </ContentWrapper>

      {/* Document Preview Dialog */}
      <Dialog
        open={documentPreviewOpen}
        onClose={() => setDocumentPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Document Preview</DialogTitle>
        <DialogContent>
          {documentPreviewUrl ? (
            documentPreviewUrl.endsWith('.pdf') ? (
              <Box sx={{ position: 'relative', height: '70vh', width: '100%', overflow: 'hidden', borderRadius: 1 }}>
                <IconButton 
                  onClick={() => setIsFullscreen(true)}
                  sx={{ position: 'absolute', top: 5, right: 5, zIndex: 100, bgcolor: 'rgba(255,255,255,0.7)' }}
                >
                  <FullscreenIcon />
                </IconButton>
                <iframe 
                  src={`${API_BASE_URL}${documentPreviewUrl}`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Document Preview"
                />
              </Box>
            ) : (
              <Box sx={{ position: 'relative', height: '70vh', width: '100%', overflow: 'hidden', borderRadius: 1 }}>
                <IconButton 
                  onClick={() => setIsFullscreen(true)}
                  sx={{ position: 'absolute', top: 5, right: 5, zIndex: 100, bgcolor: 'rgba(255,255,255,0.7)' }}
                >
                  <FullscreenIcon />
                </IconButton>
                <img 
                  src={`${API_BASE_URL}${documentPreviewUrl}`}
                  alt="Document Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )
          ) : (
            <Typography>No document available for preview.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentPreviewOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary"
            href={documentPreviewUrl ? `${API_BASE_URL}${documentPreviewUrl}` : '#'}
            target="_blank"
            disabled={!documentPreviewUrl}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* 全屏文档预览 */}
      {isFullscreen && documentPreviewUrl && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          bgcolor: 'rgba(0,0,0,0.9)', 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <IconButton 
            onClick={() => setIsFullscreen(false)}
            sx={{ position: 'absolute', top: 10, right: 10, color: 'white', zIndex: 10000 }}
          >
            <CloseIcon />
          </IconButton>
          {documentPreviewUrl.endsWith('.pdf') ? (
            <iframe 
              src={`${API_BASE_URL}${documentPreviewUrl}`}
              style={{ width: '90%', height: '90%', border: 'none', marginTop: '50px' }}
              title="Fullscreen Document Preview"
            />
          ) : (
            <img 
              src={`${API_BASE_URL}${documentPreviewUrl}`}
              alt="Fullscreen Document Preview"
              style={{ maxWidth: '90%', maxHeight: '90%', marginTop: '50px', objectFit: 'contain' }}
            />
          )}
        </Box>
      )}

      {/* 添加选择中标者的确认对话框 */}
      <Dialog
        open={selectWinnerDialogOpen}
        onClose={() => setSelectWinnerDialogOpen(false)}
      >
        <DialogTitle>Confirm Selection</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to select this bid as the winner? This action will close the tender and notify all bidders.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectWinnerDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={confirmSelectWinner}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* 添加成功消息显示 */}
      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mt: 2, mb: 2 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}
    </PageContainer>
  );
};

export default TenderDetail; 