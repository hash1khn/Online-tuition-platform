import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Stack,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Send, SmartToy } from "@mui/icons-material";
import PropTypes from "prop-types";

const ChatbotDialog = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Need Assistance? Just Ask!...",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userPrompt = { prompt: currentMessage };

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: currentMessage },
    ]);

    setCurrentMessage("");

    setIsTyping(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "..." }, 
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPrompt),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const result = "";
      await reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });

        try {
          const jsonResponse = JSON.parse(text);
          if (jsonResponse.data) {
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              updatedMessages.pop();
              return [
                ...updatedMessages,
                { role: "assistant", content: jsonResponse.data },
              ];
            });
          }
        } catch (error) {
          console.error("Error parsing response:", error);
        }

        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>Chat with Tutorly&apos;s Assistant</DialogTitle>
      <DialogContent sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Stack
          direction="column"
          spacing={2}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: 400,
            p: 2,
            border: "1px solid black",
            borderRadius: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                msg.role === "assistant" ? "flex-start" : "flex-end"
              }
              alignItems="center"
              sx={{ width: "100%" }}
            >
              {msg.role === "assistant" && (
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 32,
                    height: 32,
                    mr: 1,
                  }}
                >
                  <SmartToy fontSize="small" />
                </Avatar>
              )}
              <Typography
                variant="body1"
                sx={{
                  bgcolor: msg.role === "assistant" ? "primary.main" : "info.main",
                  color: msg.role === "assistant" ? "#000000" : "#ffffff",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </Typography>
            </Box>
          ))}
          {isTyping && (
            <Box
              display="flex"
              alignItems="center"
              sx={{ width: "100%", mt: 1 }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  width: 32,
                  height: 32,
                  mr: 1,
                }}
              >
                <SmartToy fontSize="small" />
              </Avatar>
              <CircularProgress size={24} sx={{ color: "primary.main" }} />
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={2} mt={2} alignItems="center">
          <TextField
            label="Type your message..."
            fullWidth
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            variant="outlined"
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            sx={{ bgcolor: "primary.main", color: "white" }}
          >
            <Send />
          </IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

ChatbotDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatbotDialog;
