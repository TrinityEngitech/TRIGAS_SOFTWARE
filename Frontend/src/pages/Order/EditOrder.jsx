import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const initialSteps = [
  "Tanker Allocation",
  "DO/SO Generation",
  "Tanker Reached",
  "Tanker Loading",
  "Tanker Status",
  "Tanker Dispatched",
  "Tanker Delivered",
  "Tanker Unloaded",
];

function EditOrder() {
  const [activeStep, setActiveStep] = useState(0); // Track active step in the initial stepper
  const [isTankerSectionVisible, setTankerSectionVisible] = useState(false); // Control tanker section visibility
  const [tankerList, setTankerList] = useState([
    { id: 1, activeStep: 0, completed: [] },
  ]); // Track tanker details with steps

  // Order Detalis step
  const handleInitialNext = () => {
    if (activeStep === 2) {
      setTankerSectionVisible(true);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleInitialBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleInitialStepClick = (step) => {
    if (step <= activeStep) {
      setActiveStep(step);
    }
  };

  // Tanker Detalis step
  // Add a new tanker
  const handleAddTanker = () => {
    const newTanker = {
      id: tankerList.length + 1,
      activeStep: 0,
      completed: [],
    };
    setTankerList([...tankerList, newTanker]);
  };

  // Remove a tanker
  const handleRemoveTanker = (id) => {
    setTankerList(tankerList.filter((tanker) => tanker.id !== id));
  };

  const handleTankerNext = (id) => {
    setTankerList(
      tankerList.map((tanker) =>
        tanker.id === id
          ? {
              ...tanker,
              activeStep: tanker.activeStep + 1,
              completed: [...tanker.completed, tanker.activeStep],
            }
          : tanker
      )
    );
  };

  const handleTankerBack = (id) => {
    setTankerList(
      tankerList.map((tanker) =>
        tanker.id === id
          ? { ...tanker, activeStep: Math.max(tanker.activeStep - 1, 0) }
          : tanker
      )
    );
  };

  // Handle click navigation for tanker steps
  const handleTankerStepClick = (id, step) => {
    setTankerList(
      tankerList.map((tanker) =>
        tanker.id === id && step <= tanker.activeStep
          ? { ...tanker, activeStep: step }
          : tanker
      )
    );
  };

  const navigate = useNavigate();
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
          Order Detalis
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
          / Order Detalis
        </Typography>
      </Box>

      {/* Initial Order Stepper */}
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginTop: "30px",
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {[
            "Booked",
            "Payment Details",
            "Payment Credited/Approved",
            "Order Delivered",
          ].map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Button
                  onClick={() => handleInitialStepClick(index)}
                  disabled={index > activeStep} // Lock future steps
                  sx={{
                    textTransform: "none",
                    color: activeStep === index ? "primary.main" : "inherit",
                  }}
                >
                  {label}
                </Button>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Order Details Content */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {
              [
                "Booking Details",
                "Payment Details",
                "Payment Credited/Approved",
                "Order Delivered",
              ][activeStep]
            }
          </Typography>

          <Grid container spacing={2}>
            {activeStep === 0 && (
              <>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Customer</InputLabel>
                      <Select label="Supplier Name" name="" required>
                        <MenuItem value="Customer 1">Customer 1</MenuItem>
                        <MenuItem value="Customer 1">Customer 1</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Supplier</InputLabel>
                      <Select label="Supplier" name="" required>
                        <MenuItem value="Supplier 1">Supplier 1</MenuItem>
                        <MenuItem value="Supplier 2">Supplier 2</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Supply Location</InputLabel>
                      <Select label="Supply Location" name="" required>
                        <MenuItem value="Supply Location 1">
                          Supply Location 1
                        </MenuItem>
                        <MenuItem value="Supply Location 1">
                          Supply Location 1
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Product</InputLabel>
                      <Select label="Product" name="" required>
                        <MenuItem value="Product 1">Product 1</MenuItem>
                        <MenuItem value="Product 1">Product 1</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Quantity(MT)"
                      name=""
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Team</InputLabel>
                      <Select label="Team" name="" required>
                        <MenuItem value="Team 1">Team 1</MenuItem>
                        <MenuItem value="Team 1">Team 1</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Created by</InputLabel>
                      <Select label="Created by" name="" required>
                        <MenuItem value="Created by 1">Created by 1</MenuItem>
                        <MenuItem value="Created by 1">Created by 1</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Order Number"
                      name=""
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Order Date & Time"
                      name=""
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Booked Date & Time"
                      name=""
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {activeStep === 1 && (
              <>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Upload File"
                      fullWidth
                      type="file"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Payment Date"
                      fullWidth
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Amount" fullWidth type="text" />
                  </Grid>
                </Grid>
              </>
            )}

            {activeStep === 2 && (
              <>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1">Uploaded File:</Typography>
                    <Box
                      sx={{
                        width: 150,
                        height: 150,
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        mt: 1,
                      }}
                    >
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmz5NwyjG56A7v7-Ksom3O_sbwdy8R4dT4tQ&s"
                        alt="Uploaded File"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1">Payment Date:</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      16 Jan 2025
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1">Amount:</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      ₹5,00,000.00
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle1">Payment:</Typography>
                    <Button variant="outlined" color="success">
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ marginLeft: "5px" }}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}

            {activeStep === 3 && (
              <>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Reference Number" fullWidth type="text" />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField label="Remark" fullWidth type="text" />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={handleInitialBack}
            >
              Back
            </Button>
            <Button variant="outlined" onClick={handleInitialNext}>
              {activeStep === 2
                ? "Go to Tanker Details"
                : activeStep === 3
                ? "Finish"
                : "Continue"}
            </Button>
          </Box>
        </Box>
      </Box>
      {/* Tanker Details Content  */}

      {isTankerSectionVisible && (
        <Box
          sx={{
            background: "#fff",
            borderRadius: "20px",
            padding: "30px",
            marginTop: "30px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "25px" }}>
              Tanker Details
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTanker}
              sx={{ mt: 3 }}
            >
              Add Tanker
            </Button>
          </Box>

          {tankerList.map((tanker) => (
            <Accordion key={tanker.id} defaultExpanded={tanker.id === 1}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${tanker.id}-content`}
                id={`panel${tanker.id}-header`}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%", // Ensures the box takes full width of the AccordionSummary
                  }}
                >
                  {/* Tanker Title */}
                  <Typography variant="h6">Tanker {tanker.id}</Typography>

                  {/* Close Button */}
                  {tanker.id > 1 && (
                    <Button
                      variant="outlined"
                      onClick={() => handleRemoveTanker(tanker.id)}
                      color="error"
                      size="small"
                      sx={{
                        // ml: "auto", // Pushes the button to the far right
                        display: "flex",
                        alignItems: "center",
                        marginRight:"5px"
                      }}
                    >
                      <CloseIcon />
                      <Typography
                        variant="outlined"
                        
                        sx={{
                          // ml: 1,
                          color: "error.main",
                          fontWeight: "bold"
                        }}
                      >
                        CLOSE
                      </Typography>
                    </Button>
                  )}
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Stepper
                  activeStep={tanker.activeStep}
                  alternativeLabel
                  sx={{ mb: 4 }}
                >
                  {[
                    "Tanker Allocation",
                    "DO/SO Generation",
                    "Tanker Reached",
                    "Tanker Loading",
                    "Tanker Status",
                    "Tanker Dispatched",
                    "Tanker Delivered",
                    "Tanker Unloaded",
                  ].map((label, index) => (
                    <Step key={label}>
                      <StepLabel>
                        <Button
                          onClick={() =>
                            handleTankerStepClick(tanker.id, index)
                          }
                          disabled={index > tanker.activeStep}
                          sx={{
                            textTransform: "none",
                            color:
                              tanker.activeStep === index
                                ? "primary.main"
                                : "inherit",
                          }}
                        >
                          {label}
                        </Button>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    {
                      [
                        "Tanker Allocation",
                        "DO/SO Generation",
                        "Tanker Reached",
                        "Tanker Loading",
                        "Tanker Status",
                        "Tanker Dispatched",
                        "Tanker Delivered",
                        "Tanker Unloaded",
                      ][tanker.activeStep]
                    }
                  </Typography>
                  {tanker.activeStep === 0 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel>Transpoter</InputLabel>
                            <Select label="Transpoter" name="" required>
                              <MenuItem value="Transpoter 1">
                                Transpoter 1
                              </MenuItem>
                              <MenuItem value="Transpoter 2">
                                Transpoter 2
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel>Tanker Number</InputLabel>
                            <Select label="Tanker Number" name="" required>
                              <MenuItem value="Tanker Number 1">
                                Tanker Number 1
                              </MenuItem>
                              <MenuItem value="Tanker Number 2">
                                Tanker Number 2
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel>Tanker Capacity</InputLabel>
                            <Select label="Tanker Capacity" name="" required>
                              <MenuItem value="Tanker Capacity 1">
                                Tanker Capacity 1
                              </MenuItem>
                              <MenuItem value="Tanker Capacity 2">
                                Tanker Capacity 2
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Driver Number"
                            name=""
                            required
                          />
                        </Grid>
                      </Grid>
                      <FormControlLabel
                        value="end"
                        control={<Checkbox />}
                        label="Tanker GPS Tracking"
                        labelPlacement="end"
                      />
                    </>
                  )}
                  {tanker.activeStep === 1 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="DO/SO Number"
                            name=""
                            required
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {tanker.activeStep === 2 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="datetime-local"
                            label=" Date & Time"
                            name="startingStockDateTime"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {tanker.activeStep === 3 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="datetime-local"
                            label=" Date & Time"
                            name="startingStockDateTime"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {tanker.activeStep === 4 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Invoice Weight(Tons)"
                            name=""
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Button variant="outlined" color="success">
                            Tanker Loaded
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ marginLeft: "5px" }}
                          >
                            Tanker Reject
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {tanker.activeStep === 5 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="datetime-local"
                            label=" Date & Time"
                            name="startingStockDateTime"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {tanker.activeStep === 6 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="datetime-local"
                            label=" Date & Time"
                            name="startingStockDateTime"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {tanker.activeStep === 7 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="datetime-local"
                            label=" Date & Time"
                            name="startingStockDateTime"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 3,
                    }}
                  >
                    <Button
                      variant="outlined"
                      disabled={tanker.activeStep === 0}
                      onClick={() => handleTankerBack(tanker.id)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleTankerNext(tanker.id)}
                      disabled={tanker.activeStep === initialSteps.length - 1}
                    >
                      {tanker.activeStep === initialSteps.length - 1
                        ? "Finish"
                        : "Continue"}
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
      {/* Tanker Details Content  */}
    </Box>
  );
}

export default EditOrder;
