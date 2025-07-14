import User from '../models/User.js';

export const sendLeaderboard = async (io) => {
  try {
    const users = await User.find()
      .select('name username totalPoints rank')
      .sort({ totalPoints: -1 })
      .limit(10);
    const rankedUsers = users.map((user, index) => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      totalPoints: user.totalPoints,
      rank: index + 1,
    }));
    
    io.emit('leaderboardUpdate', rankedUsers);
  } catch (error) {
    console.error('Error sending leaderboard:', error);
  }
};

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Send initial leaderboard
    sendLeaderboard(io);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};