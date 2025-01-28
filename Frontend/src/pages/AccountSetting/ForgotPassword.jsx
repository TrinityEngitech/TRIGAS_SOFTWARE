import { useState } from "react";
import { Grid, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState(""); // Changed from email to phoneNumber
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle Phone Number Submission
  const handlePhoneSubmit = () => {
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }
    // Here you can call API to send OTP to the phone number
    alert("Phone number verified. Proceed to reset password.");
    setStep(2);
  };

  // Handle Password Reset
  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      alert("Please enter both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Call API to update the password
    alert("Password reset successful!");
    navigate("/");
  };

  return (
    <Box p={3}>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Forgot Password
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            Dashboard
          </Link>{" "}
          / Forgot Password
        </Typography>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginTop: "30px",
          maxWidth: "500px",
        }}
      >
        {step === 1 ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Enter Your Phone Number"
                  type="text" // Set to 'text' for phone number input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handlePhoneSubmit} // Submit phone number for OTP
                >
                  Verify Phone Number
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
