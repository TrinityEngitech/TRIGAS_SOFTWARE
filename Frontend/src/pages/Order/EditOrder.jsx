import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
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
import axiosInstance from "../../Authentication/axiosConfig"; // Import the custom Axios instance
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";

const initialSteps = [
  "Tanker Allocation",
  "DO/SO Generation",
  "Tanker Reporting",
  "Tanker Loading",
  "Tanker Status",
  "Tanker Dispatched",
  "Intermediate Location",
  "Tanker Delivered",
  "Tanker Unloaded",
];

function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ----------- ORDER DETAIL FETCH ----------------------------------

  const [currentCustomer, setCurrentCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("currentCustomer", currentCustomer);
  // order book
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/orders/${id}`
      ); // Use axios to fetch data
      console.log(response.data);

      setCurrentCustomer(response.data);
      setSelectedTransporter(response.data.transporterName); // Set selected transporter from order data
      setSelectedTanker(response.data.tanker);
      setSelectedTransporter(response.data.transporterName || "");

      // Set the tanker data properly
      // setFilteredTankers(response.data.orderTankers || []);// Set selected tanker from order data
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };
  // ----------- ORDER DETAIL FETCH ----------------------------------

  // --------------------- ORDER BOOKED------------------------------------
  const [bookedDateTime, setBookedDateTime] = useState("");
  const [initialBookedDateTime, setInitialBookedDateTime] = useState("");

  const handleDateChange = (event) => {
    setBookedDateTime(event.target.value); // Update state with selected date
  };

  useEffect(() => {
    if (currentCustomer?.orderBookDateTime) {
      const dateTime = new Date(currentCustomer.orderBookDateTime);
      const localDateTime = dateTime.toISOString().slice(0, 16); // Extract YYYY-MM-DDTHH:MM format
      setBookedDateTime(localDateTime);
      setInitialBookedDateTime(localDateTime); // Store original value
    }
  }, [currentCustomer]);

  const updateBookedDateTime = async () => {
    if (!bookedDateTime) {
      console.error("Error: orderBookDateTime is required.");
      return;
    }

    if (bookedDateTime === initialBookedDateTime) {
      console.log("No changes detected, skipping API call.");
      handleInitialNext(); // Move to next step without calling API
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/${id}/orderBookDateTime`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderBookDateTime: new Date(bookedDateTime).toISOString(), // Convert to full ISO format
          }),
        }
      );

      // Check if the response is empty
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        return;
      }

      // Parse the response data
      const data = await response.json();
      // console.log("Success:", data.message);

      // Check if the response contains a success message
      if (response.ok) {
        console.log(data.message); // Success message from backend
        setCurrentCustomer((prev) => ({
          ...prev,
          orderBookDateTime: new Date(bookedDateTime).toISOString(),
        }));
        setInitialBookedDateTime(bookedDateTime); // Update stored initial value

        handleInitialNext();

        // You can proceed to the next step here if needed
      } else {
        console.error("Failed to update:", data.message);
      }
    } catch (error) {
      console.error("Error updating orderBookDateTime:", error);
    }
  };
  // --------------------- ORDER BOOKED------------------------------------

  // ------------------- PAYMENT DDETALIS--------------------------------
  const [paymentApproved, setPaymentApproved] = useState(null); // null = not decided, true = approved, false = rejected
  // const [submittedPaymentDateTime, setSubmittedPaymentDateTime] = useState("");
  

  useEffect(() => {
    if (currentCustomer && currentCustomer.payments?.length > 0) {
      const latestPayment = currentCustomer.payments[0];

      const formattedDateTime = latestPayment.paymentDateTime
        ? new Date(latestPayment.paymentDateTime).toISOString().slice(0, 16) // Format to 'YYYY-MM-DDTHH:MM'
        : "";
    
      setPaymentDetails((prev) => ({
        paymentUTR: latestPayment.paymentUTR || "",
        paymentDateTime: prev.paymentDateTime || formattedDateTime, // Keep existing value if already set
        paymentAmount: latestPayment.paymentAmount || "",
        paymentSlipImage: latestPayment.paymentSlipImage || "",
      }));
      setPaymentApproved(latestPayment.paymentStatus === "Payment Credited");
    }
    setLoading(false); // Set loading to false once data is fetched

  }, [currentCustomer]);

  // payment
  const [paymentDetails, setPaymentDetails] = useState({
    paymentUTR: "",
    paymentDateTime: "",
    paymentAmount: "",
    customerName: "", // Default value for now
    customerId: "", //
  });
  useEffect(() => {
    if (currentCustomer) {
      setPaymentDetails((prev) => ({
        ...prev,
        customerId: currentCustomer.id,
        customerName: currentCustomer.companyName,
      }));
    }
  }, [currentCustomer]);
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  console.log("Customer ID:", currentCustomer?.customerId);
  console.log("Customer Name:", currentCustomer?.customerName);

  // const handlePaymentSubmit = async () => {
  //   handleInitialNext();
  
  //   if (!file) {
  //     setError("Please upload a payment slip image.");
  //     return;
  //   }
  
  //   const formattedPaymentDateTime = new Date(paymentDetails.paymentDateTime).toISOString();
  
  //   const formData = new FormData();
  //   formData.append("paymentSlipImage", file);
  //   formData.append("paymentUTR", paymentDetails.paymentUTR);
  //   formData.append("paymentDateTime", formattedPaymentDateTime);
  //   formData.append("paymentAmount", paymentDetails.paymentAmount);
  //   formData.append("customerName", currentCustomer?.customerName || "");
  //   formData.append("customerId", currentCustomer?.id || "");
  
  //   // **Log all data before sending**
  //   console.log("🚀 Sending Payment Data:");
  //   console.log("paymentUTR:", paymentDetails.paymentUTR);
  //   console.log("paymentDateTime:", formattedPaymentDateTime);
  //   console.log("paymentAmount:", paymentDetails.paymentAmount);
  //   console.log("customerName:", currentCustomer?.customerName);
  //   console.log("customerId:", currentCustomer?.id);
  //   console.log("paymentSlipImage File:", file);
  
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:3000/api/orders/${id}/payment/create`,
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );
  
  //     if (response.status === 200 || response.status === 201) {
  //       console.log("✅ Payment created successfully!", response.data);
  
  //       // Update the state with the uploaded image URL
  //       setPaymentDetails((prev) => ({
  //         ...prev,
  //         paymentSlipImage: response.data.payment.paymentSlipImage, // Update UI
  //       }));
  
  //       const updatedCustomerData = await axios.get(
  //         `http://localhost:3000/api/orders/${currentCustomer.id}`
  //       );
  //       setCurrentCustomer(updatedCustomerData.data);
  //     } else {
  //       setError("Failed to submit payment.");
  //       console.log("❌ Response Error:", response);
  //     }
  //   } catch (err) {
  //     setError("Failed to submit payment.");
  //     console.error("❌ Error submitting payment:", err);
  //   }
  // };
  
  
  const handlePaymentSubmit = async () => {
    if (!file) {
      setError("Please upload a payment slip image.");
      return;
    }
  
    if (!currentCustomer || !currentCustomer.customerId) {
      setError("Customer ID is missing. Please select a valid customer.");
      console.error("❌ Missing Customer ID:", currentCustomer);
      return;
    }
  
    const customerId = currentCustomer.customerId || currentCustomer.id;
    console.log("✅ Final Customer ID Before Submit:", customerId);
  
    const formattedPaymentDateTime = new Date(paymentDetails.paymentDateTime).toISOString();
  
    const formData = new FormData();
    formData.append("paymentSlipImage", file);
    formData.append("paymentUTR", paymentDetails.paymentUTR);
    formData.append("paymentDateTime", formattedPaymentDateTime);
    formData.append("paymentAmount", paymentDetails.paymentAmount);
    formData.append("customerName", currentCustomer?.customerName || "");
    formData.append("customerId", customerId);
  
    console.log("🚀 Sending Payment Data:");
    console.log("customerId:", customerId);
  
    try {
      const response = await axios.post(
        `http://localhost:3000/api/orders/${id}/payment/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      if (response.status === 200 || response.status === 201) {
        console.log("✅ Payment created successfully!", response.data);
  
        // Update state with the new payment data (no need to refetch from API)
        setPaymentDetails((prev) => ({
          ...prev,
          paymentSlipImage: response.data.payment.paymentSlipImage, // Update UI with new image
        }));
        
  
        // Navigate to next step after submission
        handleInitialNext();
  
      } else {
        setError("Failed to submit payment.");
        console.log("❌ Response Error:", response);
      }
    } catch (err) {
      setError("Failed to submit payment.");
      console.error("❌ Error submitting payment:", err);
    }
  };
  
  


   // -------------------- PAYMENT APPROVED --------------------------------
   useEffect(() => {
    if (!currentCustomer || !currentCustomer.id) return;
  
    // Instead of fetching by order id directly, you can use payments if needed
    const latestPayment = currentCustomer.payments?.[0]; // Get the latest payment
  
    if (latestPayment) {
      // Set the payment status based on the latest payment
      const status = latestPayment.paymentStatus;
      if (status === "Payment Credited") {
        setPaymentApproved(true);
      } else if (status === "Payment Rejected") {
        setPaymentApproved(false);
      } else {
        setPaymentApproved(null); // Ensure it remains null if no status is found
      }
      setPaymentProcessed(status !== undefined && status !== null); // Only processed if status exists
    }
  }, [currentCustomer]);
  
  

 
   const [paymentProcessed, setPaymentProcessed] = useState(false); // Track if payment is approved/rejected



  // payment status update
  const handlePaymentStatusChange = async (paymentStatus) => {
    // setLoading(true);
    // setError(null);

    if (!currentCustomer || !currentCustomer.id) {
      setError("Customer data is missing.");
      return;
    }
    const orderId = currentCustomer.id; // This is the customer's order ID
    console.log("Order ID:", orderId);

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/orders/${id}/payment/update-status`, // Replace with your backend URL
        { id: orderId, paymentStatus }
      );

      // Handle success
      console.log(response.data);
      setPaymentApproved(paymentStatus); // Update the payment status in state
      setPaymentProcessed(true); // Hide buttons after selection

      // You can show a success message or update the UI state accordingly
    } catch (err) {
      setError("Failed to update payment status.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- PAYMENT APPROVED --------------------------------

  // -------------------- TANKER ALLOCATED --------------------------------


  const [selectedTransporter, setSelectedTransporter] = useState("");
  const [filteredTankers, setFilteredTankers] = useState([]);
  const [selectedTanker, setSelectedTanker] = useState(null);
  const [driverNumber, setDriverNumber] = useState("");
  const [transporter, setTransporter] = useState([]);

  const [orderTankers, setOrderTankers] = useState([]);
  
  const fetchOrderTankerDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3000/api/orders/${id}`
      );

      if (response.data && response.data.orderTankers) {
        setOrderTankers(response.data.orderTankers);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("Failed to fetch order details. Please try again.");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      fetchOrderTankerDetails();
    }
  }, [id]);

  console.log("Fetched orderTankers:", orderTankers);

  useEffect(() => {
    // Function to fetch transporters from the API
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get("/transporters/");
        console.log(response.data || []);
        setTransporter(response.data); // Store transporters data in state
      } catch (error) {
        console.error("Error fetching transporters:", error);
        alert("Failed to fetch transporters. Please try again.");
      }
    };

    fetchSuppliers(); // Fetch transporters when component mounts
  }, []);

  console.log("Transporters:", transporter);

  // Handle Transporter Change
  const handleTransporterChange = (event) => {
    const transporterName = event.target.value;
    setSelectedTransporter(transporterName);

    // Find the transporter's tankers
    const transporterData = transporter.find(
      (t) => t.transporterName === transporterName
    );
    setFilteredTankers(transporterData ? transporterData.tankers : []);
    setSelectedTanker(null); // Reset tanker selection
  };

  // Handle Tanker Change
  const handleTankerChange = (event) => {
    const tankerNumber = event.target.value;
    const selectedTankerData = filteredTankers.find(
      (t) => t.tankerNumber === tankerNumber
    );
    setSelectedTanker(selectedTankerData || null);
  };
  // Effect to fetch data when component mounts
  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleTankerAllocation = async (orderId) => {
    console.log("orderId:", orderId); // Debugging

    if (!selectedTransporter || !selectedTanker || !driverNumber) {
      alert(
        "Please select a transporter, tanker, and provide a driver number!"
      );
      return;
    }

    const requestBody = {
      transporterName: selectedTransporter,
      tankerCapacity: selectedTanker.licenseCapacity,
      tankerNumber: selectedTanker.tankerNumber,
      driverName: selectedTanker.driverName,
      driverNumber: driverNumber, // Use user-entered driver number
      tankerGPS: selectedTanker.tankerGPS || "Not Available",
    };

    const tankerId = requestBody.tankerNumber;

    console.log("requestBody", requestBody);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/orders/${id}/orderTanker/allocation`,
        requestBody
      );

      if (response.status === 201) {
        alert("Tanker allocated successfully!");
        handleTankerNext(orderId); // Update the activeStep
        navigate(`/editOrder/${id}/update-doso/${tankerId}`);
      }
    } catch (error) {
      console.error("Error allocating tanker:", error);
      alert("Failed to allocate tanker. Try again.");
    }
  };


  
  // -------------------- TANKER ALLOCATED --------------------------------

  //-------------------- DOSO GENREATE --------------------------------
  const [dosoNumber, setDosoNumber] = useState("");

  const { tankerId } = useParams();

  const handleTankerDOSO = async (dosoNumber) => {
    if (!dosoNumber) {
      alert("Please enter the DO/SO Number!");
      return;
    }

    try {
      const response = await axios.put(
        // `http://localhost:3000/api/orders/${id}/orderTanker/allocation`,
        `http://localhost:3000/api/orders/5/orderTanker/update-doso/${tankerId}`,
        { tankerDosoNumber: dosoNumber }
      );

      if (response.status === 200) {
        alert("DO/SO Number updated successfully!");
      }
    } catch (error) {
      console.error("Error updating DO/SO number:", error);
      alert("Failed to update DO/SO Number. Try again.");
    }
  };
  //-------------------- DOSO GENREATE --------------------------------

  // ---------------------------- STEPS----------------------------------------------------
  const [activeStep, setActiveStep] = useState(0); // Track active step in the initial stepper

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

  const [isTankerSectionVisible, setTankerSectionVisible] = useState(false); // Control tanker section visibility
  const [tankerList, setTankerList] = useState([
    { id: 1, activeStep: 0, completed: [] },
  ]); // Track tanker details with steps

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

  const handleTankerNext = (tankerId) => {
    setTankerList((prevTankers) =>
      prevTankers.map((tanker) =>
        tanker.id === tankerId
          ? {
              ...tanker,
              activeStep: tanker.activeStep === 8 ? 8 : tanker.activeStep + 1,
            }
          : tanker
      )
    );

    // Reset Order activeStep to 3 when tanker reaches last step (8)
    if (tankerList.find((t) => t.id === tankerId)?.activeStep === 8) {
      setActiveStep(3);
      // Scroll to the top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
  // ---------------------------- STEPS----------------------------------------------------

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
                {/* <form> */}
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Customer</InputLabel>
                      <Select
                        label="Customer"
                        value={currentCustomer?.customerName || ""}
                        disabled
                      >
                        <MenuItem value={currentCustomer?.customerName || ""}>
                          {currentCustomer?.customerName || "Loading..."}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Supplier</InputLabel>
                      <Select
                        label="Supplier"
                        value={currentCustomer?.supplierName || ""}
                        disabled
                      >
                        <MenuItem value={currentCustomer?.supplierName || ""}>
                          {currentCustomer?.supplierName || "Loading..."}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Supply Location</InputLabel>
                      <Select
                        label="Supply Location"
                        value={currentCustomer?.supplyLoadingPoint || ""}
                        disabled
                      >
                        <MenuItem
                          value={currentCustomer?.supplyLoadingPoint || ""}
                        >
                          {currentCustomer?.supplyLoadingPoint || "Loading..."}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Product</InputLabel>
                      <Select
                        label="Product"
                        value={currentCustomer?.productName || ""}
                        disabled
                      >
                        <MenuItem value={currentCustomer?.productName || ""}>
                          {currentCustomer?.productName || "Loading..."}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Quantity(MT)"
                      name="productQuantity"
                      value={currentCustomer?.productQuantity || ""}
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Order Date & Time"
                      name="orderDateTime"
                      value={
                        currentCustomer?.orderDateTime
                          ? new Date(currentCustomer.orderDateTime)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Booked Date & Time"
                      name="orderBookDateTime"
                      onChange={handleDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={bookedDateTime} // Set value from state
                    />
                  </Grid>
                </Grid>
                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                    width: "100%",
                  }}
                >
                  <Button
                    variant="outlined"
                    disabled={activeStep === 0}
                    onClick={handleInitialBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="outlined"
                    type="submit"
                    onClick={updateBookedDateTime}
                  >
                    Continue
                  </Button>
                </Box>
                {/* </form> */}
              </>
            )}

            {activeStep === 1 && (
              <>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Upload File"
                      fullWidth
                      type="file"
                      name="paymentSlipImage"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // value={file ? file.name : ""} // Display file name if it exists
                      onChange={handleFileChange}
                    />
                    {file && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Selected File:</strong> {file.name}
                      </Typography>
                    )}

                    {/* If the paymentSlipImage is already present in paymentDetails, show it */}
                    {paymentDetails.paymentSlipImage && !file && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Uploaded Image:</strong>{" "}
                        {paymentDetails.paymentSlipImage}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="UTR Number"
                      name="paymentUTR"
                      fullWidth
                      type="text"
                      value={paymentDetails.paymentUTR}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Payment Date"
                      fullWidth
                      type="datetime-local"
                      name="paymentDateTime"
                      value={paymentDetails.paymentDateTime}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Amount"
                      value={paymentDetails.paymentAmount}
                      fullWidth
                      name="paymentAmount"
                      type="text"
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                    width: "100%",
                  }}
                >
                  <Button variant="outlined" onClick={handleInitialBack}>
                    Back
                  </Button>
                  <Button
                    variant="outlined"
                    type="submit"
                    onClick={handlePaymentSubmit}
                  >
                    Continue
                  </Button>
                </Box>
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
                      <a
                        href={`http://localhost:3000/${paymentDetails.paymentSlipImage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <img
                          src={`http://localhost:3000/${paymentDetails.paymentSlipImage}`}
                          alt="Payment Slip"
                          style={{
                            width: "100px",
                            height: "100px",
                            cursor: "pointer",
                          }}
                        />
                      </a>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle1">Payment Date:</Typography>

                    {/* Date */}
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {paymentDetails.paymentDateTime
                        ? new Date(
                            paymentDetails.paymentDateTime
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Not Available"}
                    </Typography>

                    {/* Time */}
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {paymentDetails.paymentDateTime
                        ? new Date(
                            paymentDetails.paymentDateTime
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                        : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle1">Amount:</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      ₹{paymentDetails.paymentAmount.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle1">UTR Number:</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {paymentDetails.paymentUTR}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
    <Typography variant="subtitle1">Payment:</Typography>

    
      <>
        {/* <Button
          variant="outlined"
          disabled={loading}
          onClick={() => handlePaymentStatusChange(true)}
          color="primary"
        >
          {loading ? "Approving..." : "Approve"}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => handlePaymentStatusChange(false)}
          sx={{ marginLeft: "5px" }}
          disabled={loading}
        >
          {loading ? "Rejecting..." : "Reject"}
        </Button>
        {paymentApproved !== null && (
          <Typography variant="body1" sx={{ marginTop: "10px", fontWeight: "bold" }}>
            {paymentApproved ? "Payment Credited" : "Payment Rejected"}
          </Typography>
        )} */}
        {!paymentProcessed || paymentApproved === null ? (  // Show buttons only when status is unknown
  <>
    <Button
      variant="outlined"
      disabled={loading}
      onClick={() => handlePaymentStatusChange(true)}
      color="primary"
    >
      {loading ? "Approving..." : "Approve"}
    </Button>

    <Button
      variant="outlined"
      color="error"
      onClick={() => handlePaymentStatusChange(false)}
      sx={{ marginLeft: "5px" }}
      disabled={loading}
    >
      {loading ? "Rejecting..." : "Reject"}
    </Button>
  </>
) : (
  <Typography
    variant="body1"
    sx={{
      marginTop: "10px",
      fontWeight: "bold",
      color: paymentApproved ? "green" : "red",
    }}
  >
    {paymentApproved ? "Payment Credited ✅" : "Payment Rejected ❌"}
  </Typography>
)}      </>
    
  </Grid>
                </Grid>
                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                    width: "100%",
                  }}
                >
                  <Button variant="outlined" onClick={handleInitialBack}>
                    Back
                  </Button>
                  <Button variant="outlined"
                  disabled={!paymentApproved} // Initially disabled, enabled only if payment is credited
                   onClick={handleInitialNext}>
                    Go to Tanker Details
                  </Button>
                </Box>
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
                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                    width: "100%",
                  }}
                >
                  <Button variant="outlined" onClick={handleInitialBack}>
                    Back
                  </Button>
                  <Button variant="outlined" onClick={handleInitialNext}>
                    Finish
                  </Button>
                </Box>
              </>
            )}
          </Grid>
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
                        marginRight: "5px",
                      }}
                    >
                      <CloseIcon />
                      <Typography
                        variant="outlined"
                        sx={{
                          // ml: 1,
                          color: "error.main",
                          fontWeight: "bold",
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
                    "Tanker Reporting",
                    "Tanker Loading",
                    "Tanker Status",
                    "Tanker Dispatched",
                    "Intermediate Location",
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
                        "Tanker Reporting",
                        "Tanker Loading",
                        "Tanker Status",
                        "Tanker Dispatched",
                        "Intermediate Location",
                        "Tanker Delivered",
                        "Tanker Unloaded",
                      ][tanker.activeStep]
                    }
                  </Typography>
                  {tanker.activeStep === 0 && (
                   <>
                   <Grid container spacing={1}>
                     {/* Transporter Selection */}
                     <Grid item xs={12} sm={4}>
                       <FormControl fullWidth>
                         <InputLabel>Transporter</InputLabel>
                         <Select
                           label="Transporter"
                           name="transporterName"
                           value={selectedTransporter || currentCustomer?.orderTankers?.[0]?.transporterName || ""}
                           onChange={handleTransporterChange}
                           required
                         >
                           {transporter.map((t) => (
                             <MenuItem key={t.id} value={t.transporterName}>
                               {t.transporterName}
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                     </Grid>
                 
                     {/* Tanker Number Selection */}
                     <Grid item xs={12} sm={4}>
                       <FormControl fullWidth>
                         <InputLabel>Tanker Number</InputLabel>
                         <Select
                           label="Tanker Number"
                           name="tankerNumber"
                           value={selectedTanker?.tankerNumber || currentCustomer?.orderTankers?.[0]?.tankerNumber || ""}
                           onChange={handleTankerChange}
                           required
                         >
                           {filteredTankers.length > 0 ? (
                             filteredTankers.map((tanker) => (
                               <MenuItem key={tanker.id} value={tanker.tankerNumber}>
                                 {tanker.tankerNumber}
                               </MenuItem>
                             ))
                           ) : (
                             <MenuItem disabled>No tankers available</MenuItem>
                           )}
                         </Select>
                       </FormControl>
                     </Grid>
                 
                     {/* Tanker Capacity */}
                     <Grid item xs={12} sm={4}>
                       <FormControl fullWidth>
                         <InputLabel>Tanker Capacity</InputLabel>
                         <Select
                           label="Tanker Capacity"
                           name="tankerCapacity"
                           value={selectedTanker?.licenseCapacity || currentCustomer?.orderTankers?.[0]?.tankerCapacity || ""}
                           required
                           disabled={!selectedTanker}
                         >
                           {selectedTanker || currentCustomer?.orderTankers?.length ? (
                             <MenuItem value={selectedTanker?.licenseCapacity || currentCustomer?.orderTankers?.[0]?.tankerCapacity}>
                               {selectedTanker?.licenseCapacity || currentCustomer?.orderTankers?.[0]?.tankerCapacity}
                             </MenuItem>
                           ) : (
                             <MenuItem disabled>Select a tanker first</MenuItem>
                           )}
                         </Select>
                       </FormControl>
                     </Grid>
                 
                     {/* Driver Name */}
                     <Grid item xs={12} sm={4}>
                       <TextField
                         fullWidth
                         label="Driver Name"
                         name="driverName"
                         value={selectedTanker?.driverName || currentCustomer?.orderTankers?.[0]?.driverName || ""}
                         required
                         InputProps={{ readOnly: true }}
                         helperText={selectedTanker ? "" : "Select a tanker first"}
                         error={!selectedTanker}
                       />
                     </Grid>
                 
                     {/* Driver Number */}
                     <Grid item xs={12} sm={4}>
                       <TextField
                         fullWidth
                         label="Driver Number"
                         name="driverNumber"
                         value={driverNumber || currentCustomer?.orderTankers?.[0]?.driverNumber || ""}
                         onChange={(e) => setDriverNumber(e.target.value)}
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
                 
                   {/* Buttons */}
                   <Box
                     sx={{
                       display: "flex",
                       justifyContent: "space-between",
                       mt: 3,
                     }}
                   >
                     <Button variant="outlined" disabled>
                       Back
                     </Button>
                 
                     <Button
                       variant="outlined"
                       type="button"
                       onClick={(e) => {
                         e.preventDefault();
                         handleTankerAllocation(
                           selectedTanker?.id || currentCustomer?.orderTankers?.[0]?.id,
                           selectedTanker?.tankerNumber || currentCustomer?.orderTankers?.[0]?.tankerNumber
                         );
                       }}
                       disabled={!selectedTransporter || !selectedTanker || !driverNumber}
                     >
                       Continue
                     </Button>
                   </Box>
                 </>
                 
                  )}  

                  {tanker.activeStep === 1 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="DO/SO Number"
                            name="dosoNumber"
                            value={dosoNumber}
                            onChange={(e) => setDosoNumber(e.target.value)}
                            required
                          />
                        </Grid>
                      </Grid>

                      {/* Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerBack(tanker.id)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleTankerDOSO(tanker.id, dosoNumber)
                          }
                        >
                          Continue
                        </Button>
                      </Box>
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
                      {/*  Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerBack(tanker.id)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerNext(tanker.id)}
                        >
                          Continue
                        </Button>
                      </Box>
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
                      {/*  Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerBack(tanker.id)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerNext(tanker.id)}
                        >
                          Continue
                        </Button>
                      </Box>
                    </>
                  )}

                  {tanker.activeStep === 4 && (
                    <>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Remark"
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
                      {/*  Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerBack(tanker.id)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerNext(tanker.id)}
                        >
                          Continue
                        </Button>
                      </Box>
                    </>
                  )}

                  {tanker.activeStep === 5 && (
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
                      {/*  Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerBack(tanker.id)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerNext(tanker.id)}
                        >
                          Continue
                        </Button>
                      </Box>
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
                      {/*  Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerBack(tanker.id)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerNext(tanker.id)}
                        >
                          Continue
                        </Button>
                      </Box>
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
                      {/*  Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerBack(tanker.id)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerNext(tanker.id)}
                        >
                          Continue
                        </Button>
                      </Box>
                    </>
                  )}

                  {tanker.activeStep === 8 && (
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
                      {/*  Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerBack(tanker.id)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleTankerNext(tanker.id)}
                        >
                          Finish
                        </Button>
                      </Box>
                    </>
                  )}
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
