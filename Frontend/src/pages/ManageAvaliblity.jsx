import React, { useState } from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion"; // Import this
import MuiAccordionSummary from "@mui/material/AccordionSummary"; // Import this
import MuiAccordionDetails from "@mui/material/AccordionDetails"; // Import this
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

// Customized Accordion Components
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid #CFE2FF`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "#CFE2FF",
  border:"1px solid #CFE2FF",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const ManageAvaliblity = () => {
    const navigate = useNavigate();
  const [availability, setAvailability] = useState({
    Propane: { Reliance: true, HPCL: true, BPCL: false, Adani: true },
    LPG: {},
    Butane: {},
  });

  const handleToggle = (category, supplier) => {
    setAvailability((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [supplier]: !prev[category][supplier],
      },
    }));
  };

  return (
    <Box sx={{ p: 3, height:"100vh" }}>
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
         Manage Avaliblity
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
          /  Manage Avaliblity
        </Typography>
      </Box>

      {/* Customized Accordions */}
      {["Propane", "LPG", "Butane"].map((category) => (
        <Accordion
          key={category}
          defaultExpanded={category === "Propane"}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            aria-controls={`${category}-content`}
            id={`${category}-header`}
          >
            <Typography variant="h6">{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {category === "Propane" ? (
              <List>
                {Object.keys(availability.Propane).map((supplier) => (
                  <ListItem key={supplier} disablePadding>
                    <Grid container alignItems="center">
                      {/* Supplier Name */}
                      <Grid item xs={1}>
                        <ListItemText primary={supplier} />
                      </Grid>

                      {/* Switch */}
                      <Grid item xs={1} container justifyContent="flex-end">
                        <Switch
                          edge="end"
                          checked={availability.Propane[supplier]}
                          onChange={() => handleToggle("Propane", supplier)}
                        />
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No suppliers available for {category}.</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ManageAvaliblity;
