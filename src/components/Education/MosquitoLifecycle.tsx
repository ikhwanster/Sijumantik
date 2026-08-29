import React, { useState } from 'react';
import { MOSQUITO_STAGES, MosquitoStage } from '../../data/educationData';
import { Egg, Activity, Layers, ShieldAlert, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const MosquitoLifecycle: React.FC = () => {
  const [activeStageId, setActiveStageId] = useState<string>(MOSQUITO_STAGES[0].id);

  const activeStage = MOSQUITO_STAGES.find((s) => s.id === activeStageId) || MOSQUITO_STAGES[0];

  return (
    <div className="space-y-6">
      {/* 4 Stage Step Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {MOSQUITO_STAGES.map((stage, idx) => {
          const isSel = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSel
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/40'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {idx + 1}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSel ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {stage.duration.split(' ')[0]}
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm line-clamp-1">{stage.nameIndo.split('(')[0]}</h4>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Spotlight */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Visual Image */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-inner bg-slate-900 border border-slate-200 group">
            <img
              src={activeStage.imageUrl}
              alt={activeStage.nameIndo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-white">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Biologi Aedes aegypti
                </span>
                <h3 className="text-lg font-black">{activeStage.nameIndo}</h3>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Durasi Fase: {activeStage.duration}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {activeStage.nameIndo}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">Habitat & Lokasi Bersarang:</p>
              <p className="text-slate-600">{activeStage.habitat}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-2">
              <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Cara Memutus Rantai Penularan pada Fase Ini:</span>
              </p>
              <p className="text-emerald-800 leading-relaxed">{activeStage.howToEradicate}</p>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-slate-800">Tips Penting Jumantik:</p>
              <ul className="space-y-1">
                {activeStage.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
