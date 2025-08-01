import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard, claimPoints, setUsers } from '../redux/slices/leaderboardSlice';
import { logout, updateUser } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const socket = io('https://leaderboard-416l.onrender.com', {
  autoConnect: false,
});

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { users, currentPage, totalPages, error } = useSelector((state) => state.leaderboard);
  const [expandedLoggedInUser, setExpandedLoggedInUser] = useState(false); // Track logged-in user details toggle
  const [claimingUsers, setClaimingUsers] = useState({}); // Track per-user claiming state

  useEffect(() => {
    dispatch(fetchLeaderboard({ page: currentPage }));
    socket.connect();

    socket.on('leaderboardUpdate', (updatedUsers) => {
      console.log('Received leaderboardUpdate:', updatedUsers);
      dispatch(setUsers(updatedUsers));
      // Update logged-in user data if present in updatedUsers
      if (user) {
        const updatedUser = updatedUsers.find((u) => u._id === user._id);
        if (updatedUser) {
          dispatch(updateUser({
            name: updatedUser.name,
            username: updatedUser.username,
            totalPoints: updatedUser.totalPoints,
            rank: updatedUser.rank,
          }));
        }
      }
    });

    return () => {
      socket.off('leaderboardUpdate');
      socket.disconnect();
    };
  }, [dispatch, currentPage]); // Removed 'user' from dependencies

  const handleClaimPoints = async (userId) => {
    setClaimingUsers((prev) => ({ ...prev, [userId]: true }));
    const result = await dispatch(claimPoints({ userId }));
    setClaimingUsers((prev) => ({ ...prev, [userId]: false }));
    if (claimPoints.fulfilled.match(result)) {
      toast.success(`Claimed ${result.payload.points} points!`);
    } else {
      toast.error(result.payload || 'Failed to claim points');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchLeaderboard({ page: newPage }));
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Logged out successfully');
    socket.disconnect();
    navigate('/login');
  };

  const handleAddNewUser = () => {
    navigate('/signup');
  };

  const toggleLoggedInUserDetails = () => {
    setExpandedLoggedInUser((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 xs:p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Logged-In User Details */}
        {user && (
          <div className="mb-4 xs:mb-6 bg-gray-800 rounded-lg p-3 xs:p-4">
            <div className="flex items-center justify-between gap-2 xs:gap-4">
              <div className="flex items-center gap-2 xs:gap-4">
                <div className="w-8 h-8 xs:w-10 xs:h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm xs:text-base">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm xs:text-base">{user.name}</p>
                  <p className="text-xs xs:text-sm text-gray-400">@{user.username}</p>
                  <p className="text-xs xs:text-sm text-gray-400">Points: {user.totalPoints}</p>
                  <p className="text-xs xs:text-sm text-gray-400">Rank: {user.rank}</p>
                </div>
              </div>
             
            </div>
           
          </div>
        )}

        {/* Header and Buttons */}
        <div className="flex flex-col xs:flex-row justify-between items-center mb-4 xs:mb-6 gap-4">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold">Leaderboard</h1>
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-4">
            <button
              onClick={handleAddNewUser}
              className="bg-blue-600 text-white px-3 xs:px-4 py-2 rounded hover:bg-blue-700 text-sm xs:text-base cursor-pointer"
            >
              Add New User
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 xs:px-4 py-2 rounded hover:bg-red-700 text-sm xs:text-base cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4 text-sm xs:text-base">{error}</p>}

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-3 xs:p-4 sm:p-6">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-4">Top 10 Users</h2>
          <div className="space-y-3 xs:space-y-4">
            {users.length === 0 ? (
              <p className="text-gray-400 text-sm xs:text-base">No users available</p>
            ) : (
              users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between gap-2 xs:gap-4 bg-gray-700 rounded-lg p-3 xs:p-4"
                >
                  <div className="flex items-center gap-2 xs:gap-4">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm xs:text-base">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm xs:text-base">{u.name}</p>
                      <p className="text-xs xs:text-sm text-gray-400">@{u.username}</p>
                      <p className="text-xs xs:text-sm text-gray-400">Points: {u.totalPoints}</p>
                      <p className="text-xs xs:text-sm text-gray-400">Rank: {u.rank}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleClaimPoints(u._id)}
                    disabled={claimingUsers[u._id]}
                    className="bg-green-600 text-white px-2 xs:px-3 py-1 rounded hover:bg-green-700 disabled:bg-green-400 text-xs xs:text-sm cursor-pointer"
                  >
                    {claimingUsers[u._id] ? 'Claiming...' : 'Claim Points'}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col xs:flex-row justify-between mt-4 xs:mt-6 gap-3 xs:gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-green-600 text-white px-3 xs:px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-600 text-sm xs:text-base cursor-pointer"
            >
              Previous
            </button>
            <p className="text-gray-400 text-center text-sm xs:text-base">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-green-600 text-white px-3 xs:px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-600 text-sm xs:text-base cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
