// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-4xl">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 dark:text-white">
            KNOWlio
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
            Your Digital Academic Resource Platform
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access textbooks, notes, and previous year questions at up to 70% lower costs.
            Join the student community for peer support and verified professor guidance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mt-8">
          {[
            {
              title: "Digital Library",
              description: "Access textbooks and materials at reduced costs",
              icon: "📚"
            },
            {
              title: "Verified Content",
              description: "Quality-checked materials from trusted sources",
              icon: "✓"
            },
            {
              title: "Professor Connect",
              description: "Direct guidance from experienced educators",
              icon: "👨‍🏫"
            },
            {
              title: "Student Community",
              description: "Collaborate and share with fellow students",
              icon: "👥"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-12 px-8"
            href="/login"
          >
            Get Started
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-sm sm:text-base h-12 px-8"
            href="/dashboard"
          >
            View Dashboard
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-6">
          <span>© 2024 KNOWlio</span>
          <a
            className="hover:text-gray-800 dark:hover:text-gray-200"
            href="#"
          >
            About
          </a>
          <a
            className="hover:text-gray-800 dark:hover:text-gray-200"
            href="#"
          >
            Contact
          </a>
          <a
            className="hover:text-gray-800 dark:hover:text-gray-200"
            href="#"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}