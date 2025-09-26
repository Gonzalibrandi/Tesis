const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FOLDER = process.env.DATA_FOLDER || './data';
const LANGFLOW_API_KEY = process.env.LANGFLOW_API_KEY;
const LANGFLOW_PDF_URL = process.env.LANGFLOW_PDF_URL;

// Ensure data folder exists
if (!fs.existsSync(DATA_FOLDER)) {
  fs.mkdirSync(DATA_FOLDER, { recursive: true });
}

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8081', 'http://localhost:8080'], // React and Vite default ports
  credentials: true
}));

app.use(express.json());

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DATA_FOLDER);
  },
  filename: (req, file, cb) => {
    const filename = 'file.pdf';
    cb(null, filename);
  }
});

// File filter for PDFs only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'PDF Upload Server is running',
    endpoints: {
      upload: 'POST /upload',
      getFile: 'GET /files/:filename'
    }
  });
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    console.log("✅ PDF guardado en:", req.file.path);

    // Body mínimo requerido por Langflow
    const body = {
      "input_value": "",
      "output_type": "chat", 
      "input_type": "chat"
    };

    // Llamada al Flow de Langflow
    const response = await fetch(LANGFLOW_PDF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LANGFLOW_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Langflow API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    console.log("Langflow response ✅:", data);

    res.json({
      success: true,
      message: 'File uploaded and Langflow flow executed successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path
      },
      flowResult: data
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error while uploading file',
      details: error.message
    });
  }
});


// Get file endpoint
app.get('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(DATA_FOLDER, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Send file
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while retrieving file' 
    });
  }
});

// Delete file endpoint
app.delete('/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(DATA_FOLDER, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);
    
    console.log(`✅ File deleted: ${filename}`);

    res.json({
      success: true,
      message: 'File deleted successfully',
      filename: filename
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while deleting file' 
    });
  }
});

// List files endpoint (bonus)
app.get('/files', (req, res) => {
  try {
    const files = fs.readdirSync(DATA_FOLDER)
      .filter(file => file.endsWith('.pdf'))
      .map(file => {
        const filePath = path.join(DATA_FOLDER, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });

    res.json({
      success: true,
      files: files
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error while listing files' 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB'
      });
    }
  }
  
  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Only PDF files are allowed'
    });
  }

  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Data folder: ${path.resolve(DATA_FOLDER)}`);
  console.log('Ready to accept PDF uploads!');
});