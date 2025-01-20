const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PriceSheetController = {
  

  async createPriceSheet(req, res) {
    const { name, city, effectiveDate, effectiveTime, remark, data } = req.body;
  
    try {
      const priceSheet = await prisma.priceSheet.create({
        data: {
          name,
          city,
          effectiveDate: new Date(effectiveDate),
          effectiveTime,
          remark,
          data: {
            create: await Promise.all(
              data.map(async (item) => {
                const basicPrice = parseFloat(item.basicPrice);
                const transportCharge = parseFloat(item.transportCharge);
                const gstPercentage = parseFloat(item.gst);
                const gstValue = (basicPrice * gstPercentage) / 100;
                const basicLanded = basicPrice + transportCharge;
  
                // Retrieve the previous entry for comparison
                const previousEntry = await prisma.priceSheetData.findFirst({
                  where: {
                    supplierName: item.supplierName,
                    productName: item.productName,
                    loadingPoint: item.loadingPoint,
                  },
                  orderBy: {
                    createdAt: 'desc', // Get the most recent entry
                  },
                });
  
                // Set comparison text with amount difference
                let comparison = ' '; // Default for new entries
                if (previousEntry) {
                  const difference = basicLanded - previousEntry.basicLanded;
                  if (difference > 0) {
                    comparison = `${difference.toFixed(2)}/TON વધારો`;
                  } else if (difference < 0) {
                    comparison = `${Math.abs(difference).toFixed(2)}/TON ઘટાડો થયો `;
                  } else {
                    comparison = ' ';
                  }
                }
  
                return {
                  supplierName: item.supplierName,
                  productName: item.productName,
                  loadingPoint: item.loadingPoint || '',
                  basicPrice,
                  cv: parseFloat(item.cv),
                  transportCharge,
                  basicLanded,
                  gstPercentage,
                  gst: gstValue,
                  total: basicLanded + gstValue,
                  productSequence: item.productSequence,
                  availableStatus: item.availableStatus !== undefined ? item.availableStatus : false,
                  comparison, // Include formatted comparison
                };
              })
            ),
          },
        },
      });
  
      res.status(201).json({ message: 'Price sheet created successfully.', priceSheet });
    } catch (error) {
      console.error('Error creating price sheet:', error);
      res.status(500).json({ message: 'Error creating price sheet.', error });
    }
  },
  
  
  

  // Get all price sheets
  async getAllPriceSheets(req, res) {
    try {
      const priceSheets = await prisma.priceSheet.findMany({
        include: { data: true },
      });
      res.status(200).json(priceSheets);
    } catch (error) {
      console.error('Error fetching price sheets:', error);
      res.status(500).json({ message: 'Error fetching price sheets.', error });
    }
  },

  // Get a single price sheet by ID
  async getPriceSheetById(req, res) {
    const { id } = req.params;

    try {
      const priceSheet = await prisma.priceSheet.findUnique({
        where: { id: parseInt(id) },
        include: { data: true },
      });

      if (!priceSheet) {
        return res.status(404).json({ message: 'Price sheet not found.' });
      }

      res.status(200).json(priceSheet);
    } catch (error) {
      console.error('Error fetching price sheet:', error);
      res.status(500).json({ message: 'Error fetching price sheet.', error });
    }
  },


  async updatePriceSheet(req, res) {
    const { id } = req.params; // Current Price Sheet ID
    const { data } = req.body;

    try {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: 'Invalid Price Sheet ID.' });
        }

        // Fetch the previous price sheet data
        const previousData = await prisma.priceSheetData.findMany({
            where: {
                priceSheetId: { not: parsedId },
            },
        });

        // Map the previous data for quick look-up by unique identifiers (e.g., supplierName + productName + loadingPoint)
        const previousPriceMap = new Map(
            previousData.map((item) => [
                `${item.supplierName}_${item.productName}_${item.loadingPoint}`,
                item.basicLanded,
            ])
        );

        // Prepare updated data with comparisons
        const updatedData = data.map((item) => {
            const { supplierName, productName, loadingPoint, basicPrice, transportCharge, gst } = item;

            // Calculate new values
            const basicLanded = parseFloat(basicPrice) + parseFloat(transportCharge);
            const gstValue = (basicLanded * parseFloat(gst)) / 100;
            const total = basicLanded + gstValue;

            // Fetch the original price for comparison
            const originalPriceKey = `${supplierName}_${productName}_${loadingPoint}`;
            const originalBasicLanded = previousPriceMap.get(originalPriceKey);

            // Calculate the comparison value
            let comparison = ' ';
            if (originalBasicLanded !== undefined) {
                const difference = basicLanded - originalBasicLanded;
                if (difference > 0) {
                    comparison = `${difference.toFixed(2)}/TON વધારો`; // Increase
                } else if (difference < 0) {
                    comparison = `${Math.abs(difference).toFixed(2)}/TON ઘટાડો થયો`; // Decrease
                }
            }

            return {
                priceSheetId: parsedId,
                supplierName,
                productName,
                loadingPoint,
                basicPrice: parseFloat(basicPrice),
                cv: parseFloat(item.cv),
                transportCharge: parseFloat(transportCharge),
                basicLanded,
                gstPercentage: parseFloat(gst),
                gst: gstValue,
                total,
                availableStatus: item.availableStatus !== undefined ? item.availableStatus : false,
                productSequence: item.productSequence,
                comparison, // Add calculated comparison
            };
        });

        // Update the price sheet and related data
        await prisma.$transaction(async (prisma) => {
            // Delete existing related data
            await prisma.priceSheetData.deleteMany({
                where: { priceSheetId: parsedId },
            });

            // Insert new related data
            await prisma.priceSheetData.createMany({
                data: updatedData,
            });
        });

        res.status(200).json({
            message: 'Price sheet updated successfully.',
            updatedData,
        });
    } catch (error) {
        console.error('Error updating price sheet:', error);
        res.status(500).json({ message: 'Error updating price sheet.', error: error.message });
    }
}
  
  ,

  // Delete Price Sheet
  async deletePriceSheet(req, res) {
    const { id } = req.params;

    try {
      // Delete related price data first (cascade deletion)
      await prisma.priceSheetData.deleteMany({
        where: { priceSheetId: parseInt(id) },
      });

      // Delete the price sheet itself
      await prisma.priceSheet.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: 'Price Sheet deleted successfully' });
    } catch (error) {
      console.error('Error deleting Price Sheet:', error);
      res.status(500).json({ message: 'Failed to delete Price Sheet', error });
    }
  },

  async updateActiveStatus(req, res) {
    const { id } = req.params; // Extract the ID from the route
    const { activeStatus } = req.body; // Extract the activeStatus from the request body
  
    try {
      // Validate the `activeStatus` field
      if (typeof activeStatus !== 'boolean') {
        return res.status(400).json({ message: '`activeStatus` must be a boolean value.' });
      }
  
      // Update the active status of the price sheet
      const updatedPriceSheet = await prisma.priceSheet.update({
        where: { id: parseInt(id) },
        data: { activeStatus },
      });
  
      res.status(200).json({
        message: `Price sheet status updated successfully.`,
        updatedPriceSheet,
      });
    } catch (error) {
      console.error('Error updating active status:', error);
      res.status(500).json({ message: 'Failed to update active status.', error });
    }
  },
  
  

};




module.exports = PriceSheetController;
