import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';  // This will now work after you set the default export in auth.js


const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);

mongoose.connect('mongodb+srv://Santhsim:Santhsim123@cluster0.hazln.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
