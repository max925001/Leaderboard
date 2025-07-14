import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Pagination parameters
  try {
    const users = await User.find()
      .select('-password')
      .sort({ totalPoints: -1 }) // Sort by points in descending order
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const totalUsers = await User.countDocuments();
    
    // Assign ranks based on sorted order
    const rankedUsers = users.map((user, index) => ({
      ...user._doc,
      rank: (page - 1) * limit + index + 1,
    }));

    res.json({
      users: rankedUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addUser = async (req, res) => {
  const { name,username } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({success:false, message: 'User already exists' });

    const user = new User({ name,username, password: 'default' }); // Default password
    await user.save();

    // Update ranks after adding a new user
    await updateRanks();

   return  res.status(201).json({ success:true, message: 'User added successfully',user });
  } catch (error) {
    return res.status(500).json({ success:false,message: 'Server error' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ totalPoints: -1 }) // Sort by points
      .limit(10); // Top 10 users
    
    // Update ranks in database
    await updateRanks();

    const rankedUsers = users.map((user, index) => ({
      ...user._doc,
      rank: index + 1,
    }));

    return res.status(200).json(rankedUsers);
  } catch (error) {
    return res.status(500).json({ success:false,message: 'Server error' });
  }
};

// Helper function to update ranks in database
const updateRanks = async () => {
  const users = await User.find().sort({ totalPoints: -1 });
  await Promise.all(
    users.map(async (user, index) => {
      user.rank = index + 1;
      await user.save();
    })
  );
};