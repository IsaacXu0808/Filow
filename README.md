# File Transfer Application

A real-time file transfer web application that allows users to securely transfer files between devices using verification codes.

## Features

- Real-time file transfer using WebSocket
- Verification code-based connection
- Progress tracking
- Secure file transmission
- User-friendly interface

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies for both frontend and backend
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Running the Application

1. Start the backend server
```bash
cd backend
npm start
```
The server will run on `http://localhost:3000`

2. Start the frontend development server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## How to Use

### For Sender:

1. Open the application in your browser
2. Click "Send File" on the homepage
3. You will receive a 6-digit verification code
4. Share this code with the receiver
5. Wait for the receiver to connect
6. Once connected, select the file you want to send
7. Click "Send File" to start the transfer

### For Receiver:

1. Open the application in your browser
2. Click "Receive File" on the homepage
3. Enter the 6-digit verification code provided by the sender
4. Click "Join Session"
5. Wait for the file transfer to complete
6. Click the file icon to download the received file

## Technical Details

- Frontend: Vue.js 3
- Backend: Node.js with Express
- Real-time Communication: Socket.IO
- File Transfer: Chunk-based transfer system

## Error Handling

- Invalid verification code: An error message will be displayed
- Connection issues: Users will be notified of connection problems
- Transfer interruption: Progress tracking helps identify transfer status

## Security Considerations

- Unique verification codes for each session
- Temporary file storage
- Automatic cleanup after transfer
- Secure WebSocket connection

## Limitations

- Maximum file size: 1GB
- Supported file types: All
- Session timeout: 30 minutes
