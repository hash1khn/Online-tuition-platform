// components/FloatingChatButton.js
import React, { useState } from 'react';
import { Fab } from '@mui/material';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

import BookSessionDialog from 'src/sections/eight/view';


const FloatingChatButton = () => {
  const [open, setOpen] = React.useState(false); // State for dialog

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Fab
        color="primary"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
        }}
        onClick={handleOpen}
      >
        <ChatBubbleOutlineRoundedIcon />
      </Fab>
      
      {/* Chat Dialog */}
      <BookSessionDialog open={open} onClose={handleClose} />

    </div>
  );
};

export default FloatingChatButton;
