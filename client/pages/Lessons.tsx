import { useState } from "react";
import { Link } from "react-router-dom";
import { LESSONS } from "@/data/lessons";
import { Play, Lock, CheckCircle, Filter, Search } from "lucide-react";

export default function LessonsLibrary() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const completedLessons = []; // From app state
  const userLevel = 1;

  const topics = ["Budgeting", "Investing", "Credit & Debt", "Taxes & Planning"];
  const topicEmojis = {
    "Budgeting": "💰",
    "Investing": "📈",
    "Credit & Debt": "💳",
    "Taxes & Planning": "🎯",
  };

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesTopic = !selectedTopic || lesson.topic === selectedTopic;
    const matchesSearch = lesson.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const getLevelColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "advanced":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "";
    }
  };

  const topicStats = topics.map((topic) => {
    const lessonsInTopic = LESSONS.filter((l) => l.topic === topic);
    const completedInTopic = lessonsInTopic.filter((l) =>
      completedLessons.includes(l.id)
    ).length;
    return {
      topic,
      total: lessonsInTopic.length,
      completed: completedInTopic,
    };
  });

  const totalXpAvailable = LESSONS.reduce((sum, lesson) => sum + lesson.xpReward, 0);
  const totalXpEarned = LESSONS.filter((l) => completedLessons.includes(l.id)).reduce(
    (sum, lesson) => sum + lesson.xpReward,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Micro-Learning Hub 📚
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Master financial concepts in 3-4 minute bite-sized videos. Each lesson includes a summary,
            key points, and a quiz to test your knowledge.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-base">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lessons Completed</p>
            <p className="text-3xl font-display font-bold text-primary-600 dark:text-primary-400">
              {completedLessons.length} / {LESSONS.length}
            </p>
            <div className="mt-3 w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all"
                style={{ width: `${(completedLessons.length / LESSONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="card-base">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">XP Earned</p>
            <p className="text-3xl font-display font-bold text-purple-600 dark:text-purple-400">
              {totalXpEarned} / {totalXpAvailable}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {totalXpAvailable - totalXpEarned} XP remaining
            </p>
          </div>

          <div className="card-base">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time Invested</p>
            <p className="text-3xl font-display font-bold text-blue-600 dark:text-blue-400">
              {LESSONS.filter((l) => completedLessons.includes(l.id)).reduce(
                (sum, l) => sum + l.duration,
                0
              )} min
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {LESSONS.reduce((sum, l) => sum + l.duration, 0)} min total available
            </p>
          </div>
        </div>

        {/* Topic Progress Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topicStats.map((stat) => (
              <button
                key={stat.topic}
                onClick={() =>
                  setSelectedTopic(selectedTopic === stat.topic ? null : stat.topic)
                }
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedTopic === stat.topic
                    ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 bg-white dark:bg-slate-800"
                }`}
              >
                <div className="text-3xl mb-2">{topicEmojis[stat.topic as keyof typeof topicEmojis]}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-left">
                  {stat.topic}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-left mt-2">
                  {stat.completed}/{stat.total} lessons completed
                </p>
                <div className="mt-3 w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary transition-all"
                    style={{ width: `${(stat.completed / stat.total) * 100}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>
            {selectedTopic && (
              <button
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Lessons Grid */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
            {selectedTopic ? selectedTopic : "All Lessons"}
          </h2>

          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No lessons found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isPrerequisiteMet = lesson.preRequisites.every((id) =>
                  completedLessons.includes(id)
                );
                const isLocked = lesson.preRequisites.length > 0 && !isPrerequisiteMet;

                return (
                  <div
                    key={lesson.id}
                    className={`rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all ${
                      isLocked
                        ? "opacity-70 bg-gray-100 dark:bg-slate-800"
                        : "bg-white dark:bg-slate-800 hover:scale-105"
                    }`}
                  >
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 border-b border-gray-200 dark:border-slate-700">
                      <div className="text-3xl mb-2">{lesson.thumbnail}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{lesson.title}</h3>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{lesson.summary}</p>

                      <div className="flex gap-2 flex-wrap mb-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getLevelColor(lesson.difficulty)}`}>
                          {lesson.difficulty}
                        </span>
                        <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                          {lesson.duration} min
                        </span>
                        <span className="text-xs font-semibold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
                          +{lesson.xpReward} XP
                        </span>
                      </div>

                      {/* Status */}
                      {isCompleted && (
                        <div className="mb-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </div>
                      )}

                      {isLocked && (
                        <div className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-semibold">
                          <Lock className="w-4 h-4" />
                          Requires: {lesson.preRequisites.map((id) => {
                            const prereq = LESSONS.find((l) => l.id === id);
                            return prereq?.title;
                          }).join(", ")}
                        </div>
                      )}

                      {/* Button */}
                      <Link
                        to={isLocked ? "#" : `/lessons/${lesson.id}`}
                        onClick={(e) => isLocked && e.preventDefault()}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all ${
                          isLocked
                            ? "bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                            : isCompleted
                              ? "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                              : "bg-gradient-primary text-white hover:shadow-lg active:scale-95"
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4" />
                            Locked
                          </>
                        ) : isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Start
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-12 card-base bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">💡 Learning Tips</h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Watch lessons in sequence for better understanding of concepts</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Take the quiz after each lesson - it reinforces the learning</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Apply lessons immediately - try the simulations after relevant topics</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>Revisit lessons whenever you face real financial decisions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
