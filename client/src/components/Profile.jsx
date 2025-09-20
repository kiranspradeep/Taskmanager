import { useState } from "react";
import axios from "axios";

export default function Profile({ user, tasks, setUser }) {
  if (!user) return null;

  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const pendingTasks = tasks?.filter(t => !t.completed).length || 0;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return alert("Name and email are required!");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (setUser) setUser(res.data);
      setIsEditOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally { setLoading(false); }
  };

  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handlePasswordSave = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;
    if (!oldPassword || !newPassword || !confirmPassword) return alert("All fields are required!");
    if (newPassword !== confirmPassword) return alert("New passwords do not match!");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/profile/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsPasswordOpen(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      alert("Password changed successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl rounded-2xl p-6 w-full max-w-5xl mx-auto flex flex-col items-center gap-6 transition-transform duration-300 hover:scale-105">
      <h2 className="text-3xl md:text-4xl font-bold text-white animate-slide-in">Profile</h2>

      <div className="flex flex-col md:flex-row gap-6 w-full items-center justify-center">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg transform transition-transform hover:scale-110">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col gap-2 text-white text-center md:text-left">
          <p><span className="font-semibold">Name:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Total Tasks:</span> {tasks.length}</p>
          <p><span className="font-semibold text-yellow-300">Pending:</span> {pendingTasks}</p>
          <p><span className="font-semibold text-green-300">Completed:</span> {completedTasks}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={() => setIsEditOpen(true)}
          className="bg-white/30 text-white px-6 py-2 rounded-lg hover:bg-white/50 transform transition hover:scale-105 shadow-md"
        >
          Edit Profile
        </button>
        <button
          onClick={() => setIsPasswordOpen(true)}
          className="bg-white/30 text-white px-6 py-2 rounded-lg hover:bg-white/50 transform transition hover:scale-105 shadow-md"
        >
          Change Password
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start md:items-center z-50 animate-slide-down overflow-auto pt-20 md:pt-0">
          <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-opacity-30 backdrop-blur-md rounded-xl w-full max-w-md p-6 shadow-2xl relative border border-white/20">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-200 text-lg font-bold">✖</button>
            <h2 className="text-2xl font-bold mb-4 text-white text-center">Edit Profile</h2>
            <div className="flex flex-col gap-4">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name"
                className="w-full px-4 py-2 border border-white/40 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white/20 text-white placeholder-white/70 transition" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email"
                className="w-full px-4 py-2 border border-white/40 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none bg-white/20 text-white placeholder-white/70 transition" />
              <button onClick={handleSave} disabled={loading}
                className="w-full bg-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/50 transition disabled:opacity-50">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start md:items-center z-50 animate-slide-down overflow-auto pt-20 md:pt-0">
          <div className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-opacity-30 backdrop-blur-md rounded-xl w-full max-w-md p-6 shadow-2xl relative border border-white/20">
            <button
              onClick={() => setIsPasswordOpen(false)}
              className="absolute top-3 right-3 text-white hover:text-gray-200 text-lg font-bold">✖</button>
            <h2 className="text-2xl font-bold mb-4 text-white text-center">Change Password</h2>
            <div className="flex flex-col gap-4">
              <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} placeholder="Old Password"
                className="w-full px-4 py-2 border border-white/40 rounded-lg focus:ring-2 focus:ring-red-300 focus:outline-none bg-white/20 text-white placeholder-white/70 transition" />
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="New Password"
                className="w-full px-4 py-2 border border-white/40 rounded-lg focus:ring-2 focus:ring-red-300 focus:outline-none bg-white/20 text-white placeholder-white/70 transition" />
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Confirm New Password"
                className="w-full px-4 py-2 border border-white/40 rounded-lg focus:ring-2 focus:ring-red-300 focus:outline-none bg-white/20 text-white placeholder-white/70 transition" />
              <button onClick={handlePasswordSave} disabled={loading}
                className="w-full bg-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/50 transition disabled:opacity-50">
                {loading ? "Saving..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
