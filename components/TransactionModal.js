import React from 'react';
import { Modal, CircularProgress, Box, Typography } from '@mui/material';

const TransactionModal = ({ open, message }) => {
  return (
    <Modal open={open} aria-labelledby="transaction-modal-title">
      <Box 
        sx={{ 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          position: 'absolute', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2 
        }}
      >
        <CircularProgress />
        <Typography id="transaction-modal-title" variant="h6">
          {message}
        </Typography>
        <Typography color="textSecondary">
          Please wait while we confirm the transaction on the blockchain.
        </Typography>
      </Box>
    </Modal>
  );
};

export default TransactionModal;
