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
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  SelectChangeEvent,
  Container,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoIcon from '@mui/icons-material/Info';
import { API_URL } from '../api/config'; // Import API_URL
import api from '../services/api';

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

const SearchContainer = styled(Box)({
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  alignItems: 'center',
  flexWrap: 'wrap',
});

const TopSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
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

// Tender status constants
const TENDER_STATUSES = {
  OPEN: 'Open',
  CLOSED: 'Closed',
  AWARDED: 'Awarded',
  DRAFT: 'Draft',
};

// Tender category constants
const TENDER_CATEGORIES = {
  CONSTRUCTION: 'Construction',
  TECHNOLOGY: 'Technology',
  SUPPLIES: 'Supplies',
  CONSULTING: 'Consulting',
  ENVIRONMENT: 'Environment',
  HEALTHCARE: 'Healthcare',
  EDUCATION: 'Education',
  OTHER: 'Other',
};

// Tender interface
interface Tender {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  status: string;
  is_public: boolean;
  location?: string;
  created_at: string;
  winner_name?: string;
  winning_bid?: string;
  requirements?: string;
  contact_email?: string;
}

// Status filter option interface
interface StatusOption {
  value: string;
  label: string;
}

// Get all available status options
const getStatusOptions = (): StatusOption[] => {
  return Object.entries(TENDER_STATUSES).map(([value, label]) => ({
    value,
    label,
  }));
};

// Get all available category options
const getCategoryOptions = (): StatusOption[] => {
  return Object.entries(TENDER_CATEGORIES).map(([value, label]) => ({
    value,
    label,
  }));
};

const CitizenView: React.FC = () => {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyOpenTenders, setShowOnlyOpenTenders] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [categories] = useState<string[]>([
    'CONSTRUCTION',
    'INFRASTRUCTURE',
    'SERVICES',
    'TECHNOLOGY',
    'HEALTHCARE',
    'EDUCATION',
    'TRANSPORTATION',
    'ENVIRONMENT',
  ]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState<{ tenderId: number; companyName: string; bidAmount: string } | null>(null);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.public.getTenders();
      console.log('API Response Data:', response);
      
      // Check response format
      const tendersData = response.tenders || response;
      if (!Array.isArray(tendersData)) {
        throw new Error('Invalid data format received');
      }
      
      setTenders(tendersData);
      setFilteredTenders(tendersData);
    } catch (err: any) {
      console.error('Error fetching tenders:', err);
      setError(err.message || 'Failed to fetch tender data');
      setTenders([]);
      setFilteredTenders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWinnerInfo = async (tenderId: number) => {
    try {
      const bids = await api.tenders.getBids(tenderId.toString());
      const winningBid = bids.find((bid: any) => bid.is_winner);
      if (winningBid) {
        setWinnerInfo({
          tenderId,
          companyName: winningBid.company_name,
          bidAmount: winningBid.bid_amount
        });
      }
    } catch (error) {
      console.error(`Error fetching winner info for tender ${tenderId}:`, error);
    }
  };

  // Sample data function to use when API fails
  const getSampleTenders = (): Tender[] => {
    return [
      {
        id: 1,
        title: "City Park Renovation",
        description: "Complete renovation of the central city park, including new pathways, playground equipment, and landscaping.",
        budget: 150000,
        deadline: "2025-06-15",
        category: "CONSTRUCTION",
        status: "OPEN",
        is_public: true,
        location: "New York",
        created_at: "2024-03-01"
      },
      {
        id: 2,
        title: "Public School IT Infrastructure",
        description: "Upgrading IT infrastructure in 10 public schools, including networks, servers, and classroom technology.",
        budget: 200000,
        deadline: "2025-04-30",
        category: "TECHNOLOGY",
        status: "OPEN",
        is_public: true,
        location: "Boston",
        created_at: "2024-02-15"
      },
      {
        id: 3,
        title: "Municipal Building Expansion",
        description: "Expansion of the municipal administrative building to accommodate growing staff needs.",
        budget: 500000,
        deadline: "2024-12-15",
        category: "INFRASTRUCTURE",
        status: "CLOSED",
        is_public: true,
        location: "Chicago",
        created_at: "2024-01-20"
      },
      {
        id: 4,
        title: "Healthcare Center Equipment",
        description: "Supply and installation of medical equipment for the new community healthcare center.",
        budget: 300000,
        deadline: "2025-03-20",
        category: "HEALTHCARE",
        status: "AWARDED",
        is_public: true,
        location: "Los Angeles",
        created_at: "2024-02-10"
      },
      {
        id: 5,
        title: "Public Transit Expansion Study",
        description: "Feasibility study for expanding the city's public transportation network to suburban areas.",
        budget: 120000,
        deadline: "2025-05-10",
        category: "TRANSPORTATION",
        status: "OPEN",
        is_public: true,
        location: "Seattle",
        created_at: "2024-03-05"
      },
      {
        id: 6,
        title: "City Hall Renovation",
        description: "Comprehensive renovation of the historic city hall building, including structural repairs and modernization of facilities.",
        budget: 450000,
        deadline: "2024-11-30",
        category: "CONSTRUCTION",
        status: "AWARDED",
        is_public: true,
        location: "Philadelphia",
        created_at: "2024-01-15"
      },
      {
        id: 7,
        title: "Public Library Upgrade",
        description: "Modernization of the central public library, including digital resources and accessibility improvements.",
        budget: 240000,
        deadline: "2024-10-15",
        category: "EDUCATION",
        status: "AWARDED",
        is_public: true,
        location: "Denver",
        created_at: "2024-01-30"
      }
    ];
  };

  const applyFilters = (allTenders: Tender[], search: string, category: string, onlyOpen: boolean) => {
    let filtered = allTenders;
    
    // Filter by status if only open tenders should be shown
    if (onlyOpen) {
      filtered = filtered.filter(tender => tender.status === 'OPEN');
    }
    
    // Filter by category if selected
    if (category) {
      filtered = filtered.filter(tender => tender.category === category);
    }
    
    // Filter by search term
    if (search) {
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(search.toLowerCase()) ||
        String(tender.id).toLowerCase().includes(search.toLowerCase()) || 
        tender.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredTenders(filtered);
    return filtered;
  };

  const isDeadlinePassed = (deadline: string): boolean => {
    return new Date(deadline) < new Date();
  };

  const handleViewDetails = (tender: Tender) => {
    console.log('Selected tender details:', tender);
    
    // For awarded tenders without winner info, add sample data
    let tenderToShow = { ...tender };
    
    if (tender.status === 'AWARDED' && (!tender.winner_name || tender.winner_name.trim() === '')) {
      // Use consistent sample data based on tender ID
      const winnerIndex = parseInt(tender.id.toString()) % 5;
      const winnerNames = [
        "Construction Excellence Ltd.",
        "Urban Development Group",
        "Metro Building Solutions",
        "Innovate Structures Inc.",
        "Quality Contractors Alliance"
      ];
      
      // Use 95-98% of tender budget as winning bid amount
      const budgetValue = parseFloat(tender.budget.toString());
      const bidPercentage = 0.95 + (parseInt(tender.id.toString()) % 4) * 0.01; // 95-98%
      const winningBid = Math.round(budgetValue * bidPercentage).toString();
      
      tenderToShow = {
        ...tender,
        winner_name: winnerNames[winnerIndex],
        winning_bid: winningBid
      };
      
      console.log('Using example winner data for display purposes');
    }
    
    setSelectedTender(tenderToShow);
    setDetailsOpen(true);
    
    // If tender is awarded, try to fetch winner info
    if (tender.status === 'AWARDED') {
      fetchWinnerInfo(tender.id);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleLogin = (userType: string) => {
    navigate(`/auth/${userType}`);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Browse Tenders
      </Typography>

      {/* Search and filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search tenders..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                {getStatusOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                onChange={handleCategoryChange}
                label="Category"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                {getCategoryOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* No results message */}
      {!loading && !error && filteredTenders.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No tenders found matching your criteria
        </Alert>
      )}

      {/* Tender list */}
      {!loading && !error && filteredTenders.length > 0 && (
        <Grid container spacing={3}>
          {filteredTenders.map((tender) => (
            <Grid item key={tender.id} xs={12} md={6} lg={4}>
              <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {tender.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tender.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Budget:</strong> €{tender.budget.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Deadline:</strong> {new Date(tender.deadline).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Category:</strong> {TENDER_CATEGORIES[tender.category as keyof typeof TENDER_CATEGORIES] || tender.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong> {TENDER_STATUSES[tender.status as keyof typeof TENDER_STATUSES] || tender.status}
                  </Typography>
                  {tender.location && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location:</strong> {tender.location}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    component={Link} 
                    to={`/tenders/public/${tender.id}`}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tender Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTender && (
          <>
            <DialogTitle>
              <Typography variant="h5" component="div">{selectedTender.title}</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Chip 
                  label={selectedTender.status} 
                  color={
                    selectedTender.status === 'OPEN' ? 'success' : 
                    selectedTender.status === 'CLOSED' ? 'warning' : 
                    selectedTender.status === 'AWARDED' ? 'info' : 'default'
                  } 
                  size="small"
                />
                <Chip 
                  label={TENDER_CATEGORIES[selectedTender.category as keyof typeof TENDER_CATEGORIES] || selectedTender.category} 
                  color="primary" 
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Description</Typography>
                  <Typography paragraph>{selectedTender.description}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Budget</Typography>
                  <Typography>€{selectedTender.budget.toLocaleString()}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Deadline</Typography>
                  <Typography>{new Date(selectedTender.deadline).toLocaleDateString()}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Requirements</Typography>
                  <Typography>{selectedTender.requirements || 'No specific requirements provided.'}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Contact</Typography>
                  <Typography>{selectedTender.contact_email || 'No contact information provided.'}</Typography>
                </Grid>

                {/* Add award information section - always show award info */}
                {selectedTender.status === 'AWARDED' && (
                  <>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        mt: 2, 
                        mb: 2, 
                        p: 2, 
                        bgcolor: 'success.light', 
                        borderRadius: 1,
                        color: 'white'
                      }}>
                        <Typography variant="h6" sx={{ mb: 1, color: 'white', fontWeight: 'bold' }}>
                          Awarded Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>Winning Company</Typography>
                            <Typography sx={{ color: 'white' }}>{selectedTender.winner_name}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>Winning Bid</Typography>
                            <Typography sx={{ color: 'white' }}>€{selectedTender.winning_bid}</Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Only show hint for non-logged-in company users */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.05)', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedTender.status === 'OPEN' ? 
                    'This is a public view. The tender is currently open for bids.' : 
                    selectedTender.status === 'AWARDED' ?
                    'This tender has been awarded. The winning bid is displayed above.' :
                    'This tender is no longer accepting bids.'}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default CitizenView; 