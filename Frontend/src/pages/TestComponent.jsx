import React, { useState, useEffect } from "react";
import axiosInstance from "../Authentication/axiosConfig"; // Import the custom Axios instance

const TestComponent = () => {
  const [products, setProducts] = useState([]); // State to store fetched data
  const [error, setError] = useState(null); // State to store error message if any

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example API call (GET request)
        const response = await axiosInstance.get("/products/"); // Replace with your API endpoint
        setProducts(response.data); // Set the fetched data in state
        console.log("Response:", response.data); // Log the response for debugging
      } catch (error) {
        setError("Error fetching data"); // Handle errors
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>; // Show error message if any
  }

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.id}>
              <strong>Product Name:</strong> {product.productName} <br />
              <strong>Product Sequence:</strong> {product.productSequence} <br />
              <strong>NCV:</strong> {product.NCV} <br />
              <strong>GST:</strong> {product.productGST}% <br />
              <strong>Active Status:</strong> {product.activeStatus ? "Active" : "Inactive"} <br />
              <strong>Create Date:</strong> {new Date(product.createDate).toLocaleString()} <br />
            </li>
          ))    
        ) : (
          <p>No products available.</p>
        )}
      </ul>
    </div>
  );
};

export default TestComponent;
