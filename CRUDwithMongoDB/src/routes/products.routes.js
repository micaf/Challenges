import { Router, urlencoded } from "express";
import multer from 'multer'
import { productModel } from "../models/products.models.js";
import { io } from '../index.js';

const productsRouter = Router();

// Add middleware to parse URL-encoded form data
productsRouter.use(urlencoded({ extended: true }));

// Create an instance of ProductManager with the path to the products file
//const PRODUCTS_FILE = './src/data/products.json';
//const productManager = new ProductManager(PRODUCTS_FILE);

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
        debugger
        const limit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : null;
        const products = await productModel.find().limit(limit);
        console.log(products)
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
        const products = await pproductModel.find();
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
        const product = await productModel.findById(productId);
        if (product)
            res.status(200).json(product)
        else
            res.status(404).send({ error: 'Product not found' })
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productsRouter.post('/', upload.array('thumbnails', 5), async (req, res) => {
    try {
        const { title, description, stock, code, price, category } = req.body;
        const thumbnails = req.files ? req.files.map(file => file.filename) : []
        const createdProduct = await productModel.create({ title, description, stock, price, category, code, thumbnails });
        io.emit('productCreated', createdProduct);
        res.status(200).json(createdProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productsRouter.put('/:pid', upload.array('thumbnails', 5), async (req, res) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(parseInt(req.params.pid), req.body);
        return updatedProduct ? res.status(200).json(updatedProduct) : res.status(404).send("Product Not Found");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productDelected = await productModel.findByIdAndDelete(productId);
        if (productDelected) {
            io.emit('productDelected', productDelected)
            res.status(204).send("Product successfully removed");
        } else {
            res.status(404).send("Product not found");
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default productsRouter