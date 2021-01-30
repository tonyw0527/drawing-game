import mongoose from 'mongoose';


const User = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
})

export default mongoose.models.User || mongoose.model('User', User);