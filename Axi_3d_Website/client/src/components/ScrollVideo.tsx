/**
 * ScrollVideo — Scroll-scrubbed cinematic video background
 * Fixed full-bleed z-0 layer. Renders poster → video → canvas frame cache.
 * Motion is SCROLL-DRIVEN ONLY (no autoplay loop).
 *
 * Performance optimizations:
 * - IntersectionObserver pauses rAF loop when off-screen
 * - Resize handler is debounced (150ms)
 * - LERP skips when delta < epsilon
 * - Poster uses first-frame poster image, not .mp4
 */
import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4";

const MAX_FRAMES = 90;
const MAX_FRAME_WIDTH = 960;
const LERP_FACTOR = 0.12;
const SEEK_DELTA_THRESHOLD = 0.04;
const LERP_EPSILON = 0.0005;

export default function ScrollVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLVideoElement | null>(null);

  const frameCache = useRef<ImageBitmap[]>([]);
  const cacheReady = useRef(false);
  const rafId = useRef<number>(0);
  const smoothProgress = useRef(0);
  const targetProgress = useRef(0);
  const currentFrame = useRef(-1);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const poster = posterRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !video || !wrapper) return;

    const ctx = canvas.getContext("2d", { alpha: false })!;
    const dpr = Math.min(devicePixelRatio, 2);

    // Visibility observer — pause rAF when wrapper is off-screen
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !rafId.current) {
          rafId.current = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "200px" }
    );
    visibilityObserver.observe(wrapper);

    // Debounced resize canvas to fill viewport
    let resizeTimer: ReturnType<typeof setTimeout>;
    const resizeCanvas = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawFrame(smoothProgress.current);
      }, 150);
    };

    // Object-cover draw helper
    const drawFrame = (progress: number) => {
      if (!ctx) return;
      const W = window.innerWidth;
      const H = window.innerHeight;

      if (cacheReady.current && frameCache.current.length > 0) {
        const frames = frameCache.current;
        const idx = Math.min(
          Math.round(progress * (frames.length - 1)),
          frames.length - 1
        );
        if (idx === currentFrame.current) return;
        currentFrame.current = idx;
        const bmp = frames[idx];
        // Object-cover math
        const scale = Math.max(W / bmp.width, H / bmp.height);
        const sw = bmp.width * scale;
        const sh = bmp.height * scale;
        const sx = (W - sw) / 2;
        const sy = (H - sh) / 2;
        ctx.drawImage(bmp, sx, sy, sw, sh);
      }
    };

    // Scroll → target progress
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress.current = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
    };

    // Animation loop — only runs when visible
    let lastSeekTime = -1;
    const tick = () => {
      if (!isVisibleRef.current) {
        rafId.current = 0;
        return;
      }
      rafId.current = requestAnimationFrame(tick);
      updateProgress();

      const delta = targetProgress.current - smoothProgress.current;

      // Skip if already converged
      if (Math.abs(delta) < LERP_EPSILON) {
        smoothProgress.current = targetProgress.current;
        return;
      }

      // Lerp smooth
      smoothProgress.current += delta * LERP_FACTOR;

      if (cacheReady.current) {
        drawFrame(smoothProgress.current);
      } else if (video.readyState >= 2 && video.duration > 0) {
        // Fallback: seek visible video
        const targetTime = smoothProgress.current * (video.duration - 0.05);
        if (Math.abs(targetTime - lastSeekTime) > SEEK_DELTA_THRESHOLD) {
          video.currentTime = targetTime;
          lastSeekTime = targetTime;
        }
      }
    };

    // Build frame cache from offscreen video
    const buildFrameCache = async (offscreen: HTMLVideoElement) => {
      await new Promise<void>((resolve) => {
        if (offscreen.readyState >= 1) {
          resolve();
        } else {
          offscreen.addEventListener("loadedmetadata", () => resolve(), { once: true });
        }
      });

      const duration = offscreen.duration;
      const frameCount = Math.min(
        MAX_FRAMES,
        Math.max(24, Math.floor(duration * 12))
      );

      // Determine scale factor
      const scale = Math.min(1, MAX_FRAME_WIDTH / (offscreen.videoWidth || 1920));
      const W = Math.round((offscreen.videoWidth || 1920) * scale);
      const H = Math.round((offscreen.videoHeight || 1080) * scale);

      const offscreenCanvas = new OffscreenCanvas(W, H);
      const offCtx = offscreenCanvas.getContext("2d")!;
      const bitmaps: ImageBitmap[] = [];

      for (let i = 0; i < frameCount; i++) {
        const t = (i / (frameCount - 1)) * (duration - 0.05);
        offscreen.currentTime = t;
        await new Promise<void>((resolve) => {
          offscreen.addEventListener("seeked", () => resolve(), { once: true });
        });
        offCtx.drawImage(offscreen, 0, 0, W, H);
        const bmp = await createImageBitmap(offscreenCanvas);
        bitmaps.push(bmp);
      }

      frameCache.current = bitmaps;
      cacheReady.current = true;

      // Fade out video, fade in canvas
      if (video) {
        video.style.transition = "opacity 500ms";
        video.style.opacity = "0";
      }
      canvas.style.transition = "opacity 500ms";
      canvas.style.opacity = "1";

      // Draw immediately
      drawFrame(smoothProgress.current);
    };

    // Start everything once visible video has loadeddata
    const onVideoLoaded = () => {
      // Fade out poster
      if (poster) {
        poster.style.transition = "opacity 500ms";
        poster.style.opacity = "0";
      }
      // Show video
      video.style.opacity = "1";

      // Yield 300ms, then start cache extraction
      setTimeout(async () => {
        const offscreen = document.createElement("video");
        offscreen.src = VIDEO_URL;
        offscreen.muted = true;
        offscreen.playsInline = true;
        offscreen.preload = "auto";
        offscreen.crossOrigin = "anonymous";
        offscreenRef.current = offscreen;

        try {
          await buildFrameCache(offscreen);
        } catch (err) {
          console.warn("Frame cache build failed, using seek fallback:", err);
        }
      }, 300);
    };

    video.addEventListener("loadeddata", onVideoLoaded, { once: true });

    // Initial setup
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", updateProgress, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", updateProgress);
      visibilityObserver.disconnect();
      frameCache.current.forEach((b) => b.close());
      frameCache.current = [];
      offscreenRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ background: "#0a0a0a" }}
      aria-hidden="true"
    >
      {/* Layer 1: Poster — solid background while video loads */}
      <div
        ref={posterRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #00007f 50%, #0a0a0a 100%)",
          opacity: 1,
        }}
      />

      {/* Layer 2: Visible video — used for fallback seek + fades out when canvas ready */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover", opacity: 0 }}
      />

      {/* Layer 3: Canvas — frame cache draws here, fades in when ready */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0, display: "block" }}
      />

      {/* Dark overlay so AXI text stays readable — uses AXI deep blue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,127,0.55) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </div>
  );
}
