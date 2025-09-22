# PDF Upload Backend

A minimal but production-ready Node.js backend for handling PDF file uploads from your React frontend.

## Features

- ✅ PDF file upload via POST request
- ✅ File storage in configurable folder
- ✅ File retrieval endpoint
- ✅ CORS enabled for frontend communication
- ✅ Error handling for common scenarios
- ✅ File type validation (PDFs only)
- ✅ File size limit (10MB)
- ✅ Optional filename overwrite

## Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create data folder (optional - will be created automatically):**
   ```bash
   mkdir data
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

## Environment Configuration

You can configure the server using environment variables:

```bash
# Port (default: 3001)
PORT=3001

# Data storage folder (default: ./data)
DATA_FOLDER=./uploads
```

Example:
```bash
PORT=8000 DATA_FOLDER=./my-uploads npm run dev
```

## API Endpoints

### 1. Upload File
**POST** `/upload`

Upload a PDF file using multipart/form-data.

**Parameters:**
- `file`: PDF file (required)
- `overwrite`: Query parameter (optional) - set to `true` to save as `file.pdf`

**Examples:**
```bash
# Regular upload (preserves filename)
curl -X POST -F "file=@document.pdf" http://localhost:3001/upload

# Overwrite filename as 'file.pdf'
curl -X POST -F "file=@document.pdf" "http://localhost:3001/upload?overwrite=true"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "filename": "document.pdf",
    "originalName": "document.pdf",
    "size": 1234567,
    "path": "./data/document.pdf"
  }
}
```

### 2. Get File
**GET** `/files/:filename`

Retrieve an uploaded PDF file.

**Example:**
```bash
curl http://localhost:3001/files/document.pdf
```

### 3. List Files (Bonus)
**GET** `/files`

Get a list of all uploaded PDF files.

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "filename": "document.pdf",
      "size": 1234567,
      "created": "2023-12-01T10:00:00.000Z",
      "modified": "2023-12-01T10:00:00.000Z"
    }
  ]
}
```

## Frontend Integration

### React Example (using fetch)

```javascript
// Upload file
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('File uploaded:', result.file);
    } else {
      console.error('Upload failed:', result.error);
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};

// Usage in component
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    uploadFile(file);
  }
};
```

## Error Handling

The API handles common error scenarios:

- **No file sent**: Returns 400 with error message
- **Wrong file type**: Returns 400 - only PDFs allowed
- **File too large**: Returns 400 - max 10MB
- **File not found**: Returns 404 when retrieving non-existent file
- **Internal errors**: Returns 500 with generic error message

## Security Features

- File type validation (PDFs only)
- File size limits (10MB)
- CORS configuration for specific origins
- Input sanitization
- Error message sanitization

## Project Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── data/             # Upload directory (created automatically)
└── README.md         # This file
```

## Production Deployment

For production deployment, consider:

1. **Environment variables**: Use `.env` file for configuration
2. **Process management**: Use PM2 or similar
3. **Reverse proxy**: Use nginx for better performance
4. **SSL/TLS**: Enable HTTPS
5. **File cleanup**: Implement periodic cleanup of old files
6. **Authentication**: Add API key or JWT authentication if needed

Example production start:
```bash
NODE_ENV=production PORT=3001 DATA_FOLDER=/var/uploads npm start
```