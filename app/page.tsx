"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Crown,
  MapPin,
  Music2,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  Be_Vietnam_Pro,
  Great_Vibes,
  Noto_Serif_Display,
} from "next/font/google";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const bodyFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const headingFont = Noto_Serif_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  variable: "--font-heading-wedding",
});

const scriptFont = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
});

const WEDDING_DATE = new Date("2026-10-18T17:00:00+07:00").getTime();
const INTRO_ZOOM_DURATION = 520;
const INTRO_OPEN_DURATION = 760;

const SLIDES = [
  {
    src: "/images/reference/gallery/gallery-1.jpg",
    alt: "Ảnh cưới 1",
  },
  {
    src: "/images/reference/gallery/gallery-2.jpg",
    alt: "Ảnh cưới 2",
  },
  {
    src: "/images/reference/gallery/gallery-3.jpg",
    alt: "Ảnh cưới 3",
  },
  {
    src: "/images/reference/gallery/gallery-4.jpg",
    alt: "Ảnh cưới 4",
  },
  {
    src: "/images/reference/gallery/gallery-5.jpg",
    alt: "Ảnh cưới 5",
  },
  {
    src: "/images/reference/gallery/gallery-6.jpg",
    alt: "Ảnh cưới 6",
  },
  {
    src: "/images/reference/gallery/gallery-7.jpg",
    alt: "Ảnh cưới 7",
  },
  {
    src: "/images/reference/gallery/gallery-8.jpg",
    alt: "Ảnh cưới 8",
  },
  {
    src: "/images/reference/gallery/gallery-9.jpg",
    alt: "Ảnh cưới 9",
  },
  {
    src: "/images/reference/gallery/gallery-10.jpg",
    alt: "Ảnh cưới 10",
  },
  {
    src: "/images/reference/gallery/gallery-11.jpg",
    alt: "Ảnh cưới 11",
  },
  {
    src: "/images/reference/gallery/gallery-12.jpg",
    alt: "Ảnh cưới 12",
  },
  {
    src: "/images/reference/gallery/gallery-13.jpg",
    alt: "Ảnh cưới 13",
  },
  {
    src: "/images/reference/gallery/gallery-14.jpg",
    alt: "Ảnh cưới 14",
  },
  {
    src: "/images/reference/gallery/gallery-15.jpg",
    alt: "Ảnh cưới 15",
  },
] as const;

const FALLING_ITEMS = [
  { left: "6%", delay: "0s", duration: "26s", size: "16px", char: "❤" },
  { left: "16%", delay: "4s", duration: "30s", size: "14px", char: "❀" },
  { left: "27%", delay: "2s", duration: "27s", size: "15px", char: "❤" },
  { left: "39%", delay: "6s", duration: "31s", size: "13px", char: "❀" },
  { left: "51%", delay: "3s", duration: "29s", size: "15px", char: "❤" },
  { left: "62%", delay: "5s", duration: "32s", size: "12px", char: "❀" },
  { left: "74%", delay: "3.5s", duration: "28s", size: "14px", char: "❤" },
  { left: "87%", delay: "2.5s", duration: "30s", size: "16px", char: "❀" },
] as const;

const INTRO_HI_ITEMS = [
  { left: "4%", delay: "0s", duration: "10.5s", size: "20px" },
  { left: "11%", delay: "1.2s", duration: "9.8s", size: "17px" },
  { left: "18%", delay: "2.1s", duration: "10.2s", size: "15px" },
  { left: "28%", delay: "0.8s", duration: "10.8s", size: "18px" },
  { left: "37%", delay: "1.7s", duration: "9.6s", size: "14px" },
  { left: "46%", delay: "2.3s", duration: "10.4s", size: "19px" },
  { left: "54%", delay: "0.5s", duration: "10s", size: "16px" },
  { left: "63%", delay: "1.9s", duration: "10.6s", size: "15px" },
  { left: "73%", delay: "1.1s", duration: "9.9s", size: "18px" },
  { left: "82%", delay: "2.6s", duration: "10.7s", size: "16px" },
  { left: "90%", delay: "0.9s", duration: "9.7s", size: "19px" },
  { left: "96%", delay: "1.5s", duration: "10.3s", size: "14px" },
] as const;

const COUPLE_PORTRAITS = [
  {
    role: "Chú rể",
    name: "Hoàng Nam",
    src: "/images/reference/portraits/groom.jpg",
  },
  {
    role: "Cô dâu",
    name: "Thanh Tú",
    src: "/images/reference/portraits/bride.jpg",
  },
] as const;

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Blessing = {
  id: number;
  name: string;
  message: string;
  time: string;
};

function getCountdown(): Countdown {
  const distance = WEDDING_DATE - Date.now();

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export default function Home() {
  const [introOpen, setIntroOpen] = useState(false);
  const [introZoom, setIntroZoom] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown());
  const [slideIndex, setSlideIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [tracks, setTracks] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [blessings, setBlessings] = useState<Blessing[]>([
    {
      id: 1,
      name: "Gia đình Anh Tuấn",
      message:
        "Chúc hai em trăm năm hạnh phúc, luôn yêu thương và đồng hành cùng nhau.",
      time: "2 giờ trước",
    },
    {
      id: 2,
      name: "Lan & Minh",
      message:
        "Chúc mừng đám cưới! Mong hai bạn luôn ngập tràn tiếng cười và bình an.",
      time: "5 giờ trước",
    },
    {
      id: 3,
      name: "Đồng nghiệp công ty",
      message:
        "Chúc cô dâu chú rể viên mãn, phát tài phát lộc và luôn hạnh phúc.",
      time: "Hôm nay",
    },
  ]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const introTimersRef = useRef<number[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!introDone) {
      return;
    }

    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4300);

    return () => window.clearInterval(timer);
  }, [introDone]);

  useEffect(() => {
    if (introDone) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [introDone]);

  useEffect(() => {
    return () => {
      introTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      introTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio == null) {
      return;
    }

    const handlePlay = () => setMusicOn(true);
    const handlePause = () => setMusicOn(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const response = await fetch("/api/music", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { tracks?: string[] };
        setTracks(Array.isArray(data.tracks) ? data.tracks : []);
      } catch {
        setTracks([]);
      }
    };

    void loadTracks();
  }, []);

  const currentTrack = tracks[trackIndex] ?? "";

  useEffect(() => {
    if (!introOpen || !currentTrack) {
      return;
    }

    const audio = audioRef.current;

    if (audio == null) {
      return;
    }

    void audio.play().catch(() => {
      setMusicOn(false);
    });
  }, [introOpen, currentTrack]);

  useEffect(() => {
    if (!musicOn || !currentTrack) {
      return;
    }

    const audio = audioRef.current;

    if (audio == null) {
      return;
    }

    void audio.play().catch(() => {
      setMusicOn(false);
    });
  }, [musicOn, currentTrack]);

  useEffect(() => {
    if (trackIndex < tracks.length) {
      return;
    }

    setTrackIndex(0);
  }, [trackIndex, tracks.length]);

  const countdownItems = useMemo(
    () => [
      { label: "Ngày", value: countdown.days },
      { label: "Giờ", value: countdown.hours },
      { label: "Phút", value: countdown.minutes },
      { label: "Giây", value: countdown.seconds },
    ],
    [countdown],
  );

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyBankInfo = async () => {
    try {
      await navigator.clipboard.writeText("123456789 - NGUYEN VAN A - ACB");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (audio == null) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
      return;
    }

    audio.pause();
    setMusicOn(false);
  };

  const handleOpenInvite = () => {
    if (introDone) {
      return;
    }

    if (introOpen) {
      setIntroDone(true);
      return;
    }

    setIntroOpen(true);
    setIntroZoom(true);
    setMusicOn(true);

    const finishTimer = window.setTimeout(
      () => setIntroDone(true),
      Math.min(INTRO_OPEN_DURATION, 700),
    );
    const fallbackTimer = window.setTimeout(
      () => setIntroDone(true),
      1800,
    );

    introTimersRef.current.push(finishTimer, fallbackTimer);
  };

  const handleBlessingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const safeName = name.trim();
    const safeMessage = message.trim();

    if (!safeName || !safeMessage) {
      return;
    }

    setBlessings((prev) => [
      {
        id: Date.now(),
        name: safeName,
        message: safeMessage,
        time: "Vừa xong",
      },
      ...prev,
    ]);

    setName("");
    setMessage("");
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handleTrackEnded = () => {
    if (tracks.length === 0) {
      return;
    }

    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  return (
    <>
      {!introDone ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[linear-gradient(to_bottom_right,#4a1212,#3a0e0e,#2a0808)] px-6">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {INTRO_HI_ITEMS.map((item, index) => (
              <span
                key={index}
                aria-hidden
                className="absolute bottom-[-12%] select-none text-[#f0d497]/50 animate-intro-hi-rise"
                style={{
                  left: item.left,
                  animationDelay: item.delay,
                  animationDuration: item.duration,
                  fontSize: item.size,
                }}
              >
                囍
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[34vw] overflow-hidden lg:block">
            <Image
              src="/images/reference/songlong/dragon_left.webp"
              alt=""
              aria-hidden
              width={900}
              height={900}
              className="absolute left-[-44%] top-1/2 w-[580px] -translate-y-1/2 rotate-[72deg] opacity-14 blur-[1px]"
            />
            <Image
              src="/images/reference/songlong/cloud_big.webp"
              alt=""
              aria-hidden
              width={220}
              height={220}
              className="absolute bottom-[12%] left-[24%] w-36 opacity-25"
            />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34vw] overflow-hidden lg:block">
            <Image
              src="/images/reference/songlong/dragon_right.webp"
              alt=""
              aria-hidden
              width={900}
              height={900}
              className="absolute right-[-44%] top-1/2 w-[580px] -translate-y-1/2 -rotate-[72deg] opacity-14 blur-[1px]"
            />
            <Image
              src="/images/reference/songlong/cloud_big.webp"
              alt=""
              aria-hidden
              width={220}
              height={220}
              className="absolute right-[24%] top-[12%] w-36 -scale-x-100 opacity-25"
            />
          </div>
          <div className="flex w-full max-w-[620px] flex-col items-center text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#f0d497]">
              Thiệp Cưới
            </p>
            <div
              className="relative mx-auto w-[min(100%,352px)] sm:w-[340px] md:w-[520px] lg:w-[600px]"
              style={{
                transform: introZoom
                  ? "translateY(-8px) scale(6.8)"
                  : "translateY(0) scale(1)",
                opacity: introZoom ? 0 : 1,
                transformOrigin: "50% 50%",
                transition: `transform ${INTRO_ZOOM_DURATION}ms cubic-bezier(0.18, 0.9, 0.36, 1), opacity ${INTRO_ZOOM_DURATION}ms ease`,
                willChange: "transform, opacity",
              }}
            >
              <div className="relative rounded-lg shadow-[0_25px_60px_-12px_rgba(0,0,0,0.45),0_8px_24px_rgba(0,0,0,0.2),0_0_40px_rgba(240,212,151,0.15)]">
                <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
                  <Image
                    src="/images/reference/songlong/dragon_left.webp"
                    alt=""
                    aria-hidden
                    width={360}
                    height={360}
                    className="animate-intro-dragon-left absolute -left-[90px] -top-[70px] w-[250px] rotate-[30deg] opacity-0 md:-left-[110px] md:-top-[95px] md:w-[340px]"
                  />
                  <Image
                    src="/images/reference/songlong/dragon_right.webp"
                    alt=""
                    aria-hidden
                    width={360}
                    height={360}
                    className="animate-intro-dragon-right absolute -bottom-[48px] -right-[120px] w-[250px] -rotate-[30deg] opacity-0 md:-bottom-[85px] md:-right-[130px] md:w-[340px]"
                  />
                </div>
                <div className="absolute left-1/2 top-[50px] z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0d497,rgb(210,182,121))] shadow-[0_4px_20px_rgba(240,212,151,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)]">
                  <span
                    className="h-8 w-8 bg-[#4a1212] opacity-90"
                    style={{
                      WebkitMaskImage:
                        "url('/images/reference/songlong/chinese_happiness.webp')",
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskImage:
                        "url('/images/reference/songlong/chinese_happiness.webp')",
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                    }}
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg border border-[#f0d497]/20 bg-[#a31d16]">
                  <Image
                    src="/images/reference/songlong/dragon_left.webp"
                    alt=""
                    aria-hidden
                    width={300}
                    height={300}
                    className="pointer-events-none absolute -left-[95px] -top-[50px] w-[220px] rotate-[30deg] opacity-30 md:-left-[100px] md:-top-[80px] md:w-[300px]"
                  />
                  <Image
                    src="/images/reference/songlong/dragon_right.webp"
                    alt=""
                    aria-hidden
                    width={300}
                    height={300}
                    className="pointer-events-none absolute -bottom-[30px] -right-[120px] w-[220px] -rotate-[30deg] opacity-30 md:-bottom-[80px] md:-right-[110px] md:w-[300px]"
                  />
                  <Image
                    src="/images/reference/songlong/cloud_small.webp"
                    alt=""
                    aria-hidden
                    width={70}
                    height={70}
                    className="pointer-events-none absolute right-3 top-3 w-[50px] opacity-40 md:right-4 md:top-4 md:w-[70px]"
                  />
                  <Image
                    src="/images/reference/songlong/cloud_big.webp"
                    alt=""
                    aria-hidden
                    width={70}
                    height={70}
                    className="pointer-events-none absolute bottom-3 left-3 w-[50px] -scale-x-100 opacity-40 md:bottom-4 md:left-4 md:w-[70px]"
                  />
                  <Image
                    src="/images/reference/songlong/wave.webp"
                    alt=""
                    aria-hidden
                    width={70}
                    height={70}
                    className="pointer-events-none absolute bottom-2 left-1/2 w-[50px] -translate-x-1/2 opacity-20 md:w-[70px]"
                  />
                  <div className="relative z-10 px-6 pb-14 pt-28 text-center md:pb-8 md:pt-24">
                    <h1
                      className="mb-2 text-3xl leading-tight text-[#f0d497] sm:text-4xl"
                      style={{
                        fontFamily:
                          '"Fz Aghita", "Baskerville", "Times New Roman", serif',
                      }}
                    >
                      Minh
                      <br />
                      <span className="text-lg sm:text-xl">&</span>
                      <br />
                      Linh
                    </h1>
                    <div className="mb-2 flex items-center justify-center gap-3">
                      <div className="h-px w-10 bg-[linear-gradient(to_right,transparent,#f0d497)]" />
                      <span className="text-sm text-[#f0d497]/70">❦</span>
                      <div className="h-px w-10 bg-[linear-gradient(to_left,transparent,#f0d497)]" />
                    </div>
                    <div
                      className="mb-5 flex flex-col items-center text-[18px] text-[#f0d497]/85"
                      style={{
                        fontFamily: '"Lora", "Times New Roman", serif',
                      }}
                    >
                      <span>18 tháng 10, 2026</span>
                    </div>
                    <div className="mb-6">
                      <p
                        className="text-[18px] font-light text-[#f0d497]/85"
                        style={{
                          fontFamily: '"Lora", "Times New Roman", serif',
                        }}
                      >
                        <span>Thân Mời</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleOpenInvite}
              className="relative mt-7 h-11 overflow-hidden rounded-full border border-[#f0d497]/35 bg-[#f0d497] px-8 text-lg font-semibold text-[#4a1212] shadow-[0_4px_14px_rgba(240,212,151,0.35)] hover:bg-[#e7c67f]"
              style={{ fontFamily: '"Lora", "Times New Roman", serif' }}
            >
              {introOpen ? "Đang mở thiệp..." : "Mở thiệp"}
              <span className="pointer-events-none absolute -left-10 top-0 h-full w-8 animate-intro-shine bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)]" />
            </Button>
          </div>
        </div>
      ) : null}

      <main
        className={`${bodyFont.variable} ${headingFont.variable} ${scriptFont.variable} relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#2a0808_0%,#3a0e0e_30%,#4a1212_62%,#2f0909_100%)] text-[#fff7f7]`}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[18vw] min-w-[160px] overflow-hidden 2xl:block">
          <Image
            src="/images/reference/songlong/dragon_left.webp"
            alt=""
            aria-hidden
            width={420}
            height={1100}
            className="absolute left-[-62%] top-[8%] w-[330px] rotate-[74deg] opacity-10"
          />
          <Image
            src="/images/reference/anhdao/flower_branch.webp"
            alt=""
            aria-hidden
            width={320}
            height={900}
            className="absolute left-[-30%] top-[20%] w-[220px] rotate-[8deg] opacity-30"
          />
          <Image
            src="/images/reference/anhdao/flower_branch.webp"
            alt=""
            aria-hidden
            width={320}
            height={900}
            className="absolute left-[-26%] top-[54%] w-[245px] -rotate-[4deg] opacity-24"
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[18vw] min-w-[160px] overflow-hidden 2xl:block">
          <Image
            src="/images/reference/songlong/dragon_right.webp"
            alt=""
            aria-hidden
            width={420}
            height={1100}
            className="absolute right-[-62%] top-[8%] w-[330px] -rotate-[74deg] opacity-10"
          />
          <Image
            src="/images/reference/anhdao/flower_branch.webp"
            alt=""
            aria-hidden
            width={320}
            height={900}
            className="absolute right-[-30%] top-[20%] w-[220px] -rotate-[8deg] -scale-x-100 opacity-30"
          />
          <Image
            src="/images/reference/anhdao/flower_branch.webp"
            alt=""
            aria-hidden
            width={320}
            height={900}
            className="absolute right-[-26%] top-[54%] w-[245px] rotate-[4deg] -scale-x-100 opacity-24"
          />
        </div>
        {currentTrack ? (
          <audio
            ref={audioRef}
            preload="metadata"
            src={currentTrack}
            onEnded={handleTrackEnded}
          />
        ) : (
          <audio ref={audioRef} preload="metadata" onEnded={handleTrackEnded} />
        )}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(240,212,151,0.24)_0%,transparent_24%),radial-gradient(circle_at_84%_14%,rgba(240,212,151,0.16)_0%,transparent_23%),radial-gradient(circle_at_52%_90%,rgba(240,212,151,0.14)_0%,transparent_20%)] opacity-70" />
          {FALLING_ITEMS.map((item, index) => (
            <span
              key={index}
              aria-hidden
              className="absolute -top-10 select-none text-[#ffdbe8]/70 animate-falling-love"
              style={{
                left: item.left,
                animationDelay: item.delay,
                animationDuration: item.duration,
                fontSize: item.size,
              }}
            >
              {item.char}
            </span>
          ))}
        </div>

        <section className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-8">
          <div className="rounded-[2rem] border border-[#f0d497]/35 bg-[linear-gradient(145deg,rgba(74,18,18,0.82)_0%,rgba(58,14,14,0.82)_100%)] p-6 shadow-[0_18px_48px_rgba(7,1,1,0.7)] md:p-10">
            <div className="relative overflow-hidden rounded-[1.6rem] border border-[#f0d497]/35 bg-[#5a1614]/75 p-6 md:p-9">
              <Image
                src="/images/reference/songlong/dragon_left.webp"
                alt=""
                aria-hidden
                width={300}
                height={300}
                className="pointer-events-none absolute -left-20 -top-24 w-[260px] rotate-[30deg] opacity-20"
              />
              <Image
                src="/images/reference/songlong/dragon_right.webp"
                alt=""
                aria-hidden
                width={300}
                height={300}
                className="pointer-events-none absolute -bottom-20 -right-20 w-[260px] -rotate-[30deg] opacity-20"
              />
              <Image
                src="/images/reference/songlong/cloud_small.webp"
                alt=""
                aria-hidden
                width={80}
                height={80}
                className="pointer-events-none absolute right-4 top-4 w-16 opacity-35"
              />
              <Image
                src="/images/reference/songlong/cloud_big.webp"
                alt=""
                aria-hidden
                width={80}
                height={80}
                className="pointer-events-none absolute bottom-4 left-4 w-16 opacity-35"
              />
              <Image
                src="/images/reference/songlong/wave.webp"
                alt=""
                aria-hidden
                width={70}
                height={70}
                className="pointer-events-none absolute bottom-3 left-1/2 w-14 -translate-x-1/2 opacity-25"
              />
              <div className="flex items-center justify-center gap-3 text-[#f0d497]">
                <Crown className="size-4" />
                <span className="text-[11px] uppercase tracking-[0.28em]">
                  Song Long Hỷ
                </span>
                <Crown className="size-4" />
              </div>

              <p className="mt-6 text-center font-[var(--font-script)] text-6xl leading-none text-[#f0d497] md:text-8xl">
                Minh & Linh
              </p>
              <p className="mt-4 text-center text-base leading-7 text-[#f3e5c2] md:text-lg">
                Trân trọng kính mời bạn và gia đình đến tham dự lễ thành hôn,
                <br className="hidden sm:block" />
                chung vui cùng chúng tôi trong ngày trọng đại.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-[#f3e5c2]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f0d497]/50 bg-[#3d1010]/55 px-3 py-1.5">
                  <CalendarDays className="size-4" />
                  17:00 - Chủ nhật, 18.10.2026
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f0d497]/50 bg-[#3d1010]/55 px-3 py-1.5">
                  <MapPin className="size-4" />
                  The Adora Center, Tân Bình, TP.HCM
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {countdownItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#f0d497]/45 bg-[#3f1010]/65 px-3 py-4 text-center"
                  >
                    <p className="font-[var(--font-heading-wedding)] text-4xl font-semibold text-[#f0d497]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#e6c883]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => scrollTo("blessings")}
                  className="h-11 rounded-full border border-[#f0d497]/65 bg-[#f0d497] px-6 text-[#4a1212] hover:bg-[#e5c277]"
                >
                  Gửi lời chúc
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollTo("gallery")}
                  className="h-11 rounded-full border-[#f0d497]/55 bg-[#641a16] px-6 text-[#f0d497] hover:bg-[#531312]"
                >
                  Xem ảnh cưới
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <div className="rounded-3xl border border-[#f0d497]/35 bg-[#4a1212]/80 p-5 md:p-7">
            <div className="mb-6 text-center">
              <p className="font-[var(--font-script)] text-5xl text-[#f0d497]">
                Cô Dâu & Chú Rể
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#e6c883]">
                Ảnh đại diện
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {COUPLE_PORTRAITS.map((person) => (
                <article
                  key={person.role}
                  className="rounded-3xl border border-[#f0d497]/40 bg-[#360c0c]/70 p-4"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-[#f0d497]/35">
                    <Image
                      src={person.src}
                      alt={person.role}
                      width={800}
                      height={1000}
                      className="h-[360px] w-full object-cover md:h-[420px]"
                    />
                  </div>
                  <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-[#e6c883]">
                    {person.role}
                  </p>
                  <p className="mt-1 text-center font-[var(--font-heading-wedding)] text-3xl text-[#f0d497]">
                    {person.name}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="gallery"
          className="relative mx-auto max-w-6xl px-5 pb-16 md:px-8"
        >
          <div className="mb-7 text-center">
            <p className="font-[var(--font-script)] text-5xl text-white">
              Khoảnh Khắc Yêu Thương
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.12em] text-[#ffe7ef]">
              Slide nhiều ảnh cưới
            </p>
          </div>

          <div className="rounded-3xl border border-[#f0d497]/75 bg-[#5a1614]/55 p-4 md:p-6">
            <div className="relative overflow-hidden rounded-2xl border border-[#f0d497]/75 bg-[#3d1010]/55">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SLIDES[slideIndex].src}
                alt={SLIDES[slideIndex].alt}
                className="h-[280px] w-full object-cover md:h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4f0a21]/50 via-transparent to-transparent" />

              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[#f0d497]/75 bg-white/85 p-2 text-[#4a1212]"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#f0d497]/75 bg-white/85 p-2 text-[#4a1212]"
                aria-label="Ảnh tiếp theo"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSlideIndex(index)}
                  aria-label={`Đến ảnh ${index + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === slideIndex ? "bg-white" : "bg-[#ffd5e4]/65"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-6xl px-5 pb-16 md:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-3xl border border-[#f0d497]/75 bg-[#5a1614]/60 p-6">
              <CalendarDays className="size-5 text-[#f3e5c2]" />
              <h2 className="mt-4 font-[var(--font-heading-wedding)] text-2xl text-white">
                Lễ Thành Hôn
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#f3e5c2]">
                Chủ nhật, ngày 18 tháng 10 năm 2026
              </p>
            </article>

            <article className="rounded-3xl border border-[#f0d497]/75 bg-[#5a1614]/60 p-6">
              <Clock3 className="size-5 text-[#f3e5c2]" />
              <h2 className="mt-4 font-[var(--font-heading-wedding)] text-2xl text-white">
                Thời Gian
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#f3e5c2]">
                Đón khách 16:30 - Nghi lễ bắt đầu 17:00
              </p>
            </article>

            <article className="rounded-3xl border border-[#f0d497]/75 bg-[#5a1614]/60 p-6">
              <MapPin className="size-5 text-[#f3e5c2]" />
              <h2 className="mt-4 font-[var(--font-heading-wedding)] text-2xl text-white">
                Địa Điểm
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#f3e5c2]">
                Sảnh Jasmine, 431 Hoàng Văn Thụ, Quận Tân Bình, TP.HCM
              </p>
            </article>
          </div>
        </section>

        <section
          id="blessings"
          className="relative mx-auto max-w-6xl px-5 pb-16 md:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-[#f0d497]/75 bg-[#5a1614]/62 p-7">
              <h3 className="font-[var(--font-heading-wedding)] text-3xl text-white">
                Sổ Lưu Bút Chúc Phúc
              </h3>
              <p className="mt-2 text-sm text-[#f3e5c2]">
                Thay cho xác nhận tham dự, bạn có thể để lại lời chúc tại đây để
                cô dâu chú rể lưu giữ như một bài viết có nhiều bình luận.
              </p>

              <form className="mt-5 grid gap-3" onSubmit={handleBlessingSubmit}>
                <input
                  required
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên của bạn"
                  className="h-11 rounded-xl border border-[#f0d497]/75 bg-[#3d1010]/70 px-4 text-sm text-white placeholder:text-[#ffd8e7] outline-none focus:border-white"
                />
                <textarea
                  required
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Viết lời chúc phúc..."
                  className="rounded-xl border border-[#f0d497]/75 bg-[#3d1010]/70 px-4 py-3 text-sm text-white placeholder:text-[#ffd8e7] outline-none focus:border-white"
                />
                <Button
                  type="submit"
                  className="h-11 rounded-xl border border-[#f0d497] bg-white text-[#4a1212] hover:bg-[#f6dfad]"
                >
                  <Send className="size-4" />
                  Gửi lời chúc
                </Button>
              </form>
            </article>

            <article className="rounded-3xl border border-[#f0d497]/75 bg-[#5a1614]/62 p-5 md:p-6">
              <p className="mb-3 text-sm uppercase tracking-[0.16em] text-[#e6c883]">
                Bình luận gần đây
              </p>
              <div className="max-h-[430px] space-y-3 overflow-auto pr-1">
                {blessings.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#f0d497]/65 bg-[#3d1010]/72 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-white">{item.name}</p>
                      <span className="text-xs text-[#d9bc7a]">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#f3e5c2]">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section
          id="gift"
          className="relative mx-auto max-w-6xl px-5 pb-16 md:px-8"
        >
          <article className="rounded-3xl border border-[#f0d497]/75 bg-[#5a1614]/62 p-7">
            <h3 className="font-[var(--font-heading-wedding)] text-3xl text-white">
              Mừng Cưới
            </h3>
            <p className="mt-2 text-sm text-[#f3e5c2]">
              Sự hiện diện của bạn là món quà quý giá nhất. Nếu muốn gửi mừng
              cưới, bạn có thể dùng thông tin dưới đây.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code className="rounded-lg bg-[#3d1010]/75 px-3 py-2 text-xs text-[#f3e5c2]">
                123456789 - NGUYEN VAN A - ACB
              </code>
              <Button
                variant="outline"
                className="rounded-full border-[#f0d497] bg-[#6a1a16] text-[#f3e5c2] hover:bg-[#541310]"
                onClick={copyBankInfo}
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Đã sao chép" : "Sao chép STK"}
              </Button>
            </div>
          </article>
        </section>

        <section
          id="map"
          className="relative mx-auto max-w-6xl px-5 pb-20 md:px-8"
        >
          <article className="rounded-3xl border border-[#f0d497]/75 bg-[#5a1614]/62 p-5 md:p-7">
            <div className="mb-4 flex items-center gap-2 text-white">
              <MapPin className="size-5" />
              <h3 className="font-[var(--font-heading-wedding)] text-3xl">
                Google Map
              </h3>
            </div>
            <p className="mb-5 text-sm text-[#f3e5c2]">
              Sảnh Jasmine, The Adora Center, 431 Hoàng Văn Thụ, Quận Tân Bình,
              TP.HCM
            </p>
            <div className="overflow-hidden rounded-2xl border border-[#f0d497]/75">
              <iframe
                title="Bản đồ địa điểm tiệc cưới"
                src="https://www.google.com/maps?q=The%20Adora%20Center%20431%20Hoang%20Van%20Thu%20Tan%20Binh%20Ho%20Chi%20Minh&output=embed"
                className="h-80 w-full md:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </article>
        </section>

        <footer className="relative border-t border-[#f0d497]/55 py-10 text-center text-[#f3e5c2]">
          <p className="font-[var(--font-script)] text-4xl">
            Hân hạnh được đón tiếp
          </p>
          <p className="mt-2 text-sm">Minh & Linh | 18.10.2026</p>
        </footer>

        <button
          type="button"
          aria-label={musicOn ? "Tắt nhạc" : "Mở nhạc"}
          onClick={toggleMusic}
          className="fixed bottom-5 right-5 z-50 inline-flex size-12 items-center justify-center rounded-full border border-[#fecaca] bg-[#dc2626] text-white shadow-[0_10px_26px_rgba(69,10,10,0.42)] transition hover:scale-105 hover:bg-[#b91c1c]"
        >
          <span className="relative inline-flex">
            {musicOn ? (
              <Volume2 className="size-4" />
            ) : (
              <VolumeX className="size-4" />
            )}
            <Music2 className="absolute -right-3 -top-3 size-3 text-[#fee2e2]" />
          </span>
        </button>
      </main>
    </>
  );
}
