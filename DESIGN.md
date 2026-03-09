# System Design – Realtime Collaborative Kanban Board

## Overview

This system implements a realtime Kanban board where multiple users can collaborate simultaneously. Users can create, move, edit, and delete tasks while all connected clients receive updates instantly.

The system uses WebSockets for realtime communication and PostgreSQL for persistence.

---

## High Level Architecture

Client (React)
↓
WebSocket Communication (Socket.IO)
↓
Backend Server (Node.js + Express)
↓
PostgreSQL Database

---

## Components

### Frontend

The frontend is built using React and consists of three main components:

Board.js  
Manages the application state and drag-and-drop logic.

Column.js  
Represents each task column (To Do, In Progress, Done).

TaskCard.js  
Represents individual tasks.

Drag and drop functionality is implemented using the dnd-kit library.

---

### Backend

The backend is built with Node.js and Express and handles:

- WebSocket connections
- Task synchronization
- Database updates
- Conflict resolution

Socket.IO is used to enable realtime bidirectional communication between clients and server.

---

### Database

PostgreSQL is used to persist tasks.

Schema:

tasks

id
title
column_name
updated_at

---

## Realtime Synchronization

The system uses a **server-authoritative model**.

1. Client performs an action
2. Event is sent to the server via WebSocket
3. Server updates the database
4. Server broadcasts updated task state to all connected clients

This ensures all clients stay synchronized.

---

## Conflict Resolution

Concurrent updates can occur when multiple users edit or move the same task.

The system uses a **Last Write Wins strategy**.

Each task has an `updatedAt` timestamp.

The update with the latest timestamp overwrites previous updates.

This provides a simple and effective conflict resolution mechanism.

---

## Offline Handling

Basic offline support is implemented using a client-side action queue.

If the client temporarily loses connection:

- actions are stored locally
- once the connection is restored
- queued actions are replayed

---

## Scalability Considerations

Potential improvements for large-scale deployments:

- Redis adapter for Socket.IO
- Load-balanced WebSocket servers
- Event-based architecture
- Optimistic UI updates

---

## Future Improvements

- Authentication and user accounts
- Multiple boards
- Task comments
- Notifications
- Versioned conflict resolution
