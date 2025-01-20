import { useState } from "react";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";

function Demo() {
  const [contacts, setContacts] = useState([
    { contactName: "", phoneNumber: "", email: "" },
  ]);
  const [messages, setMessages] = useState([]);

  const addContact = () => {
    setContacts([
      ...contacts,
      { contactName: "", phoneNumber: "", email: "" },
    ]);
    setMessages([...messages, `Contact ${contacts.length + 1} added successfully!`]);
  };

  const removeContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);

    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  return (
    <form>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          className="fs-4"
          sx={{ marginBottom: "20px", fontWeight: "500" }}
        >
          Contact Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addContact}
          sx={{
            height: "40px",
            minWidth: "100px",
            marginBottom: "20px",
          }}
        >
          Add Contact
        </Button>
      </Box>

      {/* Display Messages */}
      <Box sx={{ marginBottom: "20px" }}>
        {messages.map((msg, index) => (
          <Typography key={index} sx={{ color: "green", marginBottom: "5px" }}>
            {msg}
          </Typography>
        ))}
      </Box>

      {/* Contacts Mapping */}
      {contacts.map((contact, index) => (
        <Box key={index} p={2} sx={{ border: "1px solid #ddd", borderRadius: "8px", mb: 2 }}>
          {/* Contact Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "500" }}>
              Contact {index + 1}
            </Typography>
            {/* Remove Button */}
            <IconButton
              onClick={() => removeContact(index)}
              sx={{
                backgroundColor: "#cf0202",
                borderRadius: "50%",
                color: "#fff",
                cursor: contacts.length === 1 ? "not-allowed" : "pointer",
                pointerEvents: contacts.length === 1 ? "none" : "auto",
                visibility: contacts.length === 1 ? "hidden" : "visible",
                "&:hover": {
                  backgroundColor: "#b20202",
                },
              }}
            >
              <i className="bi bi-x"></i>
            </IconButton>
          </Box>

          {/* Contact Fields */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Contact Name"
              value={contact.contactName}
              onChange={(e) =>
                handleContactChange(index, "contactName", e.target.value)
              }
              sx={{ flex: 1 }}
            />
            <TextField
              label="Phone Number"
              value={contact.phoneNumber}
              onChange={(e) =>
                handleContactChange(index, "phoneNumber", e.target.value)
              }
              sx={{ flex: 1 }}
            />
            <TextField
              label="Email ID"
              value={contact.email}
              onChange={(e) =>
                handleContactChange(index, "email", e.target.value)
              }
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      ))}

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" color="primary">
          Save
        </Button>
        <Button variant="outlined" color="error">
          Cancel
        </Button>
      </Box>
    </form>
  );
}

export default Demo;
