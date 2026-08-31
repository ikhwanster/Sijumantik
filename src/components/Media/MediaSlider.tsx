import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Film, 
  Image as ImageIcon, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  Clock, 
  Share2, 
  Eye,
  Info,
  ShieldCheck
} from 'lucide-react';
import { MEDIA_SLIDES, MediaSlide } from '../../data/sliderData';

interface MediaSliderProps {
  onNavigateTab?: (tabName: string) => void;
}

export const MediaSlider: React.FC<MediaSliderProps> = ({ onNavigateTab }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'image'>('all');
  
  // Modal states for Video Player and Image Lightbox
  const [activeMediaModal, setActiveMediaModal] = useState<MediaSlide | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35); // in percentage
  const [activeSubtitle, setActiveSubtitle] = useState('Mari kuras dan sikat bak mandi minimal seminggu sekali untuk cegah jentik nyamuk.');

  const filteredSlides = MEDIA_SLIDES.filter((s) => {
    if (filterType === 'movie') return s.type === 'movie';
    if (filterType === 'image') return s.type === 'image';
    return true;
  });

  const slideCount = filteredSlides.length;
  const currentSlide = filteredSlides[currentIndex] || filteredSlides[0];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || activeMediaModal) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, slideCount, activeMediaModal]);

  // Adjust index if filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [filterType]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  // Video progress simulation
  useEffect(() => {
    if (!activeMediaModal || activeMediaModal.type !== 'movie' || !isVideoPlaying) return;
    const progressTimer = setInterval(() => {
      setVideoProgress((prev) => {
        const next = (prev + 1) % 100;
        if (next > 75) {
          setActiveSubtitle('Taburkan 1 gram bubuk Abate pada penampungan air sulit dikuras untuk perlindungan 3 bulan.');
        } else if (next > 45) {
          setActiveSubtitle('Periksa tempat tersembunyi seperti dispenser, tatakan pot bunga, dan talang air.');
        } else if (next > 15) {
          setActiveSubtitle('Kuras dan sikat dinding bak mandi hingga bersih dari telur nyamuk Aedes.');
        } else {
          setActiveSubtitle('Selamat datang di Program Edukasi 1 Rumah 1 Jumantik (1R1J) Kemenkes RI.');
        }
        return next;
      });
    }, 400);

    return () => clearInterval(progressTimer);
  }, [activeMediaModal, isVideoPlaying]);

  return (
    <div className="space-y-3">
      {/* Slider Header Bar with Minimalist Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Galeri Edukasi Film & Poster 1R1J</span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Penyuluhan Resmi
              </span>
            </h3>
          </div>
        </div>

        {/* Minimalist Filter Toggle & Autoplay Switch */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({MEDIA_SLIDES.length})
            </button>
            <button
              onClick={() => setFilterType('movie')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterType === 'movie'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎬 Video & Film
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterType === 'image'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🖼️ Poster Infografis
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
            title={isPlaying ? 'Jeda Putar Otomatis' : 'Jalankan Putar Otomatis'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-slate-600" />
                <span className="hidden xs:inline text-[11px]">Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-slate-600 fill-slate-600" />
                <span className="hidden xs:inline text-[11px]">Otomatis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Showcase Carousel Card */}
      {currentSlide && (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-xs group">
          {/* Main Visual Image / Video Preview */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900">
            <img
              src={currentSlide.thumbnailUrl}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Soft Dark Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Top Badge & Category */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/20 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white border border-white/20">
                  {currentSlide.badge}
                </span>
                {currentSlide.duration && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700">
                    <Clock className="w-3 h-3" />
                    <span>{currentSlide.duration}</span>
                  </span>
                )}
              </div>

              <div className="rounded-md bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-slate-700">
                {currentIndex + 1} / {slideCount}
              </div>
            </div>

            {/* Interactive Play Button in Center for Movies */}
            {currentSlide.type === 'movie' ? (
              <button
                onClick={() => setActiveMediaModal(currentSlide)}
                className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 border-2 border-white/80 cursor-pointer"
                title="Putar Video Edukasi"
              >
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setActiveMediaModal(currentSlide)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 cursor-pointer transition-colors"
                title="Perbesar Poster"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Bottom Content Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 space-y-2">
              <div className="space-y-1 max-w-2xl">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  {currentSlide.subtitle}
                </p>
                <h4 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {currentSlide.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {currentSlide.description}
                </p>
              </div>

              {/* Action Buttons & Source */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveMediaModal(currentSlide)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {currentSlide.type === 'movie' ? <Play className="w-3.5 h-3.5 fill-white" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{currentSlide.actionLabel || 'Lihat Materi'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: currentSlide.title,
                          text: currentSlide.description,
                          url: window.location.href
                        }).catch(() => {});
                      } else {
                        alert('Tautan materi edukasi telah disalin.');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Bagikan</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Sumber: {currentSlide.source}
                </p>
              </div>
            </div>

            {/* Slider Navigation Arrows (Minimalist) */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700 transition-colors cursor-pointer"
              aria-label="Slide Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-slate-700 transition-colors cursor-pointer"
              aria-label="Slide Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Dots / Indicator Bar */}
          <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {filteredSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-emerald-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Pindah ke slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>{currentSlide.category}</span>
              <span>•</span>
              <span>{currentSlide.author}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mini Thumbnails Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {filteredSlides.map((slide, idx) => {
          const isSelected = currentIndex === idx;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={`text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  {slide.type === 'movie' ? '🎬 Video' : '🖼️ Poster'}
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
              </div>
              <p className="text-xs font-semibold text-slate-800 line-clamp-1 leading-snug">
                {slide.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Media Modal (Video Player & Poster Lightbox) */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl space-y-0">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  {activeMediaModal.type === 'movie' ? '🎬 Pemutar Video Edukasi' : '🖼️ Poster Infografis Resolusi Penuh'}
                </span>
              </div>
              <button
                onClick={() => setActiveMediaModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display or Image Viewer */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              <img
                src={activeMediaModal.thumbnailUrl}
                alt={activeMediaModal.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover opacity-80"
              />

              {activeMediaModal.type === 'movie' ? (
                <>
                  {/* Simulated Subtitles Bar */}
                  <div className="absolute bottom-12 inset-x-4 text-center">
                    <span className="inline-block bg-black/80 text-yellow-300 px-3 py-1 rounded-md text-xs sm:text-sm font-medium border border-white/10 shadow-md">
                      {activeSubtitle}
                    </span>
                  </div>

                  {/* Video Playback Controls Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 space-y-2">
                    {/* Scrubber Bar */}
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer relative">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="p-1.5 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                        >
                          {isVideoPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                        </button>

                        <button
                          onClick={() => setIsVideoMuted(!isVideoMuted)}
                          className="p-1.5 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                        >
                          {isVideoMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <span className="text-[11px] text-slate-300">
                          {Math.floor((videoProgress * 1.6) / 60)}:
                          {String(Math.floor((videoProgress * 1.6) % 60)).padStart(2, '0')} / {activeMediaModal.duration || '02:45'}
                        </span>
                      </div>

                      <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700">
                        HD 1080p • 1R1J Kemenkes
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-slate-300">
                  Resolusi Asli 1920x1080
                </div>
              )}
            </div>

            {/* Modal Body & Key Points */}
            <div className="p-4 sm:p-5 space-y-3 bg-slate-900 max-h-64 overflow-y-auto">
              <div>
                <h4 className="text-base font-bold text-white">{activeMediaModal.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeMediaModal.description}</p>
              </div>

              <div className="rounded-xl bg-slate-800/80 border border-slate-700 p-3 space-y-2">
                <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Poin Kunci Edukasi Warga:</span>
                </p>
                <ul className="space-y-1 text-xs text-slate-300">
                  {activeMediaModal.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{activeMediaModal.source}</span>
                <button
                  onClick={() => setActiveMediaModal(null)}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 text-xs font-medium border border-slate-600 transition-colors cursor-pointer"
                >
                  Tutup Tampilan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
