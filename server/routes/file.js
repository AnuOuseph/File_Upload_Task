const express =  require('express');
const multer = require('multer');
const { fileUpload, getFiles, removeFiles, downloadFile} = require('../controllers/fileController.js');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage })

const router = express.Router();
router.use(express.json());
router.post('/upload', upload.single('file'), fileUpload)
router.get('/:userId',getFiles)
router.delete('/:userId/:fileName',removeFiles)
router.get('/download/:userId/:uniqueCode/:fileName',downloadFile)

module.exports = router;