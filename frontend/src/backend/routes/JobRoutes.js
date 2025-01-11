import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// Add a new job
router.post('/add-job', async (req, res) => {
  const { username, jobTitle, description, price, time } = req.body;

  try {
    const newJob = new Job({
      username,
      jobTitle,
      description,
      price,
      time,
    });

    await newJob.save();
    res.status(200).json({ message: 'Job added successfully' });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Failed to add job' });
  }
});

export default router;
