// import React, { useState } from "react";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Paper,
//   Box,
//   Avatar,
//   Typography,
//   MenuItem,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { InputAdornment, IconButton } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { styled } from "@mui/system";
// import { ArrowBack } from "@mui/icons-material";
// import { useNavigate, Link } from "react-router-dom";

// const StyledPaper = styled(Paper)({
//   padding: "30px",
//   maxWidth: "500px",
//   textAlign: "center",
//   borderRadius: "12px",
//   boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
// });

// const StyledAvatar = styled(Avatar)({
//   margin: "auto",
//   backgroundColor: "#3f51b5",
// });

// const StyledButton = styled(Button)({
//   marginTop: "20px",
//   padding: "10px",
//   fontSize: "16px",
//   backgroundColor: "#3f51b5",
//   "&:hover": {
//     backgroundColor: "#303f9f",
//   },
// });

// function Registration() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("Customer");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

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
//     } catch (error) {
//       setLoading(false);
//       alert(
//         "Signup failed: " + (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   const [showPassword, setShowPassword] = useState(false);

//   const handleTogglePassword = () => {
//     setShowPassword((prev) => !prev);
//   };
//   return (
//     <Box p={3}>
//       <Box sx={{ display: "flex" }}>
//         <Button
//           variant="text"
//           color="primary"
//           onClick={() => navigate(-1)}
//           sx={{ mb: 2 }}
//         >
//           <ArrowBack />
//         </Button>
//         <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
//           Registration
//         </Typography>
//       </Box>
//       <Box>
//         <Typography
//           variant="subtitle1"
//           sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
//         >
//           <Link to="/" style={{ textDecoration: "none" }}>
//             Dashboard
//           </Link>{" "}
//           / Registration
//         </Typography>
//       </Box>
//       <StyledPaper elevation={6}>
//         <StyledAvatar>
//           <LockOutlinedIcon />
//         </StyledAvatar>
//         <Typography sx={{ margin: "10px 0", fontSize: "25px" }}>
//           Create an Account
//         </Typography>
//         <form onSubmit={handleSignup}>
//           <TextField
//             label="Name"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <TextField
//             label="Email"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <TextField
//             label="Password"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             type={showPassword ? "text" : "password"} // Toggle between text and password
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={handleTogglePassword}
//                     edge="end"
//                     size="small"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <TextField
//             label="Role"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             required
//           >
//             <MenuItem value="Admin">Admin</MenuItem>
//             <MenuItem value="Employee">Employee</MenuItem>
//             <MenuItem value="Customer">Customer</MenuItem>
//             <MenuItem value="Driver">Driver</MenuItem>
//             <MenuItem value="Transporter">Transporter</MenuItem>
//           </TextField>
//           <StyledButton
//             type="submit"
//             variant="contained"
//             fullWidth
//             disabled={loading}
//           >
//             {loading ? "Signing up..." : "Signup"}
//           </StyledButton>
//         </form>
//       </StyledPaper>
//     </Box>
//   );
// }

// export default Registration;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Paper,
//   Box,
//   Avatar,
//   Typography,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   InputAdornment,
//   Grid
// } from "@mui/material";
// import {
//   Visibility,
//   VisibilityOff,
//   ContentCopy,
//   ArrowBack,
// } from "@mui/icons-material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { styled } from "@mui/system";
// import { useNavigate, Link } from "react-router-dom";

// const StyledPaper = styled(Paper)({
//   padding: "30px",
//   maxWidth: "500px",
//   textAlign: "center",
//   borderRadius: "12px",
//   boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
// });

// const StyledAvatar = styled(Avatar)({
//   margin: "auto",
//   backgroundColor: "#3f51b5",
// });

// const StyledButton = styled(Button)({
//   marginTop: "20px",
//   padding: "10px",
//   fontSize: "16px",
//   backgroundColor: "#3f51b5",
//   "&:hover": {
//     backgroundColor: "#303f9f",
//   },
// });

// const Registration = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("Customer");
//   const [loading, setLoading] = useState(false);
//   const [users, setUsers] = useState([]); // Stores registered users
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   // Load registered users from localStorage on component mount
//   useEffect(() => {
//     const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
//     setUsers(storedUsers);
//   }, []);

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
//       alert("Signup successful! User added to the table.");

//       const newUser = { name, email, password, role };

//       // Update users list
//       const updatedUsers = [...users, newUser];
//       setUsers(updatedUsers);

//       // Save updated users list to localStorage
//       localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

//       setName("");
//       setEmail("");
//       setPassword("");
//     } catch (error) {
//       setLoading(false);
//       alert(
//         "Signup failed: " + (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   const handleTogglePassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleCopy = (user) => {
//     const userData = `Name: ${user.name}\nEmail: ${user.email}\nPassword: ${user.password}\nRole: ${user.role}`;
//     navigator.clipboard.writeText(userData);
//     alert("User data copied!");
//   };

//   return (
//     <Grid container spacing={3} p={3}>
//       {/* Left Side - Registration Form */}
//       <Grid item xs={12} md={6}>
//         <Box sx={{ display: "flex" }}>
//           <Button
//             variant="text"
//             color="primary"
//             onClick={() => navigate(-1)}
//             sx={{ mb: 2 }}
//           >
//             <ArrowBack />
//           </Button>
//           <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
//             Registration
//           </Typography>
//         </Box>
//         <Box>
//           <Typography
//             variant="subtitle1"
//             sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
//           >
//             <Link to="/" style={{ textDecoration: "none" }}>
//               Dashboard
//             </Link>{" "}
//             / Registration
//           </Typography>
//         </Box>
//         <StyledPaper elevation={6}>
//           <StyledAvatar>
//             <LockOutlinedIcon />
//           </StyledAvatar>
//           <Typography sx={{ margin: "10px 0", fontSize: "25px" }}>
//             Create an Account
//           </Typography>
//           <form onSubmit={handleSignup}>
//             <TextField
//               label="Name"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//             <TextField
//               label="Email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <TextField
//               label="Password"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={handleTogglePassword}
//                       edge="end"
//                       size="small"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <TextField
//               label="Role"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               required
//             >
//               <MenuItem value="Admin">Admin</MenuItem>
//               <MenuItem value="Employee">Employee</MenuItem>
//               <MenuItem value="Customer">Customer</MenuItem>
//               <MenuItem value="Driver">Driver</MenuItem>
//               <MenuItem value="Transporter">Transporter</MenuItem>
//             </TextField>
//             <StyledButton
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={loading}
//             >
//               {loading ? "Signing up..." : "Signup"}
//             </StyledButton>
//           </form>
//         </StyledPaper>
//       </Grid>

//       {/* Right Side - Registered Users Table */}
//       <Grid item xs={12} md={6} sx={{ borderLeft: "1px solid #ccc", pl: 3 }}>
//         <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
//           Registered Users
//         </Typography>
//         {users.length === 0 ? (
//           <Typography>No users registered yet.</Typography>
//         ) : (
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Password</TableCell>
//                   <TableCell>Role</TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {users.map((user, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{user.name}</TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     <TableCell>{user.password}</TableCell>
//                     <TableCell>{user.role}</TableCell>
//                     <TableCell>
//                       <IconButton onClick={() => handleCopy(user)}>
//                         <ContentCopy />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Grid>
//     </Grid>
//   );
// };

// export default Registration;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Box,
  Avatar,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ContentCopy,
  ArrowBack,
} from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "@mui/system";
import { useNavigate, Link } from "react-router-dom";

const StyledPaper = styled(Paper)({
  padding: "30px",
  maxWidth: "500px",
  textAlign: "center",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
});

const StyledAvatar = styled(Avatar)({
  margin: "auto",
  backgroundColor: "#3f51b5",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#3f51b5",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
});

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // Stores registered users
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Fetch registered users from the backend on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        console.log("Fetched users: ", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users from the backend.");
      }
    };

    fetchUsers();
  }, []);

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
      alert("Signup successful! User added to the table.");

      // Add new user to the users state (optimistic update)
      const newUser = { name, email, password, role };
      setUsers((prevUsers) => [...prevUsers, newUser]);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setLoading(false);
      alert(
        "Signup failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCopy = (user) => {
    const userData = `Name: ${user.name}\nEmail: ${user.email}\nPassword: ${user.password}\nRole: ${user.role}`;
    navigator.clipboard.writeText(userData);
    alert("User data copied!");
  };

  return (
    <Grid container spacing={3} p={3}>
      {/* Left Side - Registration Form */}
      <Grid item xs={12} md={6}>
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
            Registration
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
            / Registration
          </Typography>
        </Box>
        <StyledPaper elevation={6}>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography sx={{ margin: "10px 0", fontSize: "25px" }}>
            Create an Account
          </Typography>
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
        </StyledPaper>
      </Grid>

      {/* Right Side - Registered Users Table */}
      <Grid item xs={12} md={6} sx={{ borderLeft: "1px solid #ccc", pl: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 4 }}>
          Registered Users
        </Typography>
        {users.length === 0 ? (
          <Typography>No users registered yet.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleCopy(user)}>
                        <ContentCopy />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default Registration;
