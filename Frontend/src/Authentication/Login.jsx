import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "@mui/system";

// Styled Components
const LoginWrapper = styled("div")({
  height: "100vh",
  background: "linear-gradient(to right, #4e54c8, #8f94fb)",
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
  backgroundColor: "#4e54c8",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#4e54c8",
  "&:hover": {
    backgroundColor: "#3b44a1",
  },
});

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      onLogin();
    } else {
      alert("Invalid username or password");
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
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginBottom: "20px" }}
          >
            Please enter your credentials to access your account.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <StyledButton type="submit" variant="contained" fullWidth>
              Login
            </StyledButton>
          </form>
          <Typography variant="body2" sx={{ marginTop: "15px" }}>
            Forgot your password? <a href="#">Reset here</a>
          </Typography>
        </StyledPaper>
      </Container>
    </LoginWrapper>
  );
}

export default Login;


// import React, { useState } from "react";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Paper,
//   Container,
//   Avatar,
//   Tabs,
//   Tab,
//   MenuItem,
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { styled } from "@mui/system";

// // Styled Components
// const LoginWrapper = styled("div")({
//   height: "100vh",
//   background: "linear-gradient(to right, #4e54c8, #8f94fb)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// });

// const StyledPaper = styled(Paper)({
//   padding: "30px",
//   maxWidth: "400px",
//   textAlign: "center",
//   borderRadius: "12px",
//   boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
// });

// const StyledAvatar = styled(Avatar)({
//   margin: "auto",
//   backgroundColor: "#4e54c8",
// });

// const StyledButton = styled(Button)({
//   marginTop: "20px",
//   padding: "10px",
//   fontSize: "16px",
//   backgroundColor: "#4e54c8",
//   "&:hover": {
//     backgroundColor: "#3b44a1",
//   },
// });

// function Auth() {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user");
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleTabChange = (event, newValue) => {
//     setTabIndex(newValue);
//     setName("");
//     setEmail("");
//     setPassword("");
//     setRole("Admin");
//     setUsername("");
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:3000/api/login", {
//         email,
//         password,
//       });
//       setLoading(false);
//       alert(`Login successful! Token: ${response.data.token}`);
//       console.log(response.data);
//     } catch (error) {
//       setLoading(false);
//       alert("Login failed: " + error.response?.data?.message || error.message);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:3000/api/signup", {
//         name,
//         email,
//         password,
//         role,
//       });
//       setLoading(false);
//       alert("Signup successful! You can now log in.");
//       console.log(response.data);
//       setTabIndex(0); // Switch to login tab after successful signup
//     } catch (error) {
//       setLoading(false);
//       alert("Signup failed: " + error.response.data.message);
//     }
//   };

//   return (
//     <LoginWrapper>
//       <Container>
//         <StyledPaper elevation={6}>
//           <StyledAvatar>
//             <LockOutlinedIcon />
//           </StyledAvatar>
//           <Typography variant="h5" sx={{ margin: "10px 0" }}>
//             {tabIndex === 0 ? "Welcome Back" : "Create an Account"}
//           </Typography>
//           <Tabs
//             value={tabIndex}
//             onChange={handleTabChange}
//             centered
//             textColor="primary"
//             indicatorColor="primary"
//             sx={{ marginBottom: "20px" }}
//           >
//             <Tab label="Login" />
//             <Tab label="Signup" />
//           </Tabs>
//           {tabIndex === 0 && (
//          <form onSubmit={handleLogin}>
//          <TextField
//            label="Email"
//            variant="outlined"
//            fullWidth
//            margin="normal"
//            type="email"
//            value={email}
//            onChange={(e) => setEmail(e.target.value)}
//            required
//          />
//          <TextField
//            label="Password"
//            variant="outlined"
//            fullWidth
//            margin="normal"
//            type="password"
//            value={password}
//            onChange={(e) => setPassword(e.target.value)}
//            required
//          />
//          <StyledButton
//            type="submit"
//            variant="contained"
//            fullWidth
//            disabled={loading}
//          >
//            {loading ? "Logging in..." : "Login"}
//          </StyledButton>
//        </form>
//           )}
//           {tabIndex === 1 && (
//             <form onSubmit={handleSignup}>
//               <TextField
//                 label="Name"
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//               <TextField
//                 label="Email"
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <TextField
//                 label="Password"
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <TextField
//                 label="Role"
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//                 select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//               >
//                 <MenuItem value="Admin">Admin</MenuItem>
//                 <MenuItem value="Employee">Employee</MenuItem>
//                 <MenuItem value="Customer">Customer</MenuItem>
//                 <MenuItem value="Driver">Driver</MenuItem>
//                 <MenuItem value="Transporter">Transporter</MenuItem>
//               </TextField>
//               <StyledButton
//                 type="submit"
//                 variant="contained"
//                 fullWidth
//                 disabled={loading}
//               >
//                 {loading ? "Signing up..." : "Signup"}
//               </StyledButton>
//             </form>
//           )}
//         </StyledPaper>
//       </Container>
//     </LoginWrapper>
//   );
// }

// export default Auth;
