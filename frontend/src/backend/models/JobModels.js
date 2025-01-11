import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  username: { type: String, required: true },
  jobTitle: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  time: { type: String, required: true },
});

const Job = mongoose.model('Job', JobSchema);

export default Job;
