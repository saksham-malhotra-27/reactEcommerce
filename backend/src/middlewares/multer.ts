import multer from 'multer';

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Set up Multer to handle multiple fields
const multipleUpload = multer({ storage }).fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
]);

export default multipleUpload;
