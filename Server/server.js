import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkwebhooks } from './controllers/webhooks.js';
import User from './models/User.js';

const app = express();

await connectDB()

app.use(cors());

app.get('/', (req, res) => {
  res.send('API Working !');
})
app.post("/clerk",express.json(),clerkwebhooks)

app.post("/test-create", express.json(), async (req, res) => {
    const { id, email, name, imageUrl } = req.body;
    try {
        await User.create({ _id: id, email, name, imageUrl });
        res.json({ message: "User created (test)" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/test-update/:id", express.json(), async (req, res) => {
    const { email, name, imageUrl } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, { email, name, imageUrl });
        res.json({ message: "User updated (test)" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/test-delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted (test)" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});