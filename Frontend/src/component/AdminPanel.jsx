import { useState, useEffect } from "react";
import React from "react";
import "../index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  // Navigate,
  // useLocation
} from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  // Container,
  Box,
  Avatar,
  // Typography,
  Tooltip,
  IconButton,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// logo
import blacklogo from "../assets/Logo/black.png";
import whitelogo from "../assets/Logo/white.png";
import smallLogo from "../assets/Logo/Small-Logo.png";
// css
import "../assets/Css/AdminPanel.css";
// icon
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { BsPersonVcardFill } from "react-icons/bs";
// icon
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import PersonIcon from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { FaEnvelope, FaBell } from "react-icons/fa";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Person2Icon from "@mui/icons-material/Person2";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

// pages
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Supplier from "../pages/Supplier/Supplier";
import AddSupplier from "../pages/Supplier/AddSupplier";
import EditSupplier from "../pages/Supplier/EditSupplier";
import SupplierDetails from "../pages/Supplier/SupplierDetails";
import SupplierLocation from "../pages/SupplierLocation";
import DoSoNumber from "../pages/Supplier/DoSoNumber";
import Company from "../pages/Company/Company";
import AddCompany from "../pages/Company/AddCompany";
import EditCompany from "../pages/Company/EditCompany";
import ViewCompany from "../pages/Company/ViewCompany";
import RoleManagment from "../pages/Role Managment/RoleManagment";
import EditRole from "../pages/Role Managment/EditRole";
import ViewRole from "../pages/Role Managment/ViewRole";
import AddRole from "../pages/Role Managment/AddRole";
import TeamManagment from "../pages/Team Mangement/TeamManagment";
import EmpManagment from "../pages/Team Mangement/EmpManagment";
import AddEmp from "../pages/Team Mangement/AddEmp";
import EditEmp from "../pages/Team Mangement/EditEmp";
import ViewEmp from "../pages/Team Mangement/ViewEmp";
import ManageAvaliblity from "../pages/ManageAvaliblity";
import TeamDetalis from "../pages/Team Mangement/TeamDetalis";
import Driver from "../pages/Driver/Driver";
import AddDriver from "../pages/Driver/AddDriver";
import EditDriver from "../pages/Driver/EditDriver";
import DriverDetalis from "../pages/Driver/DriverDetalis";
import Tanker from "../pages/Tanker/Tanker";
import AddTanker from "../pages/Tanker/AddTanker";
import EditTanker from "../pages/Tanker/EditTanker";
import ViewTanker from "../pages/Tanker/ViewTanker";
import Transpoter from "../pages/Transpoter/Transpoter";
import TankerNumber from "../pages/Transpoter/TankerNumber";
import AddTranspoter from "../pages/Transpoter/AddTranspoter";
import EditTranspoter from "../pages/Transpoter/EditTranspoter";
import TranspoterDetalis from "../pages/Transpoter/TranspoterDetalis";
import Pricesheet from "../pages/Pricesheet/Pricesheet";
import AddPricesheet from "../pages/Pricesheet/AddPricesheet";
import EditPricesheet from "../pages/Pricesheet/EditPricesheet";
import PricesheetDetalis from "../pages/Pricesheet/viewPricesheet";
import TranspotationCharge from "../pages/Pricesheet/TranspotationCharge";
import Commission from "../pages/Commision/Commission";
import AddCommision from "../pages/Commision/AddCommision";
import EditCommision from "../pages/Commision/EditCommision";
import Customer from "../pages/Customer/Customer";
import AddCustomer from "../pages/Customer/AddCustomer";
import EditCustomer from "../pages/Customer/EditCustomer";
import ViewCustomer from "../pages/Customer/ViewCustomer";
import ViewCustomerBank from "../pages/Customer/ViewCustomerBank";
import Order from "../pages/Order/Order";
import AddOrder from "../pages/Order/AddOrder";
import EditOrder from "../pages/Order/EditOrder";
import OrderDetali from "../pages/Order/OrderDetali";
import Login from "../Authentication/Login";
import Registration from "../Authentication/Registration";
import Profile from "../pages/AccountSetting/Profile";
import ForgotPassword from "../pages/AccountSetting/ForgotPassword";
import Demo from "../pages/Demo";
import TestComponent from "../pages/TestComponent";

import { useNavigate } from "react-router-dom";

function AdminPanel({ onLogout }) {
  const [isDark, setIsDark] = useState(false);
  const [logoSrc, setLogoSrc] = useState(blacklogo);
  const [iconColor, setIconColor] = useState("grey");
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    setLogoSrc(!isDark ? whitelogo : blacklogo);
    setIconColor(!isDark ? "#fff" : "grey");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isSidebarVisible, setSidebarVisible] = useState(true);

  // Sidebar Toggle Function
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // ---------------------------------------------------

  // const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user.role;

  // ---------------------------------------------------

  // profile
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage (or API)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setProfile(storedUser);
    }
  }, []);

  // Function to get initials (First letter of first and last name)
  const getInitials = (fullName) => {
    if (!fullName) return "U"; // Default if name is missing

    const words = fullName.split(" "); // Split name into words
    const firstInitial = words[0]?.charAt(0).toUpperCase() || "";
    const lastInitial =
      words.length > 1 ? words[1]?.charAt(0).toUpperCase() : "";

    return firstInitial + lastInitial || "U"; // Fallback to "U" if only one letter exists
  };

  return (
    <Router>
      <div
        className="d-flex"
        style={{ backgroundColor: isDark ? "#000" : "#f0f5f9" }}
      >
        {/* Sidebar */}
        <div
          className={`sidebar fixed-sidebar d-flex bg-white flex-column vh-auto ${
            isSidebarVisible ? "expanded-sidebar" : "collapsed-sidebar"
          }`}
          style={{
            width: isSidebarVisible ? "250px" : "80px",
            transition: "width 0.3s",
          }}
        >
          {/* Sidebar Header */}
          <h3
            className={`mb-3 text-truncate text-center mt-4 ${
              isSidebarVisible ? "" : "d-none"
            }`}
          >
            <img src={logoSrc} alt="Logo" width="120px" />
          </h3>
          <i
            className={`text-center fs-3 mb-4 ${
              isSidebarVisible ? "d-none" : ""
            }`}
          >
            <img src={smallLogo} alt="Small Logo" width="25px" />
          </i>

          {/* Sidebar Navigation */}
          <List>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/">
                <ListItemIcon>
                  <DashboardIcon
                    className="fs-4"
                    style={{ color: iconColor }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={{
                    display: isSidebarVisible ? "block" : "none",
                    marginLeft: "-15px",
                  }}
                />
              </ListItemButton>
            </ListItem>

            <Accordion
              expanded={expanded === "masterPanel"}
              onChange={handleAccordionChange("masterPanel")}
              sx={{ boxShadow: "none", border: "none" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: iconColor }} />}
                aria-controls="masterPanel-content"
                id="masterPanel-header"
                style={{
                  backgroundColor: isDark ? "#393939" : "#fff",
                  color: isDark ? "#fff" : "#000",
                }}
              >
                <AssignmentIndIcon
                  className="fs-4"
                  style={{ color: iconColor }}
                />

                <span
                  style={{
                    marginLeft: "22px",
                    display: isSidebarVisible ? "block" : "none",
                  }}
                >
                  Master
                </span>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  backgroundColor: isDark ? "#333" : "#fff",
                  color: isDark ? "#fff" : "#000",
                }}
              >
                <List>
                  {[
                    "Admin",
                    "Customer",
                    "Employee",
                    "Driver",
                    "Transporter",
                  ].includes(role) && (
                    <ListItem disablePadding>
                      <ListItemButton component={NavLink} to="/products">
                        <ListItemIcon>
                          <BsBoxSeam style={{ color: iconColor }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Products"
                          sx={{
                            display: isSidebarVisible ? "block" : "none",
                            marginLeft: "-15px",
                            color: iconColor,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )}

                  {[
                    "Admin",
                    "Customer",
                    "Employee",
                    "Driver",
                    "Transporter",
                  ].includes(role) && (
                    <ListItem disablePadding>
                      <ListItemButton component={NavLink} to="/supplier">
                        <ListItemIcon>
                          <MdOutlinePeopleAlt style={{ color: iconColor }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Suppliers"
                          sx={{
                            display: isSidebarVisible ? "block" : "none",
                            marginLeft: "-15px",
                            color: iconColor,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )}

                  {[
                    "Admin",
                    "Customer",
                    "Employee",
                    "Driver",
                    "Transporter",
                  ].includes(role) && (
                    <ListItem disablePadding>
                      <ListItemButton
                        component={NavLink}
                        to="/supplierLocation"
                      >
                        <ListItemIcon>
                          <FaLocationDot style={{ color: iconColor }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Supply Location"
                          sx={{
                            display: isSidebarVisible ? "block" : "none",
                            marginLeft: "-15px",
                            color: iconColor,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/company">
                  <ListItemIcon>
                    <PiBuildingOfficeFill
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Company"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/roleManagement">
                  <ListItemIcon>
                    <BsPersonVcardFill
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Role Management"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/teamManagement">
                  <ListItemIcon>
                    <Diversity3Icon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Team Management"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/employeeManagement">
                  <ListItemIcon>
                    <PeopleAltIcon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Employee Management"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/driver">
                  <ListItemIcon>
                    <CarCrashIcon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Driver"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/tanker">
                  <ListItemIcon>
                    <LocalShippingIcon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Tanker"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/transporter">
                  <ListItemIcon>
                    <DirectionsBusIcon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Transporters"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/pricesheet">
                  <ListItemIcon>
                    <RequestPageIcon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pricesheet"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/commission">
                  <ListItemIcon>
                    <CurrencyRupeeIcon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Commission"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/customer">
                  <ListItemIcon>
                    <Person2Icon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Customers"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {[
              "Admin",
              "Customer",
              "Employee",
              "Driver",
              "Transporter",
            ].includes(role) && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/order">
                  <ListItemIcon>
                    <StorefrontIcon
                      className="fs-4"
                      style={{ color: iconColor }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Orders"
                    sx={{
                      display: isSidebarVisible ? "block" : "none",
                      marginLeft: "-15px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </div>

        {/* Main Content */}

        <div
          className={`flex-grow-1 ${
            !isSidebarVisible ? "collapsed-sidebar" : ""
          }`}
        >
          {/* Top Navbar */}
          <nav className=" fixed-navbar navbar navbar-light bg-white shadow-sm px-4">
            <button className="btn fs-5" onClick={toggleSidebar}>
              <i
                className={`bi ${
                  isSidebarVisible ? "bi-list" : "bi-chevron-right"
                }`}
                style={{ color: iconColor }}
              ></i>
            </button>
            <div className="d-flex align-items-center justify-content-between">
              <Tooltip
                title={
                  isDark ? "Switch to Light Theme" : "Switch to Dark Theme"
                }
              >
                <IconButton onClick={toggleTheme} color="inherit">
                  {isDark ? (
                    <LightModeIcon /> // Dark theme, show Sun icon
                  ) : (
                    <DarkModeOutlinedIcon /> // Light theme, show Moon icon
                  )}
                </IconButton>
              </Tooltip>

              {/* Message Icon */}
              <Tooltip title="Messages">
                <IconButton color="inherit">
                  <FaEnvelope size={20} />
                </IconButton>
              </Tooltip>

              {/* Notification Icon */}
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <FaBell size={20} />
                </IconButton>
              </Tooltip>

              {/* user profile here */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35,
                        bgcolor: "primary.main",
                        fontSize: "16px",
                      }}
                    >
                      {profile?.name ? getInitials(profile.name) : "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem component={NavLink} to="/profile">
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem component={NavLink} to="/registration">
                  <ListItemIcon>
                    <PermContactCalendarIcon fontSize="small" />
                  </ListItemIcon>
                  Registration
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={onLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </nav>

          {/* Content Area */}
          <div
            className={`main-content ${isSidebarVisible ? "" : "collapsed"}`}
            style={{ height: "auto" }}
          >
            <Routes>
              <Route path="/testdata" element={<TestComponent />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/products" element={<Products />} /> */}

              {/* {(role === "Admin" ||
                role === "Customer" ||
                role === "Employee" ||
                role === "Driver" ||
                role === "Transporter") && ( */}
              <Route path="/products" element={<Products />} />
              {/* )} */}

              {/* supplier */}

              <Route path="/supplier" element={<Supplier />} />

              <Route path="/addsupplier" element={<AddSupplier />} />

              <Route path="/editsupplier/:id" element={<EditSupplier />} />

              <Route
                path="/supplierdetalils/:id"
                element={<SupplierDetails />}
              />

              <Route path="/supplierLocation" element={<SupplierLocation />} />

              <Route path="/manageAvaliblity" element={<ManageAvaliblity />} />

              <Route path="/DOSO_Number/:id" element={<DoSoNumber />} />

              {/* company */}
              <Route path="/company" element={<Company />} />
              <Route path="/addCompany" element={<AddCompany />} />
              <Route path="/editCompany/:id" element={<EditCompany />} />
              <Route path="/viewCompany/:id" element={<ViewCompany />} />
              {/* Role Managment */}
              <Route path="/roleManagement" element={<RoleManagment />} />
              <Route path="/addRoles" element={<AddRole />} />
              <Route path="/editRoles/:id" element={<EditRole />} />
              <Route path="/viewRoles/:id" element={<ViewRole />} />
              {/* team Mangment */}
              <Route path="/teamManagement" element={<TeamManagment />} />
              <Route path="/viewTeams/:id" element={<TeamDetalis />} />
              {/* Employee Management */}
              <Route path="/employeeManagement" element={<EmpManagment />} />
              <Route path="/addEmployee" element={<AddEmp />} />
              <Route path="/editEmployee/:id" element={<EditEmp />} />
              <Route path="/viewEmployee/:id" element={<ViewEmp />} />
              {/* Driver */}
              <Route path="/driver" element={<Driver />} />
              <Route path="/addDriver" element={<AddDriver />} />
              <Route path="/editDriver/:id" element={<EditDriver />} />
              <Route path="/viewDriver/:id" element={<DriverDetalis />} />
              {/* tanker */}
              <Route path="/tanker" element={<Tanker />} />
              <Route path="/addTanker" element={<AddTanker />} />

              <Route path="/editTanker/:id" element={<EditTanker />} />

              <Route path="/viewTanker/:id" element={<ViewTanker />} />
              {/* transpoter */}
              <Route path="/transporter" element={<Transpoter />} />
              <Route path="/tankerNumber/:id" element={<TankerNumber />} />
              <Route path="/addTranspoter" element={<AddTranspoter />} />
              <Route
                path="/add-transporter/Company-Details/:uuid"
                element={<AddTranspoter />}
              />
              <Route
                path="/add-transporter/Contact-Details/:uuid"
                element={<AddTranspoter />}
              />
              <Route
                path="/add-transporter/Vehicle-Details/:uuid"
                element={<AddTranspoter />}
              />
              <Route
                path="/add-transporter/Document-Details/:uuid"
                element={<AddTranspoter />}
              />
              <Route
                path="/add-transporter/Bank-Details/:uuid"
                element={<AddTranspoter />}
              />
              <Route path="/editTranspoter/:id" element={<EditTranspoter />} />

              <Route
                path="/viewTranspoter/:id"
                element={<TranspoterDetalis />}
              />
              {/* pricesheet */}
              <Route path="/pricesheet" element={<Pricesheet />} />
              <Route path="/addPricesheet" element={<AddPricesheet />} />
              <Route path="/editPricesheet/:id" element={<EditPricesheet />} />
              <Route
                path="/viewPricesheet/:id"
                element={<PricesheetDetalis />}
              />
              <Route
                path="/transpotationCharge"
                element={<TranspotationCharge />}
              />
              {/* commision */}
              <Route path="/commission" element={<Commission />} />
              <Route path="/addCommission" element={<AddCommision />} />
              <Route path="/editCommission" element={<EditCommision />} />
              {/* <Route path="/viewCommission" element={<View Commision />} /> */}
              {/* Customer */}
              <Route path="/customer" element={<Customer />} />
              <Route path="/addCustomer" element={<AddCustomer />} />
              <Route
                path="/add-customer/Company-Details/:uuid"
                element={<AddCustomer />}
              />
              <Route
                path="/add-customer/Contact-Details/:uuid"
                element={<AddCustomer />}
              />
              <Route
                path="/add-customer/General-Details/:uuid"
                element={<AddCustomer />}
              />
              <Route
                path="/add-customer/Sapcode-Details/:uuid"
                element={<AddCustomer />}
              />
              <Route
                path="/add-customer/Bank-Details/:uuid"
                element={<AddCustomer />}
              />
              <Route path="/editCustomer/:uuid" element={<EditCustomer />} />
              <Route path="/viewCustomer/:id" element={<ViewCustomer />} />
              <Route
                path="/ViewCustomerBank/:id"
                element={<ViewCustomerBank />}
              />
              {/* Order */}
              <Route path="/order" element={<Order />} />
              <Route path="/addOrder" element={<AddOrder />} />
              <Route path="/editOrder/:id" element={<EditOrder />} />
              <Route path="/editOrder/:id/update-doso/:tankerId" element={<EditOrder />} />
              <Route path="/orderDetali" element={<OrderDetali />} />
              <Route path="*" element={<h1>Page Not Found</h1>} />
              {/* account setting */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/demo" element={<Demo />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default AdminPanel;

//<Routes>
// <Route path="/testdata" element={<TestComponent />} />
// <Route path="/login" element={<Login />} />
// <Route path="/" element={<Dashboard />} />
//
// {/* Routes accessible to Admin (all routes) */}
// {role === "Admin" && (
//   <>
//     {/* here show all routess */}
//   </>
// )}
//
// {/* Routes accessible to Customer */}
// {role === "Customer" && (
//   <>
//    {/* selected Routes */}
//   </>
// )}
//
// {/* Routes accessible to Employee */}
// {role === "Employee" && (
//   <>
//     {/* selected routes */}
//   </>
// )}
//
// {/* Account Settings */}
// <Route path="/profile" element={<Profile />} />
// <Route path="/forgotPassword" element={<ForgotPassword />} />
// <Route path="/demo" element={<Demo />} />
//
// {/* Fallback Route */}
// <Route path="*" element={<h1>Page Not Found</h1>} />
// </Routes>
