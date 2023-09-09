import { Router, urlencoded } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router();

// Add middleware to parse URL-encoded form data
cartRouter.use(urlencoded({ extended: true }));

// Create a new cart
cartRouter.post('/', async (req, res) => {
  try {
    const newCart = await cartModel.create({});
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get a specific cart by ID
cartRouter.get('/:cid', async(req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartModel.findById(cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ error: 'Cart not found' })
  }
});

// Add a product to a cart
cartRouter.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await productModel.findById(pid) 

            if (prod) {
                const index = cart.products.findIndex(item => item.id_prod == pid) 
                if (index != -1) {
                    cart.products[index].quantity = quantity 
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity }) 
                }
                const response = await cartModel.findByIdAndUpdate(cid, cart) 
                res.status(200).send({ response: 'OK', message: response })
            } else {
                res.status(404).send({ response: 'Error adding product to Cart', message: 'Product Not Found' })
            }
        } else {
            res.status(404).send({ response: 'Error adding product to Cart', message: 'Cart Not Found' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ response: 'Error adding product to Cart', message: error })
    }
})

export default cartRouter;