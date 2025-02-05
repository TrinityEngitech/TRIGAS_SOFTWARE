const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
  saveTankerDetails,
  getAllTankers,
  getTankerById,
  updateTankerDetails,
  deleteTankerDetails,
  documentDelete,
  toggleTankerStatus
} = require('../controllers/tankerController');

router.post('/', upload.array('documents'), saveTankerDetails);
router.get('/', getAllTankers);
router.get('/:id', getTankerById);
// Update tanker details with file uploads (documents)
router.put('/:id', upload.array('documents'), updateTankerDetails);
// router.put('/toggle/:id', toggleTankerStatus);
router.delete('/:id', deleteTankerDetails);
router.delete('/documents/:id', documentDelete);


router.put('/toggle/:id', toggleTankerStatus);

module.exports = router;



