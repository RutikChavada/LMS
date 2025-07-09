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

app.get("/check-users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/clerk",express.json(),clerkwebhooks)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});