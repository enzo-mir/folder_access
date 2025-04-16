import { router } from '@inertiajs/react'

function ServerError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4 text-white">
      <div className="text-center max-w-md mx-auto">
        {/* Animated 404 number with space theme */}
        <div className="text-9xl font-bold text-indigo-400 mb-4 relative">
          404
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-2 left-12 w-8 h-8 bg-yellow-300 rounded-full opacity-70 blur-sm"></div>
        </div>

        <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
          Lost in Space
        </h1>

        <p className="text-lg text-indigo-200 mb-8">
          Houston, we have a problem! The page you're looking for is orbiting somewhere unknown.
        </p>

        {/* Enhanced Space-themed SVG */}
        <div className="mb-8 relative">
          <svg
            className="w-64 h-64 mx-auto"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Space background with stars */}
            {[...Array(20)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 200}
                cy={Math.random() * 200}
                r={Math.random() * 1.5}
                fill="white"
                opacity={Math.random()}
              />
            ))}
            {/* Planet */}
            <circle cx="150" cy="50" r="30" fill="#4F46E5" opacity="0.8" />
            <circle cx="145" cy="45" r="25" fill="#6366F1" opacity="0.6" />
            {/* Astronaut */}
            <circle cx="100" cy="100" r="20" fill="#E5E7EB" /> {/* Head */}
            <ellipse cx="100" cy="130" rx="15" ry="20" fill="#F3F4F6" /> {/* Body */}
            <rect x="85" y="145" width="30" height="5" rx="2" fill="#9CA3AF" /> {/* Legs */}
            <rect x="70" y="120" width="10" height="25" rx="5" fill="#E5E7EB" /> {/* Left arm */}
            <rect x="120" y="120" width="10" height="25" rx="5" fill="#E5E7EB" /> {/* Right arm */}
            <circle cx="92" cy="95" r="3" fill="#1F2937" /> {/* Left eye */}
            <circle cx="108" cy="95" r="3" fill="#1F2937" /> {/* Right eye */}
            <path d="M95 105 Q100 110 105 105" stroke="#1F2937" strokeWidth="2" fill="none" />{' '}
            {/* Smile */}
            {/* Space helmet reflection */}
            <path
              d="M85 90 Q100 80 115 90"
              stroke="white"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            {/* Floating tethers */}
            <path
              d="M100 120 Q90 140 80 160"
              stroke="#9CA3AF"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,3"
            />
            <path
              d="M100 120 Q110 140 120 160"
              stroke="#9CA3AF"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,3"
            />
          </svg>

          {/* Floating animation container */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s linear infinite`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Action buttons with space theme */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Go back
          </button>
          <button
            onClick={() => router.visit('/')}
            className="px-6 py-3 bg-transparent hover:bg-white/10 text-indigo-300 font-medium rounded-lg transition-all duration-300 border border-indigo-500 hover:border-indigo-300 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Go home
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ServerError
