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
  Pause,
  Play,
  Send,
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
const INTRO_FLAP_DURATION = 820;
const INTRO_CARD_DELAY = 480;
const INTRO_CARD_DURATION = 760;
const INTRO_ZOOM_DELAY =
  INTRO_FLAP_DURATION + INTRO_CARD_DELAY + INTRO_CARD_DURATION - 180;
const INTRO_ZOOM_DURATION = 620;
const INTRO_OPEN_DURATION = INTRO_ZOOM_DELAY + INTRO_ZOOM_DURATION;

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
    alt: "Ảnh cưới 1",
  },
  {
    src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop",
    alt: "Ảnh cưới 2",
  },
  {
    src: "https://images.unsplash.com/photo-1604014237744-84a6c03f0c8f?q=80&w=1600&auto=format&fit=crop",
    alt: "Ảnh cưới 3",
  },
  {
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?q=80&w=1600&auto=format&fit=crop",
    alt: "Ảnh cưới 4",
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
    if (introOpen) {
      return;
    }

    setIntroOpen(true);

    const cardZoomTimer = window.setTimeout(
      () => setIntroZoom(true),
      INTRO_ZOOM_DELAY,
    );
    const finishTimer = window.setTimeout(
      () => setIntroDone(true),
      INTRO_OPEN_DURATION,
    );

    introTimersRef.current.push(cardZoomTimer, finishTimer);
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

  return (
    <>
      {!introDone ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[radial-gradient(circle_at_50%_20%,#fffafc_0%,#ffdfe9_34%,#ef5a85_68%,#b0123f_100%)] px-6">
          <div className="w-full max-w-[390px] text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#fff5f8]">
              Thiệp Cưới
            </p>
            <div
              className="relative mx-auto h-[320px] w-[min(100%,352px)]"
              style={{
                transform: introZoom
                  ? "translateY(-8px) scale(7)"
                  : "translateY(0) scale(1)",
                opacity: introZoom ? 0 : 1,
                transformOrigin: "50% 56%",
                transition: `transform ${INTRO_ZOOM_DURATION}ms cubic-bezier(0.18, 0.9, 0.36, 1), opacity ${INTRO_ZOOM_DURATION}ms ease`,
                willChange: "transform, opacity",
              }}
            >
              <div className="absolute bottom-0 left-1/2 h-[206px] w-full -translate-x-1/2 rounded-[20px] bg-[#7a0f32]/35 blur-[3px]" />
              <div className="absolute bottom-0 left-1/2 h-[210px] w-full -translate-x-1/2 rounded-[18px] border border-[#ffd7e4] bg-gradient-to-b from-[#f4527e] to-[#b91242] shadow-[0_24px_46px_rgba(82,8,32,0.45)]" />

              <div
                className="absolute bottom-[50px] left-1/2 z-20 w-[84%] overflow-hidden rounded-2xl border border-[#ffd7e5] bg-[#fffafc] px-4 py-6 text-[#a31547] shadow-[0_14px_30px_rgba(95,17,53,0.25)]"
                style={{
                  transform: introOpen
                    ? "translate(-50%, -118px)"
                    : "translate(-50%, 34px)",
                  transition: `transform ${INTRO_CARD_DURATION}ms cubic-bezier(0.2, 0.85, 0.3, 1) ${INTRO_CARD_DELAY}ms`,
                  willChange: "transform",
                }}
              >
                <Image
                  src="/images/envelope/flower_top.webp"
                  alt=""
                  aria-hidden
                  width={220}
                  height={220}
                  className="pointer-events-none absolute -right-8 -top-8 w-[200px] opacity-30 saturate-125 hue-rotate-[305deg] brightness-110"
                />
                <Image
                  src="/images/envelope/flower_bottom.webp"
                  alt=""
                  aria-hidden
                  width={130}
                  height={130}
                  className="pointer-events-none absolute -bottom-8 -left-8 w-[115px] rotate-[152deg] opacity-35 saturate-125 hue-rotate-[315deg] brightness-110"
                />
                <p className="font-[var(--font-script)] text-5xl leading-none">
                  Minh & Linh
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em]">
                  18.10.2026
                </p>
              </div>

              <div className="absolute bottom-0 left-1/2 z-30 h-[138px] w-full -translate-x-1/2 rounded-b-[18px] border border-[#ffdce9]/85 bg-gradient-to-b from-[#ee4d7b] to-[#cb1f52]" />
              <div
                className="absolute bottom-0 left-0 z-[32] h-[138px] w-1/2 border-l border-b border-[#ffdce9]/80 bg-gradient-to-br from-[#f16490] to-[#c9174a]"
                style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
              />
              <div
                className="absolute bottom-0 right-0 z-[32] h-[138px] w-1/2 border-r border-b border-[#ffdce9]/80 bg-gradient-to-bl from-[#f16490] to-[#c9174a]"
                style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
              />

              <div
                className="absolute bottom-[72px] left-1/2 z-40 h-[138px] w-full border border-[#ffe3ec] bg-gradient-to-b from-[#ffc8dc] to-[#f36893]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  transformOrigin: "50% 0%",
                  transform: introOpen
                    ? "translateX(-50%) perspective(760px) rotateX(-172deg)"
                    : "translateX(-50%) perspective(760px) rotateX(0deg)",
                  transition: `transform ${INTRO_FLAP_DURATION}ms cubic-bezier(0.2, 0.85, 0.3, 1)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              />
            </div>

            <Button
              onClick={handleOpenInvite}
              disabled={introOpen}
              className="mt-10 h-11 rounded-full border border-[#ffd9e7] bg-[#fff3f8] px-7 text-[#b22f62] hover:bg-[#ffeaf2]"
            >
              {introOpen ? "Đang mở thiệp..." : "Mở thiệp mời"}
            </Button>
          </div>
        </div>
      ) : null}

      <main
        className={`${bodyFont.variable} ${headingFont.variable} ${scriptFont.variable} relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#7f122f_0%,#b61f45_35%,#c42c52_58%,#ae1f45_78%,#7d142f_100%)] text-[#fff5f7]`}
      >
        <audio
          ref={audioRef}
          loop
          preload="none"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,#ffdbe8_0%,transparent_24%),radial-gradient(circle_at_84%_14%,#ffd2e3_0%,transparent_23%),radial-gradient(circle_at_52%_90%,#ffc7dc_0%,transparent_20%)] opacity-50" />
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
          <div className="rounded-[2rem] border border-[#ffe1eb]/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.18)_0%,rgba(255,193,214,0.16)_100%)] p-6 shadow-[0_18px_48px_rgba(79,7,32,0.46)] md:p-10">
            <div className="rounded-[1.6rem] border border-[#ffe5ef]/75 bg-[#b91f46]/55 p-6 md:p-9">
              <div className="flex items-center justify-center gap-3 text-[#fff3f8]">
                <Crown className="size-4" />
                <span className="text-[11px] uppercase tracking-[0.28em]">
                  Song Long Hỷ
                </span>
                <Crown className="size-4" />
              </div>

              <p className="mt-6 text-center font-[var(--font-script)] text-6xl leading-none text-white md:text-8xl">
                Minh & Linh
              </p>
              <p className="mt-4 text-center text-base leading-7 text-[#fff1f5] md:text-lg">
                Trân trọng kính mời bạn và gia đình đến tham dự lễ thành hôn,
                <br className="hidden sm:block" />
                chung vui cùng chúng tôi trong ngày trọng đại.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-[#fff3f7]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe0ea]/75 bg-[#cc345b]/55 px-3 py-1.5">
                  <CalendarDays className="size-4" />
                  17:00 - Chủ nhật, 18.10.2026
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe0ea]/75 bg-[#cc345b]/55 px-3 py-1.5">
                  <MapPin className="size-4" />
                  The Adora Center, Tân Bình, TP.HCM
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {countdownItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#ffe1eb]/75 bg-[#c72f58]/65 px-3 py-4 text-center"
                  >
                    <p className="font-[var(--font-heading-wedding)] text-4xl font-semibold text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#ffe7ef]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => scrollTo("blessings")}
                  className="h-11 rounded-full border border-[#ffe4ee] bg-white px-6 text-[#ad2d5c] hover:bg-[#fff0f6]"
                >
                  Gửi lời chúc
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollTo("gallery")}
                  className="h-11 rounded-full border-[#ffe0ea] bg-[#be254d] px-6 text-[#fff2f7] hover:bg-[#a91d43]"
                >
                  Xem ảnh cưới
                </Button>
              </div>
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

          <div className="rounded-3xl border border-[#ffe3ed]/75 bg-[#b91f46]/55 p-4 md:p-6">
            <div className="relative overflow-hidden rounded-2xl border border-[#ffe3ed]/75 bg-[#a61a3e]/55">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[#ffe3ed]/75 bg-white/85 p-2 text-[#af2d5a]"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[#ffe3ed]/75 bg-white/85 p-2 text-[#af2d5a]"
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
            <article className="rounded-3xl border border-[#ffe3ed]/75 bg-[#bd244c]/60 p-6">
              <CalendarDays className="size-5 text-[#fff1f7]" />
              <h2 className="mt-4 font-[var(--font-heading-wedding)] text-2xl text-white">
                Lễ Thành Hôn
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#fff1f6]">
                Chủ nhật, ngày 18 tháng 10 năm 2026
              </p>
            </article>

            <article className="rounded-3xl border border-[#ffe3ed]/75 bg-[#bd244c]/60 p-6">
              <Clock3 className="size-5 text-[#fff1f7]" />
              <h2 className="mt-4 font-[var(--font-heading-wedding)] text-2xl text-white">
                Thời Gian
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#fff1f6]">
                Đón khách 16:30 - Nghi lễ bắt đầu 17:00
              </p>
            </article>

            <article className="rounded-3xl border border-[#ffe3ed]/75 bg-[#bd244c]/60 p-6">
              <MapPin className="size-5 text-[#fff1f7]" />
              <h2 className="mt-4 font-[var(--font-heading-wedding)] text-2xl text-white">
                Địa Điểm
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#fff1f6]">
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
            <article className="rounded-3xl border border-[#ffe3ed]/75 bg-[#bf264e]/62 p-7">
              <h3 className="font-[var(--font-heading-wedding)] text-3xl text-white">
                Sổ Lưu Bút Chúc Phúc
              </h3>
              <p className="mt-2 text-sm text-[#fff2f7]">
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
                  className="h-11 rounded-xl border border-[#ffe5ef]/75 bg-[#a61c41]/70 px-4 text-sm text-white placeholder:text-[#ffd8e7] outline-none focus:border-white"
                />
                <textarea
                  required
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Viết lời chúc phúc..."
                  className="rounded-xl border border-[#ffe5ef]/75 bg-[#a61c41]/70 px-4 py-3 text-sm text-white placeholder:text-[#ffd8e7] outline-none focus:border-white"
                />
                <Button
                  type="submit"
                  className="h-11 rounded-xl border border-[#ffe5ef] bg-white text-[#ad2d5c] hover:bg-[#fff0f6]"
                >
                  <Send className="size-4" />
                  Gửi lời chúc
                </Button>
              </form>
            </article>

            <article className="rounded-3xl border border-[#ffe3ed]/75 bg-[#bf264e]/62 p-5 md:p-6">
              <p className="mb-3 text-sm uppercase tracking-[0.16em] text-[#ffe9f2]">
                Bình luận gần đây
              </p>
              <div className="max-h-[430px] space-y-3 overflow-auto pr-1">
                {blessings.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#ffe6ef]/65 bg-[#a71e43]/72 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-white">{item.name}</p>
                      <span className="text-xs text-[#ffdce9]">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#fff1f7]">
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
          <article className="rounded-3xl border border-[#ffe3ed]/75 bg-[#be264d]/62 p-7">
            <h3 className="font-[var(--font-heading-wedding)] text-3xl text-white">
              Mừng Cưới
            </h3>
            <p className="mt-2 text-sm text-[#fff1f7]">
              Sự hiện diện của bạn là món quà quý giá nhất. Nếu muốn gửi mừng
              cưới, bạn có thể dùng thông tin dưới đây.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code className="rounded-lg bg-[#a71d42]/75 px-3 py-2 text-xs text-[#fff3f8]">
                123456789 - NGUYEN VAN A - ACB
              </code>
              <Button
                variant="outline"
                className="rounded-full border-[#ffe4ee] bg-[#c9385d] text-[#fff3f8] hover:bg-[#b6284f]"
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
          <article className="rounded-3xl border border-[#ffe3ed]/75 bg-[#bf264e]/62 p-5 md:p-7">
            <div className="mb-4 flex items-center gap-2 text-white">
              <MapPin className="size-5" />
              <h3 className="font-[var(--font-heading-wedding)] text-3xl">
                Google Map
              </h3>
            </div>
            <p className="mb-5 text-sm text-[#fff1f7]">
              Sảnh Jasmine, The Adora Center, 431 Hoàng Văn Thụ, Quận Tân Bình,
              TP.HCM
            </p>
            <div className="overflow-hidden rounded-2xl border border-[#ffe4ee]/75">
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

        <footer className="relative border-t border-[#ffe4ee]/55 py-10 text-center text-[#fff3f8]">
          <p className="font-[var(--font-script)] text-4xl">
            Hân hạnh được đón tiếp
          </p>
          <p className="mt-2 text-sm">Minh & Linh | 18.10.2026</p>
        </footer>

        <button
          type="button"
          aria-label={musicOn ? "Tắt nhạc" : "Mở nhạc"}
          onClick={toggleMusic}
          className="fixed bottom-5 right-5 z-50 inline-flex size-12 items-center justify-center rounded-full border border-[#ffe6ef] bg-[#cc3b62] text-[#fff3f8] shadow-[0_10px_26px_rgba(62,8,35,0.45)] transition hover:scale-105 hover:bg-[#b82e55]"
        >
          <span className="relative inline-flex">
            {musicOn ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
            <Music2 className="absolute -right-3 -top-3 size-3 text-[#ffe9f2]" />
          </span>
        </button>
      </main>
    </>
  );
}
