import mongoose from 'mongoose';

const pointHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Index for faster queries
  points: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true }, // Index for sorting
});

export default mongoose.model('PointHistory', pointHistorySchema);