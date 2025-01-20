const trigasProductModel = require("../models/productModel");

// Create a new TrigasProduct
exports.createProduct = async (req, res) => {
  try {
    const { productName, activeStatus, productSequence,NCV,productGST  } = req.body; // Add productSequence
    const product = await trigasProductModel.create({ productName, activeStatus, productSequence,NCV,productGST });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product", details: error.message });
  }
};

// Get all TrigasProducts
exports.getAllProducts = async (req, res) => {
  try {
    const products = await trigasProductModel.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
};

// Get TrigasProduct by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await trigasProductModel.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product", details: error.message });
  }
};

// Update a TrigasProduct
exports.updateProduct = async (req, res) => {
  try {
    const { productName, activeStatus, productSequence,NCV,productGST  } = req.body; // Add productSequence
    const updatedProduct = await trigasProductModel.update(req.params.id, {
      productName,
      activeStatus,
      productSequence, // Include productSequence in update
      NCV,
      productGST 
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product", details: error.message });
  }
};

// Toggle active status of a TrigasProduct
exports.toggleProductStatus = async (req, res) => {
  try {
    console.log("Received request to toggle status for ID:", req.params.id);
    const productId = req.params.id;

    const product = await trigasProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updatedProduct = await trigasProductModel.update(productId, {
      activeStatus: !product.activeStatus,
    });

    console.log("Product updated:", updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in toggleProductStatus:", error);
    res.status(500).json({ error: "Failed to toggle product status", details: error.message });
  }
};

// Delete a TrigasProduct
exports.deleteProduct = async (req, res) => {
  try {
    await trigasProductModel.delete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product", details: error.message });
  }
};
