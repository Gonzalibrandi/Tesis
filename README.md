# AI Research Assistant

A full-stack application with a React frontend for AI-powered research and document analysis, and a Node.js backend for file upload handling.

## Project Structure

```
├── src/                          # Frontend (React + TypeScript)
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components (shadcn)
│   │   ├── QuestionInterface.tsx # Main research interface
│   │   └── SystemArchitecture.tsx # System architecture display
│   ├── pages/                    # Page components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions
│   └── assets/                   # Static assets
└── backend/                      # Backend (Node.js + Express)
    ├── server.js                 # Main server file
    ├── package.json              # Backend dependencies
    └── data/                     # File upload storage
```

## Project info

**URL**: https://lovable.dev/projects/2f08b394-937c-4885-9ca1-76c428b9fd27

## Getting Started

### Frontend Development

**Using Lovable (Recommended)**
Simply visit the [Lovable Project](https://lovable.dev/projects/2f08b394-937c-4885-9ca1-76c428b9fd27) and start prompting.

**Local Development**
```sh
# Clone and setup frontend
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

### Backend Development

The backend handles PDF file uploads and storage:

```sh
# Setup and run backend server
cd backend
npm install
npm run dev  # Development mode with auto-reload
```

The backend will run on `http://localhost:3001` and includes:
- PDF upload endpoint (`POST /upload`)
- File retrieval endpoint (`GET /files/:filename`)
- File listing endpoint (`GET /files`)

See `backend/README.md` for detailed API documentation.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2f08b394-937c-4885-9ca1-76c428b9fd27) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
