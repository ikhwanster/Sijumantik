import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Printer, 
  Share2, 
  ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JUMANTIK_QUIZ, QuizQuestion } from '../../data/educationData';
import { playAlertTone } from '../../utils/audioAlert';

export const JumantikQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const currentQuestion = JUMANTIK_QUIZ[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === JUMANTIK_QUIZ.length - 1;

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < JUMANTIK_QUIZ.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    JUMANTIK_QUIZ.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return Math.round((correct / JUMANTIK_QUIZ.length) * 100);
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    const finalScore = calculateScore();
    if (finalScore >= 80) {
      playAlertTone('success');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      playAlertTone('warning');
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setShowCertificate(false);
  };

  const score = calculateScore();
  const isPassed = score >= 80;

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Kuis Interaktif Kemenkes RI</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Uji Cerdas Satu Rumah Satu Jumantik (1R1J)
            </h3>
            <p className="text-xs text-slate-500">
              Jawab 6 pertanyaan untuk menguji wawasan pencegahan demam berdarah dan raih sertifikat resmi.
            </p>
          </div>

          {/* Question progress pill */}
          <div className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700">
            Pertanyaan <strong>{currentQuestionIndex + 1}</strong> dari <strong>{JUMANTIK_QUIZ.length}</strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / JUMANTIK_QUIZ.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Kategori: {currentQuestion.category}
          </span>
          <h4 className="text-base sm:text-lg font-black text-slate-900 mt-2 leading-snug">
            {currentQuestion.id}. {currentQuestion.question}
          </h4>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
            const isCorrectAnswer = currentQuestion.correctAnswerIndex === optIdx;
            const showFeedback = isSubmitted;

            let optionStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
            if (isSelected) {
              optionStyle = 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 font-bold';
            }
            if (showFeedback) {
              if (isCorrectAnswer) {
                optionStyle = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold';
              } else if (isSelected && !isCorrectAnswer) {
                optionStyle = 'bg-red-100 border-red-500 text-red-950 font-bold';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm flex items-start justify-between gap-3 transition-all ${optionStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </div>

                {showFeedback && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {showFeedback && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box (when submitted) */}
        {isSubmitted && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-1 animate-in fade-in">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Penjelasan Medis:</span>
            </p>
            <p className="text-slate-700 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40"
          >
            Sebelumnya
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              isLastQuestion ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20"
                >
                  Selesai & Lihat Nilai
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )
            ) : (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Result Summary Card */}
      {isSubmitted && (
        <div
          className={`p-6 rounded-3xl border text-center space-y-4 shadow-lg animate-in zoom-in-95 ${
            isPassed ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-md ${
              isPassed ? 'bg-emerald-600' : 'bg-amber-500'
            }`}
          >
            <Award className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {isPassed ? 'SELAMAT! ANDA LULUS JUMANTIK CERDAS' : 'BELUM MENCAPAI SKOR KELULUSAN (MIN 80)'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Skor Anda: <strong className="text-lg text-slate-900">{score} / 100</strong>
            </p>
          </div>

          {isPassed && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowCertificate(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Buka Sertifikat Kelulusan</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border-8 border-amber-400 relative">
            <div className="text-center space-y-2 border-b-2 border-amber-300 pb-4">
              <Award className="w-12 h-12 text-amber-500 mx-auto" />
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest">
                KEMENTERIAN KESEHATAN REPUBLIK INDONESIA
              </span>
              <h2 className="text-2xl font-black text-slate-900">SERTIFIKAT KADER JUMANTIK CERDAS 1R1J</h2>
              <p className="text-xs text-slate-500">Diberikan atas kelulusan kompetensi pemantauan jentik & penanganan DBD</p>
            </div>

            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-slate-600">Dinyatakan Lulus Kepada:</p>
              <h3 className="text-xl font-black text-emerald-800">PESERTA KELUARGA JUMANTIK MANDIRI</h3>
              <p className="text-xs text-slate-700 max-w-md mx-auto">
                Telah berhasil menyelesaikan Uji Kompetensi Kemenkes RI dengan predikat <strong>SANGAT BAIK (Skor: {score}/100)</strong>.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sertifikat</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
