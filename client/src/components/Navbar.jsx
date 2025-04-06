import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      className="w-full flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-2xl font-bold text-indigo-600">LexiVerse</div>

      <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <li><a href="#features" className="hover:text-indigo-600">Features</a></li>
        <li><a href="#how" className="hover:text-indigo-600">How It Works</a></li>
        <li><a href="#testimonials" className="hover:text-indigo-600">Testimonials</a></li>
        <li><a href="#footer" className="hover:text-indigo-600">Contact</a></li>
      </ul>

      <div>
        <a href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
          Get Started
        </a>
      </div>
    </motion.nav>
  );
}
