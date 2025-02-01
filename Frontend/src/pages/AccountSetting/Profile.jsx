// import React, { useState } from "react";
// import {
//   Container,
//   Paper,
//   Typography,
//   Avatar,
//   Button,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Box,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import { ArrowBack } from "@mui/icons-material";
// import LockResetIcon from "@mui/icons-material/LockReset";
// import { useNavigate, Link } from "react-router-dom";

// const Profile = () => {
//   const navigate = useNavigate();

//   // Profile State
//   const [profile, setProfile] = useState({
//     username: "Dharmesh Jobanputra",
//     role: "Admin",
//     email: "example@gmail.com",
//     mobile: "01230123012",
//   });

//   const [openEdit, setOpenEdit] = useState(false);
//   const [editData, setEditData] = useState(profile);

//   // Handle Edit Dialog Open/Close
//   const handleEditOpen = () => setOpenEdit(true);
//   const handleEditClose = () => setOpenEdit(false);

//   // Handle Input Change
//   const handleChange = (e) => {
//     setEditData({ ...editData, [e.target.name]: e.target.value });
//   };

//   // Save Changes
//   const handleSave = () => {
//     setProfile(editData);
//     setOpenEdit(false);
//   };

//   // Forgot Password Handler
//   const handleForgotPassword = () => {
//     navigate("/forgotPassword");
//   };

//   // Extract initials (First letter of first and last name)
//   const getInitials = (name) => {
//     const nameParts = name.split(" ");
//     if (nameParts.length >= 2) {
//       return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
//     }
//     return nameParts[0][0].toUpperCase(); // If only one name exists
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
//           My Profile
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
//           / Profile
//         </Typography>
//       </Box>
//       <Container maxWidth="md" sx={{ mt: 5, fontFamily: "Poppins" }}>
//         <Paper
//           elevation={4}
//           sx={{
//             p: 4,
//             background: "#fff",
//             borderRadius: 4,
//             textAlign: "center",
//             backdropFilter: "blur(10px)",
//             //   backgroundColor: "rgba(255, 255, 255, 0.15)",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//             border: "1px solid #0288d1",
//             color: "#000",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <Avatar
//             sx={{
//               width: 110,
//               height: 110,
//               margin: "auto",
//               bgcolor: "#E3F2FD", // Light blue background for contrast
//               border: "2px solid #0288d1",
//               color: "#0288d1",
//               fontSize: 36,
//               fontWeight: "bold",
//               boxShadow: "rgba(201, 228, 255, 0.39) 0px 8px 24px",
//             }}
//           >
//             {getInitials(profile.username)}
//           </Avatar>

//           {/* Profile Details */}
//           <Typography sx={{ mt: 2, fontWeight: "bold", fontSize: "22px" }}>
//             {profile.username}
//           </Typography>
//           <Typography sx={{ mt: 1, fontSize: "18px", color: "grey" }}>
//             {profile.role}
//           </Typography>

//           <hr />

//           <Box sx={{ textAlign: "left", mt: 2, p: 1 }}>
//             <Typography
//               variant="body1"
//               sx={{
//                 fontWeight: "bold",
//                 color: "#0288d1",
//                 marginBottom: "10px",
//               }}
//             >
//               User Info:
//             </Typography>
//             <Typography variant="body1" sx={{ marginBottom: "5px" }}>
//               <strong>UserName:</strong> {profile.username}
//             </Typography>
//             <Typography variant="body1" sx={{ marginBottom: "5px" }}>
//               <strong>Email:</strong> {profile.email}
//             </Typography>
//             <Typography variant="body1">
//               <strong>Mobile:</strong> {profile.mobile}
//             </Typography>
//           </Box>

//           {/* Edit Profile Button */}
//           <IconButton
//             sx={{
//               position: "absolute",
//               top: 15,
//               right: 15,
//               bgcolor: "#fff",
//               color: "#0288d1",
//               border: "1px solid #0288d1",
//               transition: "all 0.3s ease-in-out",
//               "&:hover": {
//                 bgcolor: "#0288d1",
//                 transform: "rotate(360deg)",
//                 color: "#fff",
//               },
//             }}
//             onClick={handleEditOpen}
//           >
//             <EditIcon />
//           </IconButton>

//           {/* Forgot Password Button */}
//           <Button
//             variant="contained"
//             size="small"
//             startIcon={<LockResetIcon />}
//             sx={{
//               position: "absolute",
//               bottom: 15,
//               right: 15,
//               mt: 3,
//               bgcolor: "#fff",
//               border: "1px solid #0288d1",
//               color: "#0288d1",
//               fontWeight: "bold",
//               borderRadius: "25px",
//             }}
//             onClick={handleForgotPassword}
//           >
//             Forgot Password
//           </Button>
//         </Paper>

//         {/* Edit Profile Dialog */}

//         <Dialog open={openEdit} onClose={handleEditClose}>
//           <DialogTitle>Edit Profile</DialogTitle>
//           <DialogContent>
//             <TextField
//               margin="dense"
//               name="username"
//               label="Username"
//               fullWidth
//               value={editData.username}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="email"
//               label="Email"
//               disabled
//               fullWidth
//               value={editData.email}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="dense"
//               name="mobile"
//               label="Mobile"
//               fullWidth
//               value={editData.mobile}
//               onChange={handleChange}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleEditClose} variant="outlined" color="error">
//               Cancel
//             </Button>
//             <Button onClick={handleSave} variant="contained" color="primary">
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </Box>
//   );
// };

// export default Profile;

// import React, { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Paper,
//   Container,
//   Avatar,
// } from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { styled } from "@mui/system";
// // import axiosInstance from "./axiosConfig";

// const ProfileWrapper = styled("div")({
//   height: "100vh",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   background: "linear-gradient(to right, #252ed6, #8fb3fb)",
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
//   backgroundColor: "#0324fc",
// });

// const StyledButton = styled(Button)({
//   marginTop: "20px",
//   padding: "10px",
//   fontSize: "16px",
//   backgroundColor: "#0324fc",
//   "&:hover": {
//     backgroundColor: "#1d05a6",
//   },
// });

// function Profile({ onLogout }) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState(""); // Email is shown but not editable
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (userData) {
//       setName(userData.name);
//       setEmail(userData.email); // Email is read-only
//     }
//   }, []);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axiosInstance.put("/update-profile", {
//         name,
//         password,
//       });
//       alert("Profile updated successfully!");
//       localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), name }));
//     } catch (error) {
//       alert("Update failed: " + error.response?.data?.message || error.message);
//     }
//     setLoading(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     alert("Logged out successfully!");
//     onLogout();
//   };

//   return (
//     <ProfileWrapper>
//       <Container>
//         <StyledPaper elevation={6}>
//           <StyledAvatar>
//             <LockOutlinedIcon />
//           </StyledAvatar>
//           <Typography variant="h5" sx={{ margin: "10px 0" }}>
//             My Profile
//           </Typography>
//           <form onSubmit={handleUpdate}>
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
//               value={email}
//               disabled // Email cannot be changed
//             />
//             <TextField
//               label="New Password"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <StyledButton type="submit" variant="contained" fullWidth disabled={loading}>
//               {loading ? "Updating..." : "Update Profile"}
//             </StyledButton>
//           </form>
//           <StyledButton
//             variant="contained"
//             fullWidth
//             color="secondary"
//             onClick={handleLogout}
//           >
//             Logout
//           </StyledButton>
//         </StyledPaper>
//       </Container>
//     </ProfileWrapper>
//   );
// }

// export default Profile;

import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ArrowBack } from "@mui/icons-material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  // Get user details from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Default User",
    email: "user@example.com",
    mobile: "0000000000",
    role: "User",
  };

  // Load profile from localStorage
  const [profile, setProfile] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser || { name: "", role: "", email: "", mobile: "" };
  });

  // Extract initials safely
  const getInitials = (name) => {
    if (!name) return "U"; // Default to 'U' if name is missing
    const nameParts = name.split(" ");
    return nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      : nameParts[0][0].toUpperCase();
  };
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: storedUser.name,
    password: "",
  });

  useEffect(() => {
    setProfile(storedUser);
  }, []);

  // Handle Edit Dialog Open/Close
  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  // Handle Input Change
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save Changes
  const handleSave = () => {
    const updatedProfile = { ...profile, name: editData.name };
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setOpenEdit(false);
  };

  // Forgot Password Handler
  const handleForgotPassword = () => {
    navigate("/forgotPassword");
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
          My Profile
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
          / Profile
        </Typography>
      </Box>
      <Container maxWidth="md" sx={{ mt: 5, fontFamily: "Poppins" }}>
        <Paper
          elevation={4}
          sx={{
            p: 4,
            background: "#fff",
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #0288d1",
            color: "#000",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Avatar
            sx={{
              width: 110,
              height: 110,
              margin: "auto",
              bgcolor: "#E3F2FD",
              border: "2px solid #0288d1",
              color: "#0288d1",
              fontSize: 36,
              fontWeight: "bold",
              boxShadow: "rgba(201, 228, 255, 0.39) 0px 8px 24px",
            }}
          >
            {getInitials(profile.name)}
          </Avatar>

          {/* Profile Details */}
          <Typography sx={{ mt: 2, fontWeight: "bold", fontSize: "22px" }}>
            {profile.name}
          </Typography>
          <Typography sx={{ mt: 1, fontSize: "18px", color: "grey" }}>
            {profile.role}
          </Typography>

          <hr />

          <Box sx={{ textAlign: "left", mt: 2, p: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                color: "#0288d1",
                marginBottom: "10px",
              }}
            >
              User Info:
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "5px" }}>
              <strong>Username:</strong> {profile.name}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "5px" }}>
              <strong>Email:</strong> {profile.email}
            </Typography>
            <Typography variant="body1">
              <strong>Mobile:</strong> {profile.mobile}
            </Typography>
          </Box>

          {/* Edit Profile Button */}
          <IconButton
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              bgcolor: "#fff",
              color: "#0288d1",
              border: "1px solid #0288d1",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                bgcolor: "#0288d1",
                transform: "rotate(360deg)",
                color: "#fff",
              },
            }}
            onClick={handleEditOpen}
          >
            <EditIcon />
          </IconButton>

          {/* Forgot Password Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<LockResetIcon />}
            sx={{
              position: "absolute",
              bottom: 15,
              right: 15,
              mt: 3,
              bgcolor: "#fff",
              border: "1px solid #0288d1",
              color: "#0288d1",
              fontWeight: "bold",
              borderRadius: "25px",
            }}
            onClick={handleForgotPassword}
          >
            Forgot Password
          </Button>

         
        </Paper>

        {/* Edit Profile Dialog */}
        <Dialog open={openEdit} onClose={handleEditClose}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="username"
              label="Username"
              fullWidth
              value={editData.name}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              disabled
              fullWidth
              value={profile.email}
            />
            <TextField
            margin="dense"
              name="password"
              label="New Password"
              type="password"
              fullWidth
              value={editData.password}
              onChange={handleChange}
            />
            <TextField
            margin="dense"
              name="password"
              label="Confirm Password"
              type="password"
              fullWidth
              value={editData.password}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} variant="outlined" color="error">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Profile;
