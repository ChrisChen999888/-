import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  RefreshCcw, 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  Users, 
  CircleUser, 
  HeartHandshake,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import { scaleData, interpretations, Dimension } from './data/scaleData';

type AppState = 'landing' | 'assessing' | 'result';

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);

  const totalPossibleQuestions = 25;
  const totalAnswered = Object.keys(answers).length;
  const progress = (totalAnswered / totalPossibleQuestions) * 100;

  const handleStart = () => setState('assessing');
  
  const handleAnswer = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentDimensionIndex(0);
    setState('landing');
  };

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((acc: number, score: number) => acc + score, 0);
  }, [answers]);

  const dimensionScores = useMemo(() => {
    return scaleData.map(dim => {
      const score = dim.questions.reduce((acc: number, q) => acc + (answers[q.id] || 0), 0);
      return {
        title: dim.title,
        score,
        maxScore: dim.questions.length * 5,
        percentage: (score / (dim.questions.length * 5)) * 100
      };
    });
  }, [answers]);

  const interpretation = useMemo(() => {
    if (state !== 'result') return null;
    return interpretations.find(i => totalScore >= i.min && totalScore <= i.max) || interpretations[3];
  }, [totalScore, state]);

  // View Components
  const LandingView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-6 py-12 text-center"
    >
      <div className="inline-flex items-center justify-center p-3 mb-6 bg-teal-50 text-teal-600 rounded-2xl">
        <ClipboardList size={48} />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
        大学生心理发展评估系统
      </h1>
      <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
        基于精神分析修正理论（Neo-Psychoanalytic）编制，深入穿透表层行为，评估您的自我功能、依恋模式及心理韧性。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
        {[
          { icon: <Target className="text-blue-500" />, title: "深度理论根基", desc: "整合阿德勒、客体关系、自体心理学等六大流派核心理论。" },
          { icon: <Users className="text-teal-500" />, title: "多维动态评估", desc: "涵盖成长动机、依恋内化、社会适应等5大核心核心维度。" },
          { icon: <ShieldCheck className="text-purple-500" />, title: "科学自我觉察", desc: "旨在引导大学生进行深度自我探索与心理状态初步筛查。" }
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4">{item.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl mb-12 text-left">
        <h4 className="flex items-center text-amber-800 font-semibold mb-2">
          <AlertTriangle size={18} className="mr-2" />
          评估说明
        </h4>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
          <li>本量表共25道题，预计用时5-8分钟。</li>
          <li>采用Likert 5级评分制，请根据近期的真实感受作答。</li>
          <li>本工具仅用于心理发展评估与自我觉察，不具备医疗诊断效力。</li>
        </ul>
      </div>

      <button 
        onClick={handleStart}
        className="inline-flex items-center px-10 py-4 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 group"
      >
        开始深度评估
        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );

  const AssessmentView = () => {
    const currentDimension = scaleData[currentDimensionIndex];
    const isDimensionComplete = currentDimension.questions.every(q => answers[q.id] !== undefined);
    const isFirstDimension = currentDimensionIndex === 0;
    const isLastDimension = currentDimensionIndex === scaleData.length - 1;

    const dimensionIcons = [
      <Target key="1" />,
      <Users key="2" />,
      <CircleUser key="3" />,
      <HeartHandshake key="4" />,
      <ShieldCheck key="5" />
    ];

    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">Progress</span>
              <h2 className="text-2xl font-bold text-gray-900">第 {currentDimensionIndex + 1} 阶段</h2>
            </div>
            <span className="text-sm font-medium text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentDimensionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                  {dimensionIcons[currentDimensionIndex]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{currentDimension.title}</h3>
                  <p className="text-sm text-teal-600 font-medium">{currentDimension.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-8 italic">
                {currentDimension.description}
              </p>

              <div className="space-y-10">
                {currentDimension.questions.map((q) => (
                  <div key={q.id} className="group">
                    <p className="text-lg font-medium text-gray-800 mb-6 group-hover:text-teal-700 transition-colors">
                      {q.id}. {q.text}
                    </p>
                    <div className="flex justify-between items-center max-w-lg">
                      <span className="text-xs text-gray-400 font-medium">完全不符合</span>
                      <div className="flex gap-2 sm:gap-4 mx-4">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            onClick={() => handleAnswer(q.id, score)}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 
                              ${answers[q.id] === score 
                                ? 'bg-teal-600 border-teal-600 text-white shadow-md scale-110' 
                                : 'bg-white border-gray-200 text-gray-400 hover:border-teal-300 hover:text-teal-500'}`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">完全符合</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12">
          <button
            onClick={() => setCurrentDimensionIndex(prev => Math.max(0, prev - 1))}
            disabled={isFirstDimension}
            className={`flex items-center px-6 py-2 rounded-full font-semibold transition-all
              ${isFirstDimension 
                ? 'text-gray-200 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronLeft size={20} className="mr-1" />
            上一步
          </button>

          {!isLastDimension ? (
            <button
              onClick={() => setCurrentDimensionIndex(prev => prev + 1)}
              disabled={!isDimensionComplete}
              className={`flex items-center px-8 py-3 rounded-full font-bold text-white transition-all shadow-md
                ${isDimensionComplete 
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-100 translate-y-0 active:scale-95' 
                  : 'bg-gray-200 cursor-not-allowed'}`}
            >
              下一步
              <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={() => setState('result')}
              disabled={!isDimensionComplete}
              className={`flex items-center px-10 py-4 rounded-full font-bold text-white transition-all shadow-xl
                ${isDimensionComplete 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 scale-100 hover:scale-105 active:scale-95' 
                  : 'bg-gray-200 cursor-not-allowed'}`}
            >
              查看测评结果
              <CheckCircle2 size={20} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const ResultView = () => {
    if (!interpretation) return null;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">您的心理发展评估报告</h1>
          <p className="text-gray-500">报告生成日期：{new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Score Card */}
          <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
            <div 
              className="w-32 h-32 rounded-full border-8 flex items-center justify-center mb-6"
              style={{ borderColor: `${interpretation.color}20`, color: interpretation.color }}
            >
              <span className="text-4xl font-black">{totalScore}</span>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: interpretation.color }}>
              {interpretation.status}
            </h2>
            <div className="h-1 w-12 bg-gray-100 rounded-full mb-4" />
            <p className="text-sm text-gray-500 leading-relaxed">
              您的总分为 {totalScore} 分（总分区间 25-125），处于「{interpretation.status}」区间。
            </p>
          </div>

          {/* Interpretation Details */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle2 size={20} className="text-teal-600 mr-2" />
              深度专家解读
            </h3>
            <p className="text-gray-700 leading-relaxed mb-8">
              {interpretation.description}
            </p>

            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Target size={20} className="text-teal-600 mr-2" />
              维度得分明细
            </h3>
            <div className="space-y-6">
              {dimensionScores.map((dim, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">{dim.title}</span>
                    <span className="text-gray-400 font-mono">{dim.score} / {dim.maxScore}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.percentage}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-teal-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing Advice */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 mb-12">
            <h3 className="font-bold text-gray-900 mb-4">💡 后续建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600">量表结果仅反映当下阶段性状态，心理功能可通过自我提升持续优化。</p>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600">若您感到明显的适应障碍，请务必联系学校心理中心寻求专业支持。</p>
              </div>
            </div>
        </div>

        <div className="flex flex-col items-center">
          <button 
            onClick={handleReset}
            className="flex items-center px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <RefreshCcw size={18} className="mr-2" />
            重新开始评估
          </button>
          <p className="mt-6 text-xs text-gray-400 text-center max-w-lg">
            * 本评估基于精神分析修正学派理论，非医疗诊断工具。所有数据仅在您浏览器本地处理。
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      <header className="py-6 px-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
              Ψ
            </div>
            <span className="font-bold text-gray-900 tracking-tight">Psychometrics Lab</span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-500">
             <span>大学生心理发展专用</span>
          </div>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {state === 'landing' && <LandingView key="landing" />}
          {state === 'assessing' && <AssessmentView key="assessing" />}
          {state === 'result' && <ResultView key="result" />}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-gray-100 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-xs">
          <p>© 2026 基于精神分析修正理论的评估工具. All rights reserved.</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest leading-loose">
            Adler / Object Relations / Bowlby / Erikson / Kohut / Horney / Sullivan / Fromm
          </p>
        </div>
      </footer>
    </div>
  );
}
