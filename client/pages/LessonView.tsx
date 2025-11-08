import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LESSONS } from "@/data/lessons";
import { ChevronDown, ChevronUp, Check, X, Home, Play } from "lucide-react";

export default function LessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = LESSONS.find((l) => l.id === lessonId);

  const [stage, setStage] = useState<"video" | "summary" | "quiz" | "results">("video");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [expandedKeyPoint, setExpandedKeyPoint] = useState<number | null>(0);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center pt-24">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Lesson not found</p>
          <button
            onClick={() => navigate("/lessons")}
            className="btn-primary"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = lesson.quiz[currentQuestionIndex];
  const totalQuestions = lesson.quiz.length;
  const answeredCount = Object.keys(answers).length;
  const correctAnswers = Object.entries(answers).filter(
    ([qId, answer]) => {
      const q = lesson.quiz.find((q) => q.id === qId);
      return q && q.correct === answer;
    }
  ).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const handleAnswerQuestion = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStage("results");
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (stage === "video") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8">
        <div className="max-w-4xl mx-auto px-4 pb-20">
          {/* Header */}
          <button
            onClick={() => navigate("/lessons")}
            className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-2"
          >
            ← Back to Lessons
          </button>

          {/* Video Section */}
          <div className="card-base mb-8 overflow-hidden">
            <div className="aspect-video bg-black rounded-lg mb-6">
              <iframe
                width="100%"
                height="100%"
                src={lesson.videoUrl.replace("watch?v=", "embed/")}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h1>

            <div className="flex gap-4 flex-wrap mb-6">
              <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">
                {lesson.difficulty}
              </span>
              <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full">
                {lesson.duration} minutes
              </span>
              <span className="text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full">
                +{lesson.xpReward} XP upon completion
              </span>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {lesson.summary}
              </p>

              {/* Key Points */}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Key Points
              </h2>
              <div className="space-y-2">
                {lesson.keyPoints.map((point, idx) => (
                  <button
                    key={idx}
                    onClick={() => setExpandedKeyPoint(expandedKeyPoint === idx ? null : idx)}
                    className="w-full p-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 transition-colors text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {point}
                        </p>
                      </div>
                      {expandedKeyPoint === idx ? (
                        <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 flex gap-4">
              <button
                onClick={() => navigate("/lessons")}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Lessons
              </button>
              <button
                onClick={() => setStage("quiz")}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 pt-8">
        <div className="max-w-2xl mx-auto px-4 pb-20">
          {/* Header */}
          <button
            onClick={() => setStage("video")}
            className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-2"
          >
            ← Back to Video
          </button>

          {/* Quiz Card */}
          <div className="card-base">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  {lesson.title}
                </h2>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === idx;
                  const isCorrect = currentQuestion.correct === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerQuestion(currentQuestion.id, idx)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? isCorrect
                            ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                            : "border-red-600 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? isCorrect
                                ? "border-green-600 bg-green-600"
                                : "border-red-600 bg-red-600"
                              : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <Check className={`w-3 h-3 ${isCorrect ? "text-white" : "text-white"}`} />
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {answers[currentQuestion.id] !== undefined && (
                <div
                  className={`mt-6 p-4 rounded-lg border-l-4 ${
                    answers[currentQuestion.id] === currentQuestion.correct
                      ? "border-l-green-600 bg-green-50 dark:bg-green-900/20"
                      : "border-l-red-600 bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  <p
                    className={`font-semibold mb-2 ${
                      answers[currentQuestion.id] === currentQuestion.correct
                        ? "text-green-900 dark:text-green-100"
                        : "text-red-900 dark:text-red-100"
                    }`}
                  >
                    {answers[currentQuestion.id] === currentQuestion.correct
                      ? "✓ Correct!"
                      : "✗ Incorrect"}
                  </p>
                  <p
                    className={
                      answers[currentQuestion.id] === currentQuestion.correct
                        ? "text-green-700 dark:text-green-200"
                        : "text-red-700 dark:text-red-200"
                    }
                  >
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={answers[currentQuestion.id] === undefined}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === totalQuestions - 1 ? "See Results" : "Next"}
              </button>
            </div>

            {/* Questions Indicator */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-semibold">
                PROGRESS: {answeredCount} / {totalQuestions} answered
              </p>
              <div className="grid grid-cols-5 gap-2">
                {lesson.quiz.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`aspect-square rounded-lg font-semibold transition-all ${
                        currentQuestionIndex === idx
                          ? "bg-primary-600 text-white"
                          : isAnswered
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "results") {
    const passed = score >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center pt-24">
        <div className="card-base max-w-2xl w-full mx-4">
          <div className="text-center mb-8">
            <div className={`text-6xl mb-4 ${passed ? "animate-bounce" : ""}`}>
              {passed ? "🎉" : "💪"}
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {passed ? "Excellent!" : "Good Effort!"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {passed
                ? `You understood this lesson well! Keep learning to master more topics.`
                : "You need to strengthen your understanding. Revisit the video and try again."}
            </p>
          </div>

          {/* Score Card */}
          <div className="bg-gradient-primary text-white rounded-xl p-8 mb-8 text-center">
            <p className="text-sm opacity-90 mb-2">Your Score</p>
            <p className="text-6xl font-display font-bold">{score}%</p>
            <p className="text-sm opacity-90 mt-2">
              {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>

          {/* Results Breakdown */}
          <div className="space-y-3 mb-8">
            {lesson.quiz.map((question, idx) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correct;

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    isCorrect
                      ? "border-l-green-600 bg-green-50 dark:bg-green-900/20"
                      : "border-l-red-600 bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        Question {idx + 1}: {question.question}
                      </p>
                      {!isCorrect && (
                        <p
                          className={
                            isCorrect
                              ? "text-green-700 dark:text-green-200"
                              : "text-red-700 dark:text-red-200"
                          }
                        >
                          <span className="text-xs">Correct answer:</span> {question.options[question.correct]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* XP Reward */}
          {passed && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 p-4 rounded-lg text-center mb-8">
              <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Experience Earned
              </p>
              <p className="text-2xl font-display font-bold text-yellow-700 dark:text-yellow-400">
                +{lesson.xpReward} XP
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/lessons")}
              className="btn-secondary"
            >
              Back to Lessons
            </button>
            {!passed && (
              <button
                onClick={() => {
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                  setStage("quiz");
                }}
                className="btn-primary"
              >
                Retake Quiz
              </button>
            )}
            {passed && (
              <button
                onClick={() => {
                  // Find next incomplete lesson in same topic
                  const nextLesson = LESSONS.find(
                    (l) =>
                      l.topic === lesson.topic &&
                      l.id !== lesson.id
                      // In real app, check if not completed
                  );
                  if (nextLesson) {
                    navigate(`/lessons/${nextLesson.id}`);
                  } else {
                    navigate("/lessons");
                  }
                }}
                className="btn-primary"
              >
                Next Lesson
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
