# Mongoose CRUD Operations Demo

This project demonstrates how to perform Create, Read, Update, and Delete (CRUD) operations on MongoDB using Mongoose. 

To make it immediately runnable without requiring you to install and set up a local MongoDB database, this project uses `mongodb-memory-server` to run an in-memory MongoDB instance automatically when running the script.

## Project Structure

- `crud.js`: Contains the Schema, Model declaration, and modular functions to perform CRUD operations (Insert, Fetch, Update, Delete).
- `index.js`: A driver script that spins up an in-memory MongoDB server, runs through a sequence of CRUD actions, prints formatted console logs, and shuts down cleanly.
- `package.json`: Configures the Node.js project (ES Modules) and dependencies.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)

## Installation

1. Navigate to the project directory:
   ```bash
   cd mongoose-crud
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Demo

To run the demo, run the start script:
```bash
npm start
```

This will:
1. Start an in-memory MongoDB server.
2. Establish a connection via Mongoose.
3. Insert 3 new product documents (Create).
4. Fetch all documents and list them in a table (Read).
5. Fetch documents using filters (Read).
6. Update a document's details (Update).
7. Delete a document by its ID (Delete).
8. Fetch the remaining documents to verify (Read).
9. Close connections and shutdown the in-memory server cleanly.
