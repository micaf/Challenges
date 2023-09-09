import express from 'express';
import { config as dotenvConfig } from 'dotenv'; 
import path from 'path';
import { Server } from 'socket.io';

import productsRouter from './routes/products.routes.js';
import messagesRouter from './routes/messages.routes.js';
import cartRouter from './routes/carts.routes.js'
import { engine } from 'express-handlebars';
import { __dirname } from './path.js';
import mongoose from 'mongoose'

dotenvConfig();
mongoose.set("strictQuery", false);
// Wait for database to connect, logging an error if there is a problem
main().catch((err) => console.log(err));

async function main()  {
    try {
        await mongoose.connect("mongodb+srv://micaelafuentes:password@ecommerce.fexxjg5.mongodb.net/?retryWrites=true&w=majority", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          dbName: 'ecommerce'
        });
        console.log('BDD connected');
      } catch (error) {
        console.error('Error in connection to BDD', error);
      }
}


// Create an instance of the Express application
const app = express();


mongoose.set('debug', true);


// Middleware to parse incoming JSON data
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Define the port on which the server will run
const PORT = process.env.PORT || 8080;

// Start the Express server and listen on the specified port
const server = app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});

// Configure Handlebars as the template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

// Serve static files from the 'public' directory
app.use('/', express.static(path.join(__dirname, '/public/')));

// Set up Socket.io server
const io = new Server(server);
io.on('connection', (socket) => {
    console.log("Socket.io server connected");
});

// Mount the productsRouter under the '/api/products' path
app.use('/api/products', productsRouter);
app.use('/api/chat', messagesRouter);
app.use('/api/carts', cartRouter);

// Export the io instance for use in other parts of the application
export { io };