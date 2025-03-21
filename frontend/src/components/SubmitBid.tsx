import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Alert, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface SubmitBidProps {
  tenderId: number;
  onBidSubmitted?: () => void;
}

interface Bid {
  id: number;
  tender_id: number;
  company: number;
  bidding_price: string;
  status: string;
  submission_date: string;
  tender_title: string;
}

export default function SubmitBid({ tenderId, onBidSubmitted }: SubmitBidProps) {
  const [hasBid, setHasBid] = useState<boolean | null>(null); // null means loading
  const [error, setError] = useState('');
  const [submittedBidId, setSubmittedBidId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const checkExistingBid = async () => {
      setLoading(true);
      try {
        const myBids = await api.bids.getMyBids();
        const existingBid = myBids.find((bid: any) => bid.tender_id.toString() === tenderId);
        
        if (existingBid) {
          // 已经提交过标书
          setError('您已经对此招标提交过标书');
          setSubmittedBidId(existingBid.id);
        }
      } catch (error) {
        console.error('Error checking existing bids:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingBid();
  }, [tenderId]);

  // loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  // warnning message
  if (hasBid) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        You have already submitted a bid for this tender.
      </Alert>
    );
  }

  // error message
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // BidForm Module
  return <BidForm tenderId={tenderId} onBidSubmitted={onBidSubmitted} />;
}

function BidForm({ tenderId, onBidSubmitted }: SubmitBidProps) {
  const [biddingPrice, setBiddingPrice] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      // 创建表单数据
      const formData = new FormData();
      
      // 添加文件到表单
      if (document) {
        formData.append('bid_document', document);
      }

      // 提交标书
      const bidData = {
        tender_id: tenderId,
        bid_amount: biddingPrice,
        company_description: '',
        proposal_description: additionalNotes,
      };

      const result = await api.bids.create(bidData);
      
      setSuccess('Your bid has been submitted successfully!');
      // 通知父组件已成功提交
      if (onBidSubmitted) {
        onBidSubmitted();
      }
      // 清空表单
      setBiddingPrice('');
      setDocument(null);
      setAdditionalNotes('');
    } catch (error) {
      console.error('Error submitting bid:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6">Submit Bid</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        type="number"
        label="Bidding Price (€)"
        value={biddingPrice}
        onChange={(e) => setBiddingPrice(e.target.value)}
        fullWidth
        required
        sx={{ mt: 1 }}
      />

      <input
        type="file"
        onChange={(e) => setDocument(e.target.files?.[0] || null)}
        style={{ display: 'none' }}
        id="bid-document"
      />
      <label htmlFor="bid-document">
        <Button
          component="span"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Upload Document
        </Button>
      </label>
      {document && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected file: {document.name}
        </Typography>
      )}

      <TextField
        label="Additional Notes"
        value={additionalNotes}
        onChange={(e) => setAdditionalNotes(e.target.value)}
        multiline
        rows={4}
        fullWidth
        sx={{ mt: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={submitting}
      >
        Submit Bid
      </Button>
    </Box>
  );
} 