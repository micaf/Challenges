import { Router, urlencoded } from "express";
import multer from 'multer'
import ProductManager from '../managers/ProductManager.js'
import {io } from '../index.js';

const productsRouter = Router();

// Add middleware to parse URL-encoded form data
productsRouter.use(urlencoded({ extended: true }));

// Create an instance of ProductManager with the path to the products file
const PRODUCTS_FILE = './src/data/products.json';
const productManager = new ProductManager(PRODUCTS_FILE);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img') 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })


productsRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();
        if (!isNaN(limit)) {
            products = products.slice(0, limit);
        }
        res.render('home', {
            css: "style.css",
            products: products,
            title: "Home",
        })
    
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
});

productsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realtimeproducts', {
            title: "Real Time Products",
            products: products
        })
    
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
});


productsRouter.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productsRouter.post('/', upload.array('thumbnails', 5), async (req, res) => {
    try {
        const newProduct = {
            title: req.body.title,
            description: req.body.description,
            stock: req.body.stock,
            price: req.body.price,
            status: true,
            category: req.body.category,
            code: req.body.code,
            thumbnails: req.files.map(file => file.filename)
        };
        const createdProduct = await productManager.addProduct(newProduct);
        io.emit('productCreated', createdProduct);
        res.status(201).json(createdProduct); // 201 Created
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = await productManager.updateProduct(productId, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productDelected = await productManager.deleteProduct(productId);
        io.emit('productDelected', productDelected)
        res.status(204).send("Product successfully removed");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default productsRouter