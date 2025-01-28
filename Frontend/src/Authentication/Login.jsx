import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
  Avatar,
  Tabs,
  Tab,
  MenuItem,
} from "@mui/material";

// import { useNavigate } from "react-router-dom"; // Import useNavigate

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "@mui/system";

import axiosInstance from "./axiosConfig";

// Styled Components
const LoginWrapper = styled("div")({
  height: "100vh",
  background: "linear-gradient(to right,rgb(37, 46, 214),rgb(143, 179, 251))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledPaper = styled(Paper)({
  padding: "30px",
  maxWidth: "400px",
  textAlign: "center",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
});

const StyledAvatar = styled(Avatar)({
  margin: "auto",
  // backgroundColor: "#4e54c8",
  backgroundColor: "#0324fc",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#0324fc",
  "&:hover": {
    backgroundColor: "#1d05a6",
  },
});

function Auth({ onLogin }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setName("");
    setEmail("");
    setPassword("");
    setRole("Admin");
    setUsername("");
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await axiosInstance.post("/login", {
  //       email,
  //       password,
  //     });

  //     // Extract token from the response
  //     const { token } = response.data;

  //     // Store the token in localStorage
  //     localStorage.setItem("token", token);

  //     setLoading(false);

  //     // Perform additional actions on successful login
  //     alert("Login successful!");
  //     onLogin(); // Call additional login handling logic
  //     console.log("Token:", token);

  //     // Example: Redirect to Admin Dashboard
  //     // navigate("/admin-panel");
  //   } catch (error) {
  //     setLoading(false);
  //     alert("Login failed: " + (error.response?.data?.message || error.message));
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      // Extract token and user data from the response
      const { token, user } = response.data;

      // Store the token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user data as a JSON string

      setLoading(false);

      // Perform additional actions on successful login
      alert("Login successful!");
      onLogin(); // Call additional login handling logic
      console.log("Token:", token);
      console.log("User Data:", user);

      // Example: Redirect to Admin Dashboard
      // navigate("/admin-panel");
    } catch (error) {
      setLoading(false);
      alert(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        name,
        email,
        password,
        role,
      });
      setLoading(false);
      alert("Signup successful! You can now log in.");
      console.log(response.data);
      setTabIndex(0); // Switch to login tab after successful signup
    } catch (error) {
      setLoading(false);
      alert("Signup failed: " + error.response.data.message);
    }
  };

  return (
    <LoginWrapper>
      <Container>
        <StyledPaper elevation={6}>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography variant="h5" sx={{ margin: "10px 0" }}>
            {tabIndex === 0 ? "Welcome Back" : "Create an Account"}
          </Typography>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{ marginBottom: "20px" }}
          >
            <Tab label="Login" />
            <Tab label="Signup" />
          </Tabs>
          {tabIndex === 0 && (
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </StyledButton>
            </form>
          )}
          {tabIndex === 1 && (
            <form onSubmit={handleSignup}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                label="Role"
                variant="outlined"
                fullWidth
                margin="normal"
                select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Driver">Driver</MenuItem>
                <MenuItem value="Transporter">Transporter</MenuItem>
              </TextField>
              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? "Signing up..." : "Signup"}
              </StyledButton>
            </form>
          )}
        </StyledPaper>
      </Container>
    </LoginWrapper>
  );
}

export default Auth;





// import React, { useState } from "react";
// import "./Login.css"

// const Auth = () => {
//   const [isSignUpMode, setIsSignUpMode] = useState(false);

//   const handleSignUpClick = () => setIsSignUpMode(true);
//   const handleSignInClick = () => setIsSignUpMode(false);

//   return (
//     <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
//       <div className="forms-container">
//         <div className="signin-signup">
//           {/* Sign-In Form */}
//           <form action="#" className="sign-in-form">
//             <h2 className="title">Sign in</h2>
//             <div className="input-field">
//               <i className="fas fa-user"></i>
//               <input type="text" placeholder="Username" />
//             </div>
//             <div className="input-field">
//               <i className="fas fa-lock"></i>
//               <input type="password" placeholder="Password" />
//             </div>
//             <input type="submit" value="Login" className="btn solid" />
//           </form>

//           {/* Sign-Up Form */}
//           <form action="#" className="sign-up-form">
//             <h2 className="title">Sign up</h2>
//             <div className="input-field">
//               <i className="fas fa-user"></i>
//               <input type="text" placeholder="Username" />
//             </div>
//             <div className="input-field">
//               <i className="fas fa-envelope"></i>
//               <input type="email" placeholder="Email" />
//             </div>
//             <div className="input-field">
//               <i className="fas fa-lock"></i>
//               <input type="password" placeholder="Password" />
//             </div>
//             <input type="submit" className="btn" value="Sign up" />
//           </form>
//         </div>
//       </div>

//       {/* Panels */}
//       <div className="panels-container">
//         <div className="panel left-panel">
//           <div className="content">
//             <h3>New here ?</h3>
//             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//             <button className="btn transparent" onClick={handleSignUpClick}>
//               Sign up
//             </button>
//           </div>
//           <img
//             src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
//             className="image"
//             alt="Privacy Policy"
//           />
//         </div>
//         <div className="panel right-panel">
//           <div className="content">
//             <h3>One of us ?</h3>
//             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
//             <button className="btn transparent" onClick={handleSignInClick}>
//               Sign in
//             </button>
//           </div>
//           <img
//             src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
//             className="image"
//             alt="Mobile Login"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;
