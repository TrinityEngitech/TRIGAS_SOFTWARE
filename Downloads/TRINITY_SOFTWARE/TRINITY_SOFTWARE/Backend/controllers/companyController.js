const companyModel = require("../models/companyModel");

// Create a new company
exports.createCompany = async (req, res) => {
  try {
    const {
      companyName,
      GSTNumber,
      supplierName,
      ownerName,
      address,
      country,
      state,
      district,
      city,
      pinCode,
      activeStatus,
    } = req.body;

    const company = await companyModel.create({
      companyName,
      GSTNumber,
      supplierName,
      ownerName,
      address,
      country,
      state,
      district,
      city,
      pinCode,
      activeStatus,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: "Failed to create company", details: error.message });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel.findAll();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch companies", details: error.message });
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await companyModel.findById(req.params.id);
    if (company) {
      res.status(200).json(company);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch company", details: error.message });
  }
};

// Update a company
exports.updateCompany = async (req, res) => {
  try {
    const {
      companyName,
      GSTNumber,
      supplierName,
      ownerName,
      address,
      country,
      state,
      district,
      city,
      pinCode,
      activeStatus,
    } = req.body;

    const updatedCompany = await companyModel.update(req.params.id, {
      companyName,
      GSTNumber,
      supplierName,
      ownerName,
      address,
      country,
      state,
      district,
      city,
      pinCode,
      activeStatus,
    });

    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ error: "Failed to update company", details: error.message });
  }
};

// Toggle active status of a company
exports.toggleCompanyStatus = async (req, res) => {
  try {
    console.log('Received request to toggle status for ID:', req.params.id);
    const companyId = req.params.id;

    const company = await companyModel.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const updatedCompany = await companyModel.update(companyId, {
      activeStatus: !company.activeStatus,
    });

    console.log('Company updated:', updatedCompany);
    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error('Error in toggleCompanyStatus:', error);
    res.status(500).json({ error: "Failed to toggle company status", details: error.message });
  }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    await companyModel.delete(req.params.id);
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete company", details: error.message });
  }
};
