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

const ChatbotDialog = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Need Assistance? Just Ask!...",
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userPrompt = { prompt: message };

    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
    ]);

    setMessage("");

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

      let result = "";
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
            setMessages((messages) => [
              ...messages,
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
      <DialogTitle>Chat with Tutorly's Assistant</DialogTitle>
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
              {messages.map((message, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={
                      message.role === "assistant"
                        ? "primary.main"
                        : "info.main"
                    }
                    color={
                      message.role === "assistant" ? "#000000" : "#ffffff"
                    }
                    borderRadius={12}
                    p={2}
                    dangerouslySetInnerHTML={{
                      __html: message.content,
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} mt={2} width="100%" justifyContent="flex-end" mb={2}>
            <Button variant="outlined" color="info" onClick={clearMessages}>
              Clear Conversation
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotDialog;
