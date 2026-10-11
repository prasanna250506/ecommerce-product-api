# E-Commerce Product Management REST API

A RESTful API for managing e-commerce products, built using Node.js, Express.js, and MongoDB Atlas.

## Features
- Create a product
- Retrieve all products
- Retrieve a product by ID
- Update product details
- Delete a product
- MongoDB database integration
- Request logging and input validation

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- REST API

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/routhunihar7/ecommerce-product-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ecommerce-product-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```
5. Start the server using the command configured in `package.json`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create a product |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a product by ID |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

## Security
Store database credentials in environment variables. Never commit `.env` to GitHub.