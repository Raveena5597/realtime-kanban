# Realtime Collaborative Kanban Board
#Author - Raveena Putta
A realtime collaborative Kanban board where multiple users can create, edit, move and delete tasks simultaneously.

## Features

- Create tasks
- Edit tasks
- Delete tasks
- Drag and drop tasks between columns
- Realtime collaboration using WebSockets
- Conflict resolution using timestamps
- PostgreSQL persistence
- Offline action queue (basic support)

## Tech Stack

Frontend:

- React
- dnd-kit (drag and drop)

Backend:

- Node.js
- Express
- Socket.IO

Database:

- PostgreSQL

## Architecture Overview

Client communicates with the backend using WebSockets (Socket.IO).  
The backend manages task state and synchronizes updates across all connected clients.

All task data is stored in PostgreSQL to ensure persistence.

## Project Structure

realtime-kanban
│
├── backend
│ ├── server.js
│ ├── db.js
│
├── frontend
│ ├── src
│ │ ├── components
│ │ │ ├── Board.js
│ │ │ ├── Column.js
│ │ │ ├── TaskCard.js
│ │ ├── socket.js
│
└── README.md

## Installation

### Clone the repository

git clone <repo-url>
cd realtime-kanban

---

### Backend Setup

cd backend
npm install
node server.js

Server runs on:

http://localhost:5000

---

### Frontend Setup

cd frontend
npm install
npm start

App runs on:

http://localhost:3000

---

### PostgreSQL Setup

Create database:

CREATE DATABASE kanban_db;

Create table:

CREATE TABLE tasks (
id TEXT PRIMARY KEY,
title TEXT,
column_name TEXT,
updated_at BIGINT
);

---

## How Realtime Collaboration Works

1. Client performs action (create/edit/move/delete task)
2. Client sends event via Socket.IO
3. Server updates database
4. Server broadcasts updated task state to all connected clients
5. Clients update their UI instantly

---

## Conflict Resolution Strategy

The system uses **Last Write Wins (LWW)** based on timestamps.

Each task has an `updatedAt` field.

If multiple users update the same task simultaneously, the version with the latest timestamp is considered the valid state.

---

## Future Improvements

- User authentication
- Multiple boards
- Task assignments
- Activity history
- Improved offline synchronization
