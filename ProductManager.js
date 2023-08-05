/*
  ProductManger class manages products, providing functions to add products,
  list all products, and find products by ID. It maintains a list of products
  with an auto-incrementing ID for each new product added.
 
 Functionalities:
 1. addProduct(title, description, price, thumbnail, code, stock):
    Adds a new product to the list of products with the provided details.
    Validates that all fields (title, description, price, thumbnail, code, stock)
    are mandatory and checks if a product with the same code already exists.
    Displays the newly added product's details on the console.

 2. getProducts():
    Lists all products added so far. Displays each product's details on the console.
    If no products are added yet, it displays "No products added yet."
 
 3. getProductById(id):
     Searches for a product by the provided ID and displays its details on the console
     if found. If the product with the specified ID is not found, it displays "Not Found."
 */


class ProductManger {
    constructor() {
        this.nextId = 1;
        this.products = [];
    }


    addProduct(title, description, price, thumbnail, code, stock) {
        if (!(title && description && price && thumbnail && code && stock)) {
            console.log(new Error("All fields are mandatory."));
            return
        }

        if (this.products?.some(product => product.code === code)) {
            console.log(new Error("Product with the same code already exists."));
            return
        }

        const newProduct = {
            id: this.nextId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };

        this.nextId++;

        this.products.push(newProduct);

        console.log(`Product Added: ${newProduct}`);
    }


    getProducts() {
        if (this.products.length === 0) {
            console.log("No products added yet.");
        } else {
            console.log("List of products:");
            this.products.forEach(product => {
                console.log(`Product: ${product}`);
            });
        }
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (product) {
            console.log(`Product Found: ${product}`);
        } else {
            console.log("Not Found");
        }
    }

}



const productManager = new ProductManger();

productManager.addProduct("T-Shirt", "Cotton T-shirt", 20, "tshirt.jpg", "123456");
productManager.addProduct("Shoes", "Running shoes", 60, "shoes.jpg", "789012", 30);
productManager.addProduct("Shoes", "Running shoes", 60, "shoes.jpg", "789012", 30);
productManager.addProduct("Jacket", "Winter jacket", 60, "jacket.jpg", "555033", 50);

productManager.getProductById(1);
productManager.getProductById(2);
productManager.getProductById(3);
productManager.getProducts();