import { Router, urlencoded } from "express";
import { messageModel } from "../models/messages.models.js";
import { io } from '../index.js';

const messagesRouter = Router();

// Add middleware to parse URL-encoded form data
messagesRouter.use(urlencoded({ extended: true }));

// Render the chat view
messagesRouter.get('/', async (req, res) => {
    const messages = await messageModel.find(); // Retrieve all messages from the database
    const messagesArray = messages.map((message) => message.toObject());
    res.render('chat', {
        css: "style.css",
        messages: messagesArray,
        title: "Chat",
    })
});

// Handle message sending from the form
messagesRouter.post('/sendMessage', async (req, res) => {
    const { email, message } = req.body;
    if (email && message) {
        try {
            const messageSent = await messageModel.create({ email: email, message: message }); // Save the message in the database
            io.emit('messageCreated', messageSent); // Emit a messageCreated event for real-time updates
            res.status(200).send("Message Sent")
        } catch (error) {
            console.error('Error saving the message:', error);
            res.status(500).send('Error sending the message');
        }
    }
    res.status(400).send('Bad Request');
});

export default messagesRouter;