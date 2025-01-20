  const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TransportationChargeController = {
  // Create a new transportation charge

  // async addTransportationCharge(req, res) {
  //   const {
  //     supplierName,
  //     loadingPoint,
  //     transportationCharge,
  //     cv,
  //     gst,
  //     product,
  //     productSequence, // Expect this from the request body
  //   } = req.body;
  
  //   try {
  //     // Ensure productSequence is an integer
  //     const newCharge = await prisma.transportationCharge.create({
  //       data: {
  //         supplierName,
  //         loadingPoint,
  //         transportationCharge: parseFloat(transportationCharge), // Ensure it's a number
  //         cv,
  //         gst,
  //         product,
  //         productSequence: parseInt(productSequence, 10), // Convert to integer
  //       },
  //     });
  
  //     res.status(201).json({
  //       message: "Transportation charge added successfully.",
  //       charge: newCharge,
  //     });
  //   } catch (error) {
  //     console.error("Error adding transportation charge:", error);
  //     res.status(500).json({
  //       message: "Error adding transportation charge.",
  //       error,
  //     });
  //   }
  // },
 
  async addTransportationCharge(req, res) {
    const {
      supplierName,
      loadingPoint,
      transportationCharge,
      cv,
      gst,
      product,
      productSequence,
    } = req.body;
  
    try {
      // Check if a similar record already exists
      const existingCharge = await prisma.transportationCharge.findFirst({
        where: {
          supplierName,
          loadingPoint,
          product,
          productSequence: parseInt(productSequence, 10), // Ensure it's an integer
        },
      });
  
      // If the record exists, check if the transportation charge is the same
      if (existingCharge) {
        if (
          parseFloat(existingCharge.transportationCharge) ===
          parseFloat(transportationCharge)
        ) {
          return res.status(400).json({
            message: "A transportation charge with the same details and charge already exists.",
          });
        }
      }
  
      // If no duplicate or the charge is different, proceed to create the entry
      const newCharge = await prisma.transportationCharge.create({
        data: {
          supplierName,
          loadingPoint,
          transportationCharge: parseFloat(transportationCharge), // Ensure it's a number
          cv,
          gst,
          product,
          productSequence: parseInt(productSequence, 10), // Convert to integer
        },
      });
  
      res.status(201).json({
        message: "Transportation charge added successfully.",
        charge: newCharge,
      });
    } catch (error) {
      console.error("Error adding transportation charge:", error);
      res.status(500).json({
        message: "Error adding transportation charge.",
        error,
      });
    }
  }
  ,
  

  // Get all transportation charges
  async getAllTransportationCharges(req, res) {
    try {
      const charges = await prisma.transportationCharge.findMany();
      res.status(200).json(charges);
    } catch (error) {
      console.error('Error fetching transportation charges:', error);
      res.status(500).json({ message: 'Error fetching transportation charges.', error });
    }
  },

  // Update a transportation charge
  async updateTransportationCharge(req, res) {
    const { id } = req.params;
    const { supplierName, loadingPoint, transportationCharge, cv, gst, product } = req.body;

    try {
      const updatedCharge = await prisma.transportationCharge.update({
        where: { id: parseInt(id) },
        data: {
          supplierName,
          loadingPoint,
          transportationCharge: parseFloat(transportationCharge),
          cv,
          gst,
          product,
        },
      });

      res.status(200).json({ message: 'Transportation charge updated successfully.', charge: updatedCharge });
    } catch (error) {
      console.error('Error updating transportation charge:', error);
      res.status(500).json({ message: 'Error updating transportation charge.', error });
    }
  },

  // Delete a transportation charge
  async deleteTransportationCharge(req, res) {
    const { id } = req.params;

    try {
      await prisma.transportationCharge.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: 'Transportation charge deleted successfully.' });
    } catch (error) {
      console.error('Error deleting transportation charge:', error);
      res.status(500).json({ message: 'Error deleting transportation charge.', error });
    }
  },
};




module.exports = TransportationChargeController;


