import { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, Link, useParams } from "react-router-dom";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axios from "axios";
import logo from "../../assets/Logo/black.png";
import no from "../../assets/Logo/no.png";
import check from "../../assets/Logo/check.png";
import axiosInstance from "../../Authentication/axiosConfig";

import { handleDownloadImage } from "./imageUtils";

const ViewPricesheet = () => {
  const navigate = useNavigate();
  const [priceSheet, setPriceSheet] = useState({
    data: [],
    city: "",
    effectiveDate: "",
    effectiveTime: "",
  });
  const [loading, setLoading] = useState(true); // Loading state to show while fetching data
  const [error, setError] = useState(null); // Error state for handling API errors
  const { id } = useParams(); // Get the id from the URL params
  const sheetRef = useRef(null); // Always define this at the top level

  useEffect(() => {
    if (sheetRef.current) {
      console.log("Sheet reference is working:", sheetRef.current);
    }
  }, []);

  useEffect(() => {
    const fetchPricesheetData = async () => {
      setLoading(true); // Start loading before fetching
      try {
        const response = await axiosInstance.get(`/price-sheets/${id}`); // Fetch with the dynamic `id`

        // Update all state values in one go
        setPriceSheet({
          data: response.data.data, // Set the actual data array
          city: response.data.city, // Set the city
          effectiveDate: response.data.effectiveDate, // Set the effective date
          effectiveTime: response.data.effectiveTime, // Set the effective time
        });
      } catch (err) {
        setError("Error fetching data");
        console.error("Error fetching price sheet data:", err);
      } finally {
        setLoading(false); // Set loading to false after the fetch
      }
    };

    if (id) {
      fetchPricesheetData(); // Fetch data only if `id` is available
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box p={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
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
              View Pricesheet
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
              / View Pricesheet
            </Typography>
          </Box>
        </Box>

        <Box>
          <Box mt={5} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ bgcolor: "#fff" }}
              onClick={() => handleDownloadImage(sheetRef)}
            >
              <FileDownloadIcon className="fs-5" /> Download
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px 20px 30px 20px",
        }}
        ref={sheetRef}
      >
        {/* <Box ref={useRef(null)}> */}
        <Box>
          <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={logo}
              alt="Company Logo"
              style={{ width: "250px", height: "auto", margin: "10px 0px" }}
            />
            <Box
              sx={{
                backgroundColor: "#f3b234",
                color: "black",
                padding: "10px",
              }}
            >
              <Typography variant="h6" fontSize={19}>
                {`PROPANE/LPG RATES FROM VARIOUS COMPANIES FOR `}
                <span
                  style={{
                    color: "darkblue",
                    textTransform: "uppercase",
                    fontWeight: "500",
                  }}
                >
                  {priceSheet.city}
                </span>
                {` CERAMIC INDUSTRIES EFFECTIVE FROM  DT:  `}
                <span style={{ color: "darkblue", textTransform: "uppercase" }}>
                  <span
                    style={{ color: "darkblue", textTransform: "uppercase" }}
                  >
                    {new Date(priceSheet.effectiveDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}{" "}
                    {/* Time: {new Date(priceSheet.effectiveDate).getHours()}(HR) */}
                  </span>
                </span>
                {`Time:`}
                <span style={{ color: "darkblue", textTransform: "uppercase" }}>
                  <span>{priceSheet.effectiveTime} </span>
                </span>
              </Typography>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="price sheet table">
              <TableHead>
                <TableRow>
                  {[
                    "SR.NO.",
                    "COMPANY",
                    "PRODUCT",
                    "NCV(Kcal/kg)",
                    "LOADING POINT",
                    "BASIC",
                    "GST (18%)",
                    "TRANSPORT",
                    "BASIC LANDED",
                    "AVAILABILITY",
                    "CHANGES",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        border: "1px solid black",
                        backgroundColor: "#e0e0e0",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {priceSheet.data.length > 0 ? (
                  priceSheet.data
                    .sort((a, b) => {
                      if (a.productSequence !== b.productSequence) {
                        return a.productSequence - b.productSequence;
                      }
                      if (a.basicLanded !== b.basicLanded) {
                        return a.basicLanded - b.basicLanded;
                      }
                      if (
                        a.supplierName === "IOCL" &&
                        b.supplierName !== "IOCL"
                      ) {
                        return -1;
                      }
                      if (
                        a.supplierName !== "IOCL" &&
                        b.supplierName === "IOCL"
                      ) {
                        return 1;
                      }
                      return a.supplierName.localeCompare(b.supplierName);
                    })
                    .map((entry, index) => (
                      <TableRow key={index}>
                        {[
                          index + 1,
                          entry.supplierName,
                          entry.productName,
                          entry.cv,
                          entry.loadingPoint,
                          entry.basicPrice,
                          parseFloat(entry.gst).toFixed(2),
                          entry.transportCharge,
                          parseFloat(entry.basicLanded).toFixed(2),
                          entry.availableStatus ? (
                            <Chip
                              // color="success"
                              icon={
                                <img
                                  src={check} // Replace with the actual path to your "Available" icon
                                  alt="Available Icon"
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                    borderRadius: "50%",
                                    background: "transparent",
                                  }}
                                />
                              }
                              size="small"
                              sx={{
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                borderRadius: "8px",
                                fontSize: "14px",
                                padding: "5px 10px",
                                color: "#fff",
                                background: "#fff",
                                display: "flex",
                                alignItems: "center",
                                "& .MuiChip-icon": {
                                  background: "transparent", // Remove any default background applied by Material-UI
                                },
                              }}
                            />
                          ) : (
                            <Chip
                              // color="error"
                              icon={
                                <img
                                  src={no} // Replace with the actual path to your "Not Available" icon
                                  alt="Not Available Icon"
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                    borderRadius: "50%",
                                    background: "transparent",
                                  }}
                                />
                              }
                              size="small"
                              sx={{
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                borderRadius: "8px",
                                fontSize: "14px",
                                padding: "5px 10px",
                                background: "#fff",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                "& .MuiChip-icon": {
                                  background: "transparent", // Remove any default background applied by Material-UI
                                },
                              }}
                            />
                          ),

                          entry.comparison,
                        ].map((cell, i) => (
                          // <TableCell
                          //   key={i}
                          //   sx={{
                          //     border: "1px solid black",
                          //     textAlign: "center",
                          //     color:
                          //       i === 10 && entry.comparison?.includes("વધારો")
                          //         ? "green"
                          //         : i === 10 &&
                          //           entry.comparison?.includes("ઘટાડો થયો")
                          //         ? "red"
                          //         : "inherit", // Only change color for the CHANGES column
                          //   }}
                          // >
                          //   {/* Show arrows before the value only in the CHANGES column */}
                          //   {i === 10 ? (
                          //     <>
                          //       {entry.comparison?.includes("વધારો") && (
                          //         <ArrowUpward
                          //           sx={{
                          //             mr: 0.5,
                          //             color: "green",
                          //             fontSize: "20px",
                          //           }}
                          //         />
                          //       )}
                          //       {entry.comparison?.includes("ઘટાડો થયો") && (
                          //         <ArrowDownward
                          //           sx={{
                          //             mr: 0.5,
                          //             color: "red",
                          //             fontSize: "20px",
                          //           }}
                          //         />
                          //       )}
                          //       {typeof cell === "string" &&
                          //       cell.includes("/TON")
                          //         ? `${parseInt(
                          //             cell.split("/TON")[0],
                          //             10
                          //           )}/TON ${cell.split("/TON")[1]}`
                          //         : cell}
                          //     </>
                          //   ) : (
                          //     cell // Render other cells normally
                          //   )}
                          // </TableCell>
                          <TableCell
                            key={i}
                            sx={{
                              border: "1px solid black",
                              textAlign: "center",
                              color:
                                i === 10 && entry.comparison?.includes("વધારો")
                                  ? "green"
                                  : i === 10 &&
                                    entry.comparison?.includes("ઘટાડો થયો")
                                  ? "red"
                                  : "inherit", // Only change color for the CHANGES column
                            }}
                          >
                            {i === 1 ? ( // For the SUPPLIER NAME column, change index accordingly
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                {/* Supplier Logo */}
                                {/* <img
                                  src={
                                    entry.supplierLogo ||
                                    "https://i.pinimg.com/736x/b2/f9/33/b2f93328dedc3d7c86967e492aa03b39.jpg" // Fallback placeholder logo
                                  }
                                  alt={entry.supplierName}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    marginRight: "8px",
                                  }}
                                /> */}
                                {/* Supplier Name */}
                                <Typography sx={{ marginTop: "5px" }}>
                                  {entry.supplierName}
                                </Typography>
                              </Box>
                            ) : i === 10 ? ( // For the CHANGES column
                              <Box>
                                {/* Changes Value */}
                                {entry.comparison?.includes("વધારો") && (
                                  <ArrowUpward
                                    sx={{
                                      mr: 0.5,
                                      color: "green",
                                      fontSize: "20px",
                                    }}
                                  />
                                )}
                                {entry.comparison?.includes("ઘટાડો થયો") && (
                                  <ArrowDownward
                                    sx={{
                                      mr: 0.5,
                                      color: "red",
                                      fontSize: "20px",
                                    }}
                                  />
                                )}
                                {typeof cell === "string" &&
                                cell.includes("/TON")
                                  ? `${parseInt(
                                      cell.split("/TON")[0],
                                      10
                                    )}/TON ${cell.split("/TON")[1]}`
                                  : cell}
                              </Box>
                            ) : (
                              cell // Render other cells normally
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f3b234",
            color: "black",
            padding: "5px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "16px" }}>
            FOR ANY TYPE OF QUERIES, KINDLY CONTACT: DHARMESH JOBANPUTRA -
            8866299399 | JIGNESH JOBANPUTRA - 8347099299 | ROSHAN NAYAK -
            8866210228
          </Typography>
          <Typography variant="h6" sx={{ fontSize: "16px" }}>
            BASIC LANDED PRICE IS SORTED BY LOWEST TO HIGHEST
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewPricesheet;
