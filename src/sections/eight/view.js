import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Stack,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

const ChatbotDialog = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Need Assistance? Just Ask!...",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState(""); // Renamed to avoid shadowing

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userPrompt = { prompt: currentMessage };

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: currentMessage },
    ]);

    setCurrentMessage("");

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

      let result = ""; // Use const here as ESLint prefers immutability
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
            setMessages((prevMessages) => [
              ...prevMessages,
              { role: "assistant", content: jsonResponse.data },
            ]);
          }
        } catch (error) {
          console.error("Error parsing response:", error);
        }

        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Function to clear messages
  const clearMessages = () => {
    setMessages([
      {
        role: "assistant",
        content: "Need Assistance? Just Ask!...",
      },
    ]);
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
      <DialogTitle>Chat with Tutorly&apos;s Assistant</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Stack
            direction="column"
            width="100%"
            height="400px"
            border="1px solid black"
            borderRadius="10px"
            p={2}
            spacing={2}
          >
            <Stack
              direction="column"
              spacing={1}
              flexGrow={1}
              overflow="auto"
              maxHeight="100%"
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    msg.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={msg.role === "assistant" ? "primary.main" : "info.main"}
                    color={msg.role === "assistant" ? "#000000" : "#ffffff"}
                    borderRadius={12}
                    p={2}
                    dangerouslySetInnerHTML={{
                      __html: msg.content,
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} mt={2} width="100%">
            <TextField
              label="Message"
              fullWidth
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            mt={2}
            width="100%"
            justifyContent="flex-end"
            mb={2}
          >
            <Button variant="outlined" color="info" onClick={clearMessages}>
              Clear Conversation
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

ChatbotDialog.propTypes = {
  open: PropTypes.bool.isRequired, // Add prop validation
  onClose: PropTypes.func.isRequired,
};

export default ChatbotDialog;
