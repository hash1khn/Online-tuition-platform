import React, { useState } from "react";
import { Fab } from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ChatbotDialog from "src/sections/eight/view"; // Update this path to match your file structure

const FloatingChatButton = () => {
  const [open, setOpen] = useState(false); // State for dialog

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Floating Button */}
      <Fab
        color="primary"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
        onClick={handleOpen}
      >
        <ChatBubbleOutlineRoundedIcon />
      </Fab>

      {/* Chat Dialog */}
      <ChatbotDialog open={open} onClose={handleClose} />
    </div>
  );
};

export default FloatingChatButton;
