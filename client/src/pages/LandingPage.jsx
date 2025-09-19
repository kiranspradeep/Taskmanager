import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-md">
        <h1 className="text-2xl font-bold">TaskManager</h1>
        <nav className="flex gap-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 animate-bounce">
          Organize Your Life, One Task at a Time
        </h2>
        <p className="max-w-xl text-lg mb-8">
          A modern, responsive task manager with authentication and cloud sync. 
          Stay productive anywhere.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition">
            Get Started
          </Link>
          <Link to="/login" className="bg-blue-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-800 transition">
            Login
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-white/10">
        <p>© {new Date().getFullYear()} kiran s pradeep. All rights reserved.</p>
      </footer>
    </div>
  );
}
