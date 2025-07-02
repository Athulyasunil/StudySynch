import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to StudyMate</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your personal study room with notes, chat, and an AI assistant — all in one place.
      </p>

      <Link
        href="/login"
        className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        Get Started
      </Link>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        <FeatureCard
          title="📝 Notes"
          description="Write and organize your notes seamlessly with a clean editor."
        />
        <FeatureCard
          title="💬 Chat"
          description="Discuss in real time with your study group."
        />
        <FeatureCard
          title="🤖 AI Assistant"
          description="Ask questions, summarize notes, or get help instantly from your AI."
        />
      </section>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
