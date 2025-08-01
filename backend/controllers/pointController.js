import User from '../models/User.js';
import PointHistory from '../models/PointHistory.js';
import { sendLeaderboard } from '../socket/socket.js';

export const claimPoints = async (req, res) => {
  
  const { userId } = req.body;
  const io = req.app.get('io'); // Access Socket.IO instance
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate totalPoints from PointHistory
    const historyPoints = await PointHistory.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, total: { $sum: '$points' } } },
    ]);
    const historyTotal = historyPoints.length > 0 ? historyPoints[0].total : 0;

    // Add new points
    const points = Math.floor(Math.random() * 10) + 1;
    user.totalPoints = historyTotal + points;
    await user.save();

    const history = new PointHistory({ userId, points });
    await history.save();

    // Update ranks
    await updateRanks();

    // Emit leaderboard update
    await sendLeaderboard(io);

    return res.status(200).json({
      success: true,
      message: 'Points claimed successfully',
      points,
      user: {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        totalPoints: user.totalPoints,
        rank: user.rank,
      },
    });
  } catch (error) {
    console.error('Claim points error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPointHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const history = await PointHistory.find()
      .populate('userId', 'username')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalHistory = await PointHistory.countDocuments();

    return res.status(200).json({
      success: true,
      history,
      totalPages: Math.ceil(totalHistory / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Get point history error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateRanks = async () => {
  const users = await User.find().sort({ totalPoints: -1 });
  await Promise.all(
    users.map(async (user, index) => {
      user.rank = index + 1;
      await user.save();
    })
  );
};