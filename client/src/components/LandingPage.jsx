import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaBalanceScale,
  FaUserTie,
  FaChartLine,
} from "react-icons/fa";

// Features Section Data
const features = [
  {
    id: 1,
    title: "AI-Powered Legal Drafting",
    desc: "Generate case briefs, petitions, and contracts with just a few inputs using state-of-the-art LLMs.",
    icon: "📄",
  },
  {
    id: 2,
    title: "Injustice Analyzer",
    desc: "Input your case details and LexiVerse suggests relevant IPC sections and legal remedies.",
    icon: "⚖️",
  },
  {
    id: 3,
    title: "Smart Lawyer Matching",
    desc: "Find the right legal expert based on domain, success rate, and your legal need using AI-driven matchmaking.",
    icon: "🤝",
  },
  {
    id: 4,
    title: "Real-Time Case Tracker",
    desc: "Track your case progress, filings, and hearings—all in one seamless dashboard.",
    icon: "📈",
  },
];

// FAQ Section Data
const faqs = [
  {
    question: "Is LexiVerse suitable for non-lawyers?",
    answer:
      "Absolutely! LexiVerse is built for everyone—whether you're an individual or a legal professional.",
  },
  {
    question: "Are my case details safe?",
    answer:
      "Yes. We use military-grade encryption and comply with legal data standards.",
  },
  {
    question: "Can I talk to a real lawyer too?",
    answer:
      "Of course. LexiVerse connects you with verified legal experts based on your needs.",
  },
];

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-wide">
          LexiVerse
        </h1>
        <div className="space-x-6 hidden md:flex font-medium">
          <a href="#features" className="hover:text-[#F59E0B] transition-all">
            Features
          </a>
          <a href="#about" className="hover:text-[#F59E0B] transition-all">
            About
          </a>
          <a href="#contact" className="hover:text-[#F59E0B] transition-all">
            Contact
          </a>
        </div>
        <div className="space-x-3">
          <a href="/login">
            {" "}
            <button className="px-4 py-2 text-[#1E293B] border border-[#1E293B] rounded-lg hover:bg-[#F59E0B] hover:text-white transition-all shadow-sm">
              Login
            </button>
          </a>
          <a href="/signup">
            {" "}
            <button className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#d97706] transition-all shadow-md">
              Try LexiVerse
            </button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="text-center py-28 px-6 bg-gradient-to-br from-white via-[#F8FAFC] to-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-[#1E293B] leading-tight"
        >
          Revolutionizing Legal Services with AI
        </motion.h2>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          LexiVerse simplifies legal processes using intelligent automation,
          making justice more accessible for all.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button className="px-6 py-3 bg-[#F59E0B] text-white rounded-xl hover:bg-[#d97706] transition-all font-medium shadow-xl">
            Get Started
          </button>
          <button className="px-6 py-3 border border-gray-400 text-[#1E293B] rounded-xl hover:bg-gray-100 transition-all font-medium">
            Watch Demo
          </button>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-24 px-8 bg-[#F8FAFC]">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-[#1E293B]"
        >
          What LexiVerse Offers
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-200"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h4 className="text-2xl font-bold text-[#1E293B] mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-[#1E293B] mb-4">
              Why LexiVerse?
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              Legal processes are often complex and inaccessible. LexiVerse
              bridges this gap using advanced natural language processing and AI
              tools.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Built by legal tech enthusiasts and AI engineers</li>
              <li>Backed by robust legal data and real case precedents</li>
              <li>Fully secure, compliant and scalable</li>
            </ul>
          </motion.div>

          <motion.img
            src="https://images.unsplash.com/photo-1600674649037-59c7e0f0ed6c"
            alt="Legal AI"
            className="rounded-3xl shadow-2xl w-full h-auto object-cover"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8 bg-[#F8FAFC]">
        <h3 className="text-4xl font-bold text-center mb-16 text-[#1E293B]">
          What Our Users Say
        </h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              name: "Ananya Sharma",
              comment:
                "LexiVerse helped me file a complaint within minutes. It’s a must-have tool!",
            },
            {
              name: "Adv. Rahul Menon",
              comment:
                "As a lawyer, LexiVerse saves me hours of drafting time.",
            },
            {
              name: "Priya Dutta",
              comment:
                "Understanding my rights has never been easier—thank you LexiVerse!",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-lg italic mb-4">“{testimonial.comment}”</p>
              <h4 className="text-md font-bold text-[#F59E0B]">
                {testimonial.name}
              </h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white px-8">
        <h3 className="text-3xl font-bold text-center mb-12 text-[#1E293B]">
          FAQs
        </h3>
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#F8FAFC] border border-gray-200 p-6 rounded-xl shadow-sm"
            >
              <button
                className="w-full text-left text-lg font-medium flex justify-between items-center"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                {faq.question}
                <span>{openFAQ === index ? "-" : "+"}</span>
              </button>
              {openFAQ === index && (
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#1E293B] text-gray-200 py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="text-xl font-bold text-white mb-3">LexiVerse</h5>
            <p>
              Empowering lawyers, clients, and courts with smarter, faster legal
              solutions using AI.
            </p>
          </div>
          <div>
            <h5 className="text-xl font-bold text-white mb-3">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-[#F59E0B]">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#F59E0B]">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F59E0B]">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-xl font-bold text-white mb-3">Contact</h5>
            <p>Email: support@lexiverse.ai</p>
            <p>Phone: +91 9876543210</p>
          </div>
        </div>
        <div className="text-center mt-10 text-sm text-gray-400">
          © {new Date().getFullYear()} LexiVerse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
