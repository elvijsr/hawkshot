import { useState, useEffect, useRef } from "react";
import { Search, AlertCircle, Loader2 } from "lucide-react";
import type { AssessmentData } from "../utils/api";
import { assessProduct, type ApiError } from "../utils/api";

interface HomePageProps {
  onAssess: (assessment: AssessmentData, rawResponse?: unknown, responseTimestamp?: string, fetchTime?: number) => void;
}

const LOADING_MESSAGES = [
  "Scanning security protocols...",
  "Asking the security gods for wisdom...",
  "Checking if the vendor left their keys in the car...",
  "Counting CVEs (this might take a while)...",
  "Evaluating vendor reputation (no pressure)...",
  "Calculating risk scores with a magic 8-ball...",
  "Gathering security evidence from the dark web...",
  "Reviewing CVE databases (there are a lot of them)...",
  "Assessing security controls (they better be good)...",
  "Almost there, promise!",
  "This is taking longer than expected...",
  "Still working on it (blame the API)...",
  "Just a few more seconds...",
  "Consulting with security experts (they're busy)...",
  "Running the numbers (they're not adding up)...",
  "Double-checking everything (trust issues)...",
  "Still loading... (insert loading joke here)",
  "Please wait while we judge this software...",
  "Analyzing trust metrics (trust us, we're good at this)...",
  "Checking for vulnerabilities (found 42, but who's counting)...",
];

export function HomePage({ onAssess }: HomePageProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [displayedText, setDisplayedText] = useState("Evaluate the Safety of Any Software Product");
  const [showCursor, setShowCursor] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<{
    phase: 'idle' | 'erasing-original' | 'typing' | 'paused-after-typing' | 'erasing-message';
    messageIndex: number;
    charIndex: number;
  }>({
    phase: 'idle',
    messageIndex: 0,
    charIndex: 0,
  });

  // Timer effect - updates every 100ms when loading
  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now();
      setElapsedTime(0);
      setDisplayedText("Evaluate the Safety of Any Software Product");
      animationRef.current = {
        phase: 'idle',
        messageIndex: 0,
        charIndex: 0,
      };
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000; // Convert to seconds
          setElapsedTime(elapsed);
        }
      }, 100); // Update every 100ms (tenths of seconds)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      startTimeRef.current = null;
      setDisplayedText("Evaluate the Safety of Any Software Product");
      setShowCursor(false);
      animationRef.current = {
        phase: 'idle',
        messageIndex: 0,
        charIndex: 0,
      };
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loading]);

  // Typing animation effect - starts after 3 seconds of loading
  useEffect(() => {
    if (!loading || elapsedTime < 3) {
      return;
    }

    const originalText = "Evaluate the Safety of Any Software Product";
    const typingSpeed = 30; // ms per character
    const erasingSpeed = 20; // ms per character (faster)
    const pauseAfterTyping = 2000; // pause before erasing
    const pauseAfterErasing = 500; // pause before next message

    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const animate = () => {
      if (!isActive || !loading) {
        return;
      }

      const state = animationRef.current;
      
      if (state.phase === 'idle') {
        // Start erasing original text
        if (displayedText === originalText && displayedText.length > 0) {
          state.phase = 'erasing-original';
          timeoutId = setTimeout(() => {
            if (isActive && loading) {
              setDisplayedText(prev => prev.slice(0, -1));
              animate();
            }
          }, erasingSpeed);
        }
      } else if (state.phase === 'erasing-original') {
        // Continue erasing original text
        if (displayedText.length > 0) {
          timeoutId = setTimeout(() => {
            if (isActive && loading) {
              setDisplayedText(prev => prev.slice(0, -1));
              animate();
            }
          }, erasingSpeed);
        } else {
          // Finished erasing, start typing a random message
          state.phase = 'typing';
          state.messageIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
          state.charIndex = 0;
          setShowCursor(true);
          timeoutId = setTimeout(() => {
            if (isActive && loading) {
              const message = LOADING_MESSAGES[state.messageIndex];
              if (message && message.length > 0) {
                setDisplayedText(message[0]);
                state.charIndex = 1;
                animate();
              }
            }
          }, pauseAfterErasing);
        }
      } else if (state.phase === 'typing') {
        // Continue typing current message
        const message = LOADING_MESSAGES[state.messageIndex];
        if (message && state.charIndex < message.length) {
          timeoutId = setTimeout(() => {
            if (isActive && loading) {
              setDisplayedText(message.slice(0, state.charIndex + 1));
              state.charIndex++;
              animate();
            }
          }, typingSpeed);
        } else {
          // Finished typing, pause then start erasing
          setShowCursor(false);
          state.phase = 'paused-after-typing';
          timeoutId = setTimeout(() => {
            if (isActive && loading) {
              state.phase = 'erasing-message';
              animate();
            }
          }, pauseAfterTyping);
        }
      } else if (state.phase === 'erasing-message') {
        // Continue erasing current message
        if (displayedText.length > 0) {
          timeoutId = setTimeout(() => {
            if (isActive && loading) {
              setDisplayedText(prev => prev.slice(0, -1));
              animate();
            }
          }, erasingSpeed);
        } else {
          // Finished erasing, move to next message and start typing
          state.messageIndex = (state.messageIndex + 1) % LOADING_MESSAGES.length;
          state.phase = 'typing';
          state.charIndex = 0;
          setShowCursor(true);
          timeoutId = setTimeout(() => {
            if (isActive && loading) {
              const nextMessage = LOADING_MESSAGES[state.messageIndex];
              if (nextMessage && nextMessage.length > 0) {
                setDisplayedText(nextMessage[0]);
                state.charIndex = 1;
                animate();
              }
            }
          }, pauseAfterErasing);
        }
      }
    };

    // Start animation
    animate();

    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, elapsedTime, displayedText]);

  const formatTime = (seconds: number): string => {
    const wholeSeconds = Math.floor(seconds);
    const tenths = Math.floor((seconds - wholeSeconds) * 10);
    return `${wholeSeconds}.${tenths}s`;
  };

  const handleAssess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setElapsedTime(0);
    const startTime = Date.now();
    
    try {
      const result = await assessProduct(input);
      // Get raw response from the result if available, otherwise use result itself
      const rawResponse = (result as any)._rawResponse || result;
      // Capture the timestamp when response is received
      const responseTimestamp = new Date().toISOString();
      // Calculate final fetch time
      const fetchTime = (Date.now() - startTime) / 1000; // in seconds
      onAssess(result, rawResponse, responseTimestamp, fetchTime);
    } catch (err) {
      console.error("Assessment failed:", err);
      const apiError = err as ApiError;
      setError(
        apiError.message || 
        "Failed to assess product. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAssess();
    }
  };

  const examples = [
    { label: "Slack", value: "Slack" },
    { label: "Notion", value: "Notion" },
    { label: "GitHub Repo", value: "https://github.com/vercel/next.js" },
  ];

  return (
    <div className={`flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 w-full transition-all duration-500 ${
      loading ? 'bg-homepage-gradient-loading' : 'bg-homepage-gradient'
    }`}>
      <div className="w-full max-w-3xl space-y-4">
        <div className="mb-10 text-center gap-2">
          <div className="mb-5 inline-flex items-center gap-3 justify-center">
            <div className="text-2xl font-semibold min-h-[2rem] flex items-center">
              {displayedText}
              {(loading && elapsedTime >= 3 && showCursor) && (
                <span className="inline-block w-0.5 h-6 bg-gray-900 ml-1 animate-pulse">|</span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg relative overflow-hidden">
          <label htmlFor="product-input" className="mb-3 block text-sm font-medium text-gray-700">
            Product name or URL
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-opacity ${loading ? 'opacity-50' : ''}`} />
              <input
                id="product-input"
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Slack, or https://github.com/vercel/next.js"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 disabled:cursor-wait"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleAssess}
              disabled={!input.trim() || loading}
              className="rounded-lg bg-black px-8 py-3 font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Fetching...</span>
                  <span className="text-sm opacity-75">{formatTime(elapsedTime)}</span>
                </>
              ) : (
                "Shoot!"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-2 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Assessment Failed</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Try:</span>
            {examples.map((example) => (
              <button
                key={example.label}
                onClick={() => setInput(example.value)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {example.label}
              </button>
            ))}
          </div>
      </div>
    </div>
  );
}
