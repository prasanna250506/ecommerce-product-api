
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware: log HTTP method, URL, and request time
app.use((req, res, next) => {
    console.log(
        `Method: ${req.method} | URL: ${req.originalUrl} | Time: ${new Date().toISOString()}`
    );
    next();
});

// MongoDB product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'Stock must be an integer'
        }
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Validate product data
function validateProduct(req, res, next) {
    const { name, price, category, stock } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof price !== 'number' || !Number.isFinite(price) || price < 0 ||
        typeof category !== 'string' || !category.trim() ||
        !Number.isInteger(stock) || stock < 0
    ) {
        return res.status(400).json({
            message: 'Provide valid name, price, category, and stock.'
        });
    }

    next();
}

// POST: Add product
app.post('/api/products', validateProduct, async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to add product' });
    }
});

// GET: Retrieve all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to retrieve products' });
    }
});

// GET: Retrieve product by MongoDB ID
app.get('/api/products/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to retrieve product' });
    }
});

// PUT: Update product
app.put('/api/products/:id', validateProduct, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to update product' });
    }
});

// DELETE: Remove product
app.delete('/api/products/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            product
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to delete product' });
    }
});

// Connect to Atlas before starting the API
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is missing from the .env file');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Atlas connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Startup failed:', error.message);
        process.exit(1);
    }
}

startServer();
