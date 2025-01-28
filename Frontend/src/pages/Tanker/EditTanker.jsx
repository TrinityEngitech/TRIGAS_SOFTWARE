import { useState, useEffect } from "react";
// import axios from "axios";
import {
  TextField,
  Grid,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack, Add, Delete } from "@mui/icons-material";
import { FaEye } from "react-icons/fa";
import axiosInstance from "../../Authentication/axiosConfig";

function EditTanker() {
  const { id } = useParams(); // Get the tanker ID from the URL
  const navigate = useNavigate();

  const [fetchproducts, setFetchProducts] = useState([]);
  const [fetchdrivers, setFetchDrivers] = useState([]);
  const [fetchTransporters, setFetchTransporters] = useState([]);

  const [document, setDocument] = useState([
    { documentType: "", validFrom: "", validUpto: "", documentFile: "" },
  ]);

  const [documentList, setDocumentList] = useState([
    { documentType: "", validFrom: "", validUpto: "", documentFile: "" },
  ]);
  // console.log(documentList);
  
  const [tankerData, setTankerData] = useState({
    transporterName: "",
    tankerNumber: "",
    licenseCapacity: "",
    driverName: "",
    product: "",
    grossWeight: "",
    tareWeight: "",
    chassisNumber: "",
    engineNumber: "",
    numberOfAxle: "",
  });

  useEffect(() => {

    axiosInstance.get("/products/")
  .then((response) => {
    console.log("Products fetched:", response.data);
    setFetchProducts(response.data);    
  })
  .catch((err) => console.error("Error fetching products:", err));

axiosInstance.get("/drivers/")
  .then((response) => {
    console.log("Drivers fetched:", response.data);
    setFetchDrivers(response.data);
  })
  .catch((err) => console.error("Error fetching drivers:", err));


  
axiosInstance.get("/transporters/")
.then((response) => {
  console.log("transporter fetched:", response.data);
  setFetchTransporters(response.data);
})
.catch((err) => console.error("Error fetching transporter:", err));


    axiosInstance
      .get(`/tankers/${id}`)
      .then((response) => {
        // Set the fetched data to state
        if (response.data) {
          setTankerData(response.data);
          setDocumentList(response.data.documents || []); // Set documents if available
        }
      })
      .catch((err) => {
        console.error("Error fetching tanker data:", err);
      });
  }, [id]);
  

  
  console.log(tankerData);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [productsResponse, driversResponse,tankerResponse] = await Promise.all([
  //         axiosInstance.get("/products/"),
  //         axiosInstance.get("/drivers/"),
  //         axiosInstance.get(`/tankers/${id}`)
  //       ]);

  //       console.log(driversResponse);

  //       // Validate and set products
  //       if (Array.isArray(productsResponse.data)) {
  //         setFetchProducts(productsResponse.data);
  //       } else {
  //         console.error("Products response data is not an array");
  //       }

  //       // Validate and set locations
  //       if (Array.isArray(driversResponse.data)) {
  //         setFetchDrivers(driversResponse.data);
  //       } else {
  //         console.error("drivers response data is not an array");
  //       }


  //         // Set tanker data for editing
  //       if (tankerResponse.data) {
  //         setTankerData(tankerResponse.data);
  //         setDocumentList(tankerResponse.data.documents || []);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [id]);
  
  
  
console.log("driver",fetchdrivers);
console.log("product",fetchproducts);
console.log("transporter",fetchTransporters);



  // Handle changes in tanker details
  const handleTankerChange = (field, value) => {
    setTankerData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const documentValidityPeriods = {
    "PUC (Pollution Under Control)": ["6 months", "1 year"], // 6 months, 1 year
    Insurance: 12, // 1 year
    "CLL (Carriers Legal Liability)": 12, // 1 year
    "Road Tax": ["3 months", "6 months", "1 year", "lifetime"],
    Permit: ["5 years", "8 years"], // 5 years, 8 years (in months)
    "Fitness Certificate (Rule 62)": ["1 year", "2 years"], // 1 year, 2 years
    GPS: 12, // 1 year
    "RC Book (Registration Certificate)": "lifetime", // Lifetime validity
    "Rule 18": 12, // 1 year
    "Rule 9 (PESO Licence)": [
      "1 year",
      "2 years",
      "3 years",
      "4 years",
      "5 years",
    ], // 1 to 5 years (in months)
    "COC (Rule 13)": "lifetime", // Lifetime validity
    "Rule 43": "lifetime", // Lifetime validity
    "Rule 19": 60, // 5 year
    "Mounting Drawing": "lifetime", // Lifetime validity
    "Fabrication Drawing": "lifetime", // Lifetime validity
    "Fire Extinguisher": 12, // 1 year
  };

  const handledocumentChange = (index, field, value) => {
    setDocument((prevDocs) => {
      const updatedDocs = [...prevDocs];
      updatedDocs[index][field] = value;

      const validity = documentValidityPeriods[updatedDocs[index].documentType];

      // Handle "documentType" change
      if (field === "documentType") {
        // Check if the selected document type requires a dropdown
        if (
          [
            "PUC (Pollution Under Control)",
            "Fitness Certificate (Rule 62)",
            "Permit",
            "Rule 9 (PESO Licence)",
            "Road Tax",
          ].includes(value)
        ) {
          updatedDocs[index].validityPeriod = ""; // Reset validity period for dropdown selection
          updatedDocs[index].validUpto = ""; // Reset `validUpto`
        } else if (
          typeof validity === "number" &&
          updatedDocs[index].validFrom
        ) {
          const validFromDate = new Date(updatedDocs[index].validFrom);
          validFromDate.setMonth(validFromDate.getMonth() + validity);
          updatedDocs[index].validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        } else {
          updatedDocs[index].validUpto = "2999-12-31"; // Default for "lifetime"
        }
      }

      // Handle "validFrom" change
      if (field === "validFrom" && updatedDocs[index].documentType) {
        if (typeof validity === "number") {
          const validFromDate = new Date(value);
          validFromDate.setMonth(validFromDate.getMonth() + validity);
          updatedDocs[index].validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        }
      }

      // Handle "validityPeriod" change
      if (field === "validityPeriod") {
        if (value === "lifetime") {
          updatedDocs[index].validUpto = "2999-12-31";
        } else {
          const validFromDate = new Date(updatedDocs[index].validFrom);
          const [amount, unit] = value.split(" ");
          if (unit === "months") {
            validFromDate.setMonth(validFromDate.getMonth() + parseInt(amount));
          } else if (unit === "year" || unit === "years") {
            validFromDate.setFullYear(
              validFromDate.getFullYear() + parseInt(amount)
            );
          }
          updatedDocs[index].validUpto = validFromDate
            .toISOString()
            .split("T")[0];
        }
      }

      return updatedDocs;
    });
  };

  // Add a new document
  const adddocument = () => {
    setDocument([
      ...document,
      { documentType: "", validFrom: "", validUpto: "", documentFile: "" },
    ]);
  };

  // Remove a document
  const removedocument = (index) => {
    const updateddocument = document.filter((_, i) => i !== index);
    setDocument(updateddocument);
  };

  // Handle form submission for saving updated tanker data
  const handleSave = async () => {
    const tankerDetails = {
      transporterName: tankerData.transporterName,
      tankerNumber: tankerData.tankerNumber,
      licenseCapacity: tankerData.licenseCapacity,
      driverName: tankerData.driverName,
      product: tankerData.product,
      grossWeight: tankerData.grossWeight,
      tareWeight: tankerData.tareWeight,
      chassisNumber: tankerData.chassisNumber,
      engineNumber: tankerData.engineNumber,
      numberOfAxle: tankerData.numberOfAxle,
      documents: document.map((doc) => ({
        documentType: doc.documentType,
        validFrom: doc.validFrom,
        validUpto: doc.validUpto,
        documentFile: doc.documentFile,
      })),
    };

    try {
      const formData = new FormData();

      // Append text fields
      formData.append("transporterName", tankerDetails.transporterName);
      formData.append("tankerNumber", tankerDetails.tankerNumber);
      formData.append("licenseCapacity", tankerDetails.licenseCapacity);
      formData.append("driverName", tankerDetails.driverName);
      formData.append("product", tankerDetails.product);
      formData.append("grossWeight", tankerDetails.grossWeight);
      formData.append("tareWeight", tankerDetails.tareWeight);
      formData.append("chassisNumber", tankerDetails.chassisNumber);
      formData.append("engineNumber", tankerDetails.engineNumber);
      formData.append("numberOfAxle", tankerDetails.numberOfAxle);

      // Append documents as JSON string
      formData.append("documents", JSON.stringify(tankerDetails.documents));

      // Append document files
      document.forEach((doc) => {
        if (doc.documentFile instanceof File) {
          formData.append("documents", doc.documentFile);
        }
      });

      const response = await axiosInstance.put(`/tankers/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/tanker");
      } else {
        alert("Failed to update tanker details");
      }
    } catch (error) {
      console.error("Error updating tanker details:", error);
      alert("Error updating tanker details");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/tankers/documents/${id}`);
      if (response.status === 200) {
        alert("Document deleted successfully");
        // Update your state to remove the deleted document
        setDocumentList((prevList) => prevList.filter((doc) => doc.id !== id));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete the document.");
    }
  };

  return (
    <Box p={3}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button variant="text" color="primary" onClick={() => navigate(-1)}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", ml: 1 }}>
          Edit Tanker
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ color: "grey.600", mb: 5, marginLeft: "60px" }}
        >
          Dashboard / Edit Tanker
        </Typography>
      </Box>
      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginTop: "30px",
        }}
      >
        <form>
          <Typography
            className="fs-4"
            sx={{ marginBottom: "25px", fontWeight: "500" }}
          >
            Tanker Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              {/* <TextField
                fullWidth
                label="Transporter Name"
                value={tankerData.transporterName}
                onChange={(e) =>
                  handleTankerChange("transporterName", e.target.value)
                }
                required
                name="transporterName"
              /> */}
              <FormControl fullWidth>
                <InputLabel>Transporter Name</InputLabel>
                <Select
                  label="transporterName"
                  value={tankerData.transporterName}
                  onChange={(e) =>
                    handleTankerChange("transporterName", e.target.value)
                  }
                  name="transporterName"
                  required
                >
                  {fetchTransporters.map((transporter, index) => (
                    <MenuItem key={index} value={transporter.transporterName}>
                      {transporter.transporterName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tanker Number"
                value={tankerData.tankerNumber}
                onChange={(e) =>
                  handleTankerChange("tankerNumber", e.target.value)
                }
                required
                name="tankerNumber"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="License Capacity(Tons)"
                value={tankerData.licenseCapacity}
                onChange={(e) =>
                  handleTankerChange("licenseCapacity", e.target.value)
                }
                required
                name="licenseCapacity"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Driver</InputLabel>
                <Select
                  label="Driver"
                  value={tankerData.driverName}
                  onChange={(e) =>
                    handleTankerChange("driverName", e.target.value)
                  }
                  name="driverName"
                  required
                >
                  {fetchdrivers.map((driver, index) => (
                    <MenuItem key={index} value={driver.name}>
                      {driver.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  label="Product Name"
                  value={tankerData.product}
                  onChange={(e) =>
                    handleTankerChange("product", e.target.value)
                  }
                  name="product"
                  required
                >
                  {fetchproducts.map((product, index) => (
                    <MenuItem key={index} value={product.productName}>
                      {product.productName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Laden/Gross Weight"
                value={tankerData.grossWeight}
                onChange={(e) =>
                  handleTankerChange("grossWeight", e.target.value)
                }
                required
                name="grossWeight"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="UnLaden/Tare Weight"
                value={tankerData.tareWeight}
                onChange={(e) =>
                  handleTankerChange("tareWeight", e.target.value)
                }
                required
                name="tareWeight"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Chassis Number"
                value={tankerData.chassisNumber}
                onChange={(e) =>
                  handleTankerChange("chassisNumber", e.target.value)
                }
                required
                name="chassisNumber"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Engine Number"
                value={tankerData.engineNumber}
                onChange={(e) =>
                  handleTankerChange("engineNumber", e.target.value)
                }
                required
                name="engineNumber"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Number of Axle</InputLabel>
                <Select
                  label="Number of Axle"
                  value={tankerData.numberOfAxle}
                  onChange={(e) =>
                    handleTankerChange("numberOfAxle", e.target.value)
                  }
                  required
                  name="numberOfAxle"
                >
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Document Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "50px",
              marginBottom: "10px",
            }}
          >
            <Typography
              className="fs-4"
              sx={{ marginBottom: "20px", fontWeight: "500" }}
            >
              Document Details
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={adddocument}
              sx={{
                height: "40px",
                minWidth: "100px",
              }}
            >
              Add Document
            </Button>
          </Box>
          {document.map((tanker, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }} // Adds spacing between dynamically rendered fields
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flex: 1,
                }}
              >
                <FormControl fullWidth sx={{ flex: 1 }}>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    label="Document Type"
                    name="documentType"
                    value={tanker.documentType || ""}
                    onChange={(e) =>
                      handledocumentChange(
                        index,
                        "documentType",
                        e.target.value
                      )
                    }
                  >
                    {Object.keys(documentValidityPeriods).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Valid From"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={document[index]?.validFrom || ""}
                  onChange={(e) =>
                    handledocumentChange(index, "validFrom", e.target.value)
                  }
                  name="validFrom"
                  sx={{ flex: 1 }}
                />
                {documentValidityPeriods[tanker.documentType] &&
                  Array.isArray(
                    documentValidityPeriods[tanker.documentType]
                  ) && (
                    <FormControl fullWidth sx={{ flex: 1 }}>
                      <InputLabel>Validity Period</InputLabel>
                      <Select
                        label="Validity Period"
                        name="validityPeriod"
                        value={tanker.validityPeriod || ""}
                        onChange={(e) =>
                          handledocumentChange(
                            index,
                            "validityPeriod",
                            e.target.value
                          )
                        }
                      >
                        {documentValidityPeriods[tanker.documentType].map(
                          (option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}
                <TextField
                  label="Valid Upto"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={document[index]?.validUpto || ""}
                  onChange={(e) =>
                    handledocumentChange(index, "validUpto", e.target.value)
                  }
                  name="validUpto"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ flex: 1 }}
                />

                <TextField
                  type="file"
                  label="Document"
                  InputLabelProps={{
                    shrink: true, // Ensures the label remains visible when a file is selected
                  }}
                  onChange={(e) => {
                    const file = e.target.files[0]; // Get the file
                    handledocumentChange(index, "documentFile", file); // Update the state with the file
                  }}
                  sx={{ flex: 1 }}
                  name="documentFile"
                />
              </Box>

              {/* Remove Button */}
              <IconButton
                onClick={() => {
                  removedocument(index); // Only remove if there's more than one bank entry
                }}
                sx={{
                  backgroundColor: "#cf0202",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: document.length === 1 ? "none" : "flex", // Hide button when there's only one bank entry
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  marginLeft: "16px", // Space between the fields and the button
                  cursor: "pointer", // Always pointer when visible
                  "&:hover": {
                    backgroundColor: "#cf0202",
                  },
                }}
              >
                <i className="bi bi-x"></i>
              </IconButton>
            </Box>
          ))}
        </form>
        {/* Action Buttons */}
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate("/tanker")}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "30px",
          marginTop: "50px",
        }}
      >
        <Typography
          className="fs-4"
          sx={{ marginBottom: "20px", fontWeight: "500" }}
        >
          Document List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            {/* Table Head */}
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  S.No
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Valid From
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Valid Upto
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Document Type
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            {/* Table Body */}
            <TableBody>
              {documentList.map((doc, index) => (
                <TableRow key={doc.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{doc.documentType}</TableCell>
                  <TableCell align="center">
                    {new Date(doc.validFrom).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(doc.validUpto).toLocaleDateString()}
                  </TableCell>
                  {/* <TableCell align="center">{tanker.action}</TableCell> */}
                  <TableCell align="center">
                    {/* <Link to="">
                      <IconButton color="dark">
                        <FaEye />
                      </IconButton>
                    </Link> */}
                    <a
                      href={`http://localhost:3000/uploads/${doc.documentFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconButton color="dark">
                        <FaEye />
                      </IconButton>
                    </a>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default EditTanker;
