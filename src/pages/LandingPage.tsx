import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

// Custom SVG components to bypass dependency issues
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

export default function LandingPage() {
  const { accessToken, initializeAuth, signOut } = useAuthStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize auth check so we know if the user is logged in
    void initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial opacity to 0
    video.style.opacity = "0";

    const handlePlay = () => {
      video.style.opacity = "1";
    };

    const handleTimeUpdate = () => {
      if (!video || !video.duration) return;

      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= 0.55) {
        video.style.opacity = "0";
      }
    };

    const handleEnded = () => {
      if (!video) return;
      video.currentTime = 0;
      video.play().catch((err) => {
        console.error("Failed to autoplay video loop:", err);
      });
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // Initial play trigger
    video.play().catch((err) => {
      console.warn("Autoplay was prevented by browser policies:", err);
    });

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col select-none text-white font-sans">
      {/* Background Loop Video */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
        muted
        playsInline
        autoPlay
        className="absolute top-0 left-0 w-full h-full object-cover translate-y-[17%] pointer-events-none z-0 transition-opacity duration-500"
      />

      {/* Subtle overlay to enhance dark cinematic mood */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* Navigation bar */}
      <header className="relative z-20 w-full px-6 py-6">
        <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto w-full transition-all duration-300">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 text-white font-semibold text-lg transition-transform hover:scale-105 duration-200"
            >
              <img
                src="/logo.svg"
                alt="Ostro Logo"
                className="h-9 w-auto drop-shadow-md"
              />
              <span className="tracking-wide">Ostro</span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Tính năng
              </a>
              <a
                href="#about"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Về chúng tôi
              </a>
              <a
                href="#about"
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Giới thiệu
              </a>
            </nav>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            {accessToken ? (
              <>
                <button
                  onClick={() => void signOut()}
                  className="text-white/85 hover:text-white transition-colors text-sm font-medium cursor-pointer"
                >
                  Đăng xuất
                </button>
                <Link
                  to="/chat"
                  className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 active:scale-95 transition-all duration-200"
                >
                  Trải nghiệm ngay
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-white/85 hover:text-white transition-colors text-sm font-medium"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/signin"
                  className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 active:scale-95 transition-all duration-200"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero content area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap select-none font-normal italic"
        >
          Where Every Conversation Comes Alive
        </h1>

        <div className="max-w-xl w-full space-y-6 flex flex-col items-center">
          {/* Discover Now Button */}
          <Link
            to="/signin"
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Khám phá ngay
          </Link>
        </div>
      </main>

      {/* Social icons footer */}
      <footer className="relative z-10 flex justify-center gap-4 pb-12">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Theo dõi Ostro trên Instagram"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 active:scale-90 transition-all duration-200"
        >
          <InstagramIcon className="h-5 w-5" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Theo dõi Ostro trên Twitter"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 active:scale-90 transition-all duration-200"
        >
          <TwitterIcon className="h-5 w-5" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ghé thăm trang web chính thức của Ostro"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 active:scale-90 transition-all duration-200"
        >
          <Globe className="h-5 w-5" />
        </a>
      </footer>
    </div>
  );
}
