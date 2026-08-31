import React, { useState } from 'react';
import { 
  Award, 
  Star, 
  CheckCircle2, 
  Trophy, 
  Sparkles, 
  Smile, 
  Volume2, 
  HelpCircle, 
  Play, 
  ArrowRight,
  Flame,
  ThumbsUp,
  Heart,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../../types/auth';
import { playAlertTone } from '../../utils/audioAlert';
import { speakIndonesian } from '../../utils/speechHelper';

interface KidsMissionHubProps {
  currentUser: UserProfile | null;
  onUpdateUserStars: (starsToAdd: number, pointsToAdd: number, missionId?: string) => void;
  onNavigateToChecklist: () => void;
}

interface MissionItem {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  rewardStars: number;
  rewardPoints: number;
}

const MISSIONS: MissionItem[] = [
  {
    id: 'm-1',
    title: 'Misi 1: Intip Bak Mandi & Ember',
    desc: 'Buka kamar mandi, lihat apakah ada jentik hitam kecil berenang. Jika bersih, beri tanda aman!',
    emoji: '🛁',
    rewardStars: 10,
    rewardPoints: 20
  },
  {
    id: 'm-2',
    title: 'Misi 2: Cek Tatakan Bawah Dispenser',
    desc: 'Tarik laci kecil bawah galon dispenser. Buang airnya dan lap sampai kering!',
    emoji: '🥤',
    rewardStars: 15,
    rewardPoints: 25
  },
  {
    id: 'm-3',
    title: 'Misi 3: Periksa Belakang Kulkas & Pot Bunga',
    desc: 'Lihat piring pot bunga di teras. Jangan biarkan air menggenang lebih dari 3 hari!',
    emoji: '🪴',
    rewardStars: 20,
    rewardPoints: 30
  },
  {
    id: 'm-4',
    title: 'Misi 4: Berantas Kaleng & Sampah di Halaman',
    desc: 'Ambil sampah botol/plastik di luar rumah yang terkena air hujan, buang ke tempat sampah tertutup!',
    emoji: '🗑️',
    rewardStars: 25,
    rewardPoints: 40
  }
];

const QUIZ_QUESTIONS = [
  {
    question: 'Nyamuk Aedes aegypti (penyebab DBD) punya ciri-ciri warna apa di tubuhnya?',
    options: ['Belang hitam dan putih', 'Kuning polos', 'Hijau terang'],
    answerIndex: 0,
    explanation: 'Benar sekali! Nyamuk Aedes memiliki ciri khas belang hitam dan putih pada tubuh dan kakinya.'
  },
  {
    question: 'Kapan waktu nyamuk DBD paling suka menggigit manusia?',
    options: ['Tengah malam buta', 'Pagi hari (08.00-10.00) dan Sore hari (15.00-17.00)', 'Hanya saat hujan deras'],
    answerIndex: 1,
    explanation: 'Hebat! Nyamuk DBD aktif mencari mangsa di pagi hari dan sore hari menjelang maghrib.'
  },
  {
    question: 'Apa arti gerakan 3M Plus untuk membasmi jentik nyamuk?',
    options: ['Makan, Minum, Main', 'Menguras, Menutup, Mendaur ulang wadah air', 'Menyiram, Mencuci, Menyapu'],
    answerIndex: 1,
    explanation: 'Pintar! 3M Plus adalah Menguras bak mandi, Menutup toren air, dan Mendaur ulang barang bekas.'
  },
  {
    question: 'Berapa hari sekali kita harus memeriksa dan menguras bak mandi di rumah?',
    options: ['Minimal 1 minggu sekali (Setiap Hari Jumat)', 'Setahun sekali', 'Hanya kalau airnya kotor'],
    answerIndex: 0,
    explanation: 'Luar biasa! Telur nyamuk menetas menjadi jentik dalam 7-10 hari, jadi harus dikuras minimal seminggu sekali!'
  }
];

export const KidsMissionHub: React.FC<KidsMissionHubProps> = ({
  currentUser,
  onUpdateUserStars,
  onNavigateToChecklist
}) => {
  const [completedMissions, setCompletedMissions] = useState<string[]>(
    currentUser?.completedMissions || ['m-1']
  );

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleCompleteMission = (mission: MissionItem) => {
    if (completedMissions.includes(mission.id)) return;

    const next = [...completedMissions, mission.id];
    setCompletedMissions(next);
    onUpdateUserStars(mission.rewardStars, mission.rewardPoints, mission.id);

    playAlertTone('success');
    speakIndonesian(`Hore hebat! ${mission.title} selesai. Kamu dapat bonus ${mission.rewardStars} Bintang Emas!`);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAnswerQuiz = (optionIdx: number) => {
    if (isAnswered) return;

    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === QUIZ_QUESTIONS[currentQuizIdx].answerIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      playAlertTone('success');
      speakIndonesian("Jawabanmu Tepat Sekali! Kamu Hebat!");
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    } else {
      playAlertTone('warning');
      speakIndonesian("Hampir tepat! Yuk simak penjelasannya.");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      const bonusStars = (quizScore + 1) * 10;
      onUpdateUserStars(bonusStars, bonusStars * 2);
      playAlertTone('success');
      speakIndonesian(`Selamat kuis selesai! Skor kamu ${quizScore + 1} dari 4. Kamu pahlawan cilik hebat!`);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const stars = currentUser?.stars || 18;
  const points = currentUser?.points || 150;

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-6">
      {/* 1. Hero Kids & Lansia Avatar & Trophy Card */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 sm:p-6 text-amber-950 shadow-xl border-2 border-amber-300 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-3xl bg-white/90 shadow-md flex items-center justify-center text-3xl shrink-0 border-2 border-amber-300 animate-bounce">
              {currentUser?.avatar || '👦🎒'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                🏆 {currentUser?.badgeTitle || 'Duta Cilik Jumantik'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950 mt-0.5 leading-tight">
                {currentUser?.name || 'Rafi si Pemburu Jentik'}
              </h2>
              <p className="text-xs font-bold text-amber-900/90 mt-0.5">
                Level 2: Detektif Pembasmi Nyamuk DBD
              </p>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-2.5 text-center shadow-md border border-amber-200 shrink-0">
            <div className="flex items-center justify-center gap-1 text-amber-600 font-black text-base sm:text-lg">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-spin" />
              <span>{stars}</span>
            </div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase">Bintang</p>
          </div>
        </div>

        {/* Progress bar to next badge */}
        <div className="mt-4 pt-3 border-t border-amber-500/40 relative z-10">
          <div className="flex justify-between text-xs font-black text-amber-950 mb-1">
            <span>Target Lencana Berikutnya: Pendekar Jumantik 🥇</span>
            <span>{stars} / 50 ⭐</span>
          </div>
          <div className="w-full bg-amber-950/20 h-3 rounded-full overflow-hidden p-0.5 border border-amber-600/30">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stars / 50) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Audio button to read missions */}
      <button
        onClick={() => {
          speakIndonesian(
            `Hai ${currentUser?.name || 'Pahlawan Cilik'}! Selesaikan empat misi harian di rumahmu. ` +
            `Periksa bak mandi, tatakan dispenser, pot bunga, dan buang sampah genangan air. ` +
            `Kumpulkan bintang emas dan jadilah Duta Jumantik Nomor Satu!`
          );
        }}
        className="w-full bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-bold p-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
      >
        <Volume2 className="w-4 h-4 text-emerald-700 animate-pulse" />
        <span>🔊 Tekan Disini: Dengarkan Penjelasan Misi Cilik</span>
      </button>

      {/* 3. Daily Missions Checklist */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span>4 Misi Harian Detektif Jentik:</span>
            </h3>
            <p className="text-xs text-slate-500">
              Selesaikan misi di rumah untuk klaim Bintang ⭐
            </p>
          </div>

          <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl">
            {completedMissions.length} / {MISSIONS.length} Selesai
          </span>
        </div>

        <div className="space-y-2.5">
          {MISSIONS.map((mission) => {
            const isDone = completedMissions.includes(mission.id);
            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-2xs ${
                      isDone ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <span>{mission.emoji}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{mission.title}</span>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 inline" />}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {mission.desc}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[11px] font-bold text-amber-700">
                      <span className="bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                        ⭐ +{mission.rewardStars} Bintang
                      </span>
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                        +{mission.rewardPoints} Poin
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <button
                      disabled
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1 shadow-2xs opacity-90"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCompleteMission(mission)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Klaim ⭐</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onNavigateToChecklist}
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3 px-4 rounded-2xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <span>Buka Formulir Pantau Lengkap 1R1J</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Interactive Mini-Quiz for Kids & Lansia */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-teal-200 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              <span>Kuis Cerdas Cilik & Lansia:</span>
            </h3>
            <p className="text-xs text-slate-500">
              Jawab kuis seru berhadiah Bintang Tambahan!
            </p>
          </div>

          <span className="text-xs font-black bg-teal-100 text-teal-900 px-2.5 py-1 rounded-xl">
            Soal {currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>

        {!quizFinished ? (
          <div className="space-y-3">
            {/* Question Card */}
            <div className="p-4 bg-teal-50/70 border border-teal-300 rounded-2xl text-teal-950 font-black text-sm sm:text-base leading-snug">
              ❓ {QUIZ_QUESTIONS[currentQuizIdx].question}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {QUIZ_QUESTIONS[currentQuizIdx].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === QUIZ_QUESTIONS[currentQuizIdx].answerIndex;

                let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-teal-50/50 hover:border-teal-300';
                if (isAnswered) {
                  if (isCorrect) {
                    btnClass = 'bg-emerald-500 text-white border-emerald-600 shadow-md font-black';
                  } else if (isSelected && !isCorrect) {
                    btnClass = 'bg-red-500 text-white border-red-600 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerQuiz(idx)}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-extrabold transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswered && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-950 space-y-2 animate-in fade-in">
                <p className="font-extrabold">
                  💡 {QUIZ_QUESTIONS[currentQuizIdx].explanation}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{currentQuizIdx < QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya 👉' : 'Lihat Hasil Kuis 🏆'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results screen */
          <div className="p-5 bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-2xl text-center space-y-3 animate-in zoom-in">
            <div className="w-16 h-16 bg-amber-400 text-teal-950 rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg">
              🏆
            </div>
            <h4 className="text-xl font-black">MasyaAllah Luar Biasa!</h4>
            <p className="text-xs sm:text-sm text-teal-100">
              Kamu berhasil menjawab <strong>{quizScore} dari {QUIZ_QUESTIONS.length}</strong> pertanyaan dengan sangat baik!
            </p>
            <p className="text-xs font-bold bg-white/20 p-2 rounded-xl text-amber-200">
              ⭐ Kamu dapat tambahan bonus +{quizScore * 10} Bintang Emas!
            </p>
            <button
              onClick={handleResetQuiz}
              className="bg-white text-teal-950 hover:bg-teal-50 font-black text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Kuis Lagi</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Koleksi Lencana Kehormatan */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm space-y-3">
        <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Koleksi Lencana Penghargaan:</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 shadow-2xs">
            <div className="text-2xl mb-1">🥉</div>
            <p className="font-black text-xs text-amber-950">Detektif Pemula</p>
            <p className="text-[10px] text-slate-500">Cek 1 Wadah Air</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-2xs">
            <div className="text-2xl mb-1">🥈</div>
            <p className="font-black text-xs text-emerald-950">Pahlawan 3M+</p>
            <p className="text-[10px] text-slate-500">Kuras Bak Mandi</p>
          </div>

          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-300 shadow-2xs">
            <div className="text-2xl mb-1">🥇</div>
            <p className="font-black text-xs text-teal-950">Pendekar Sehat</p>
            <p className="text-[10px] text-slate-500">Rumah 100% Bebas</p>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-300 shadow-2xs">
            <div className="text-2xl mb-1">👑</div>
            <p className="font-black text-xs text-cyan-950">Duta Nasional</p>
            <p className="text-[10px] text-slate-500">Koleksi 50 Bintang</p>
          </div>
        </div>
      </div>
    </div>
  );
};
