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


    addProduct(title = "Untitled Product", description = "Description not available", price = 0, thumbnail = "image_not_available.jpg", code = "N/A", stock = 0) {
        if (!(title && description && price && thumbnail && code && stock)) {
            console.log("-----------------------");
            console.log(new Error("All fields are mandatory."));
            console.log("-----------------------");
            return
        }

        if (this.products?.some(product => product.code === code)) {
            console.log("-----------------------");
            console.log(new Error("Product with the same code already exists."));
            console.log("-----------------------");
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

        console.log("-----------------------");
        console.log("Product Added:");
        console.log(`ID: ${newProduct.id}`);
        console.log(`Title: ${newProduct.title}`);
        console.log(`Description: ${newProduct.description}`);
        console.log(`Price: ${newProduct.price}`);
        console.log(`Thumbnail: ${newProduct.thumbnail}`);
        console.log(`Code: ${newProduct.code}`);
        console.log(`Stock: ${newProduct.stock}`);
        console.log("-----------------------");

    }


    getProducts() {
        if (this.products.length === 0) {
            console.log("-----------------------");
            console.log("No products added yet.");
            console.log("-----------------------");
        } else {
            console.log("-----------------------");
            console.log("List of products:");
            this.products.forEach(product => {
                console.log(`ID: ${product.id}`);
                console.log(`Title: ${product.title}`);
                console.log(`Description: ${product.description}`);
                console.log(`Price: ${product.price}`);
                console.log(`Thumbnail: ${product.thumbnail}`);
                console.log(`Code: ${product.code}`);
                console.log(`Stock: ${product.stock}`);
                console.log("-----------------------");
            });
        }
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (product) {
            console.log("-----------------------");
            console.log("Product Found:");
            console.log(`ID: ${product.id}`);
            console.log(`Title: ${product.title}`);
            console.log(`Description: ${product.description}`);
            console.log(`Price: ${product.price}`);
            console.log(`Thumbnail: ${product.thumbnail}`);
            console.log(`Code: ${product.code}`);
            console.log(`Stock: ${product.stock}`);
            console.log("-----------------------");
        } else {
            console.log("-----------------------");
            console.log("Not Found");
            console.log("-----------------------");
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