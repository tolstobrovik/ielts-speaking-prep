import React, { useState } from 'react';
import { Search, Filter, Volume2, Sparkles, BookOpen, ArrowRight, Lightbulb, Check } from 'lucide-react';
import { LEXICAL_VAULT, LexicalItem } from '../../data/lexicalVault';
import { speechService } from '../../services/speechService';
import { UserPreferences } from '../../types/ielts';

interface LexicalVaultViewProps {
  preferences: UserPreferences;
}

export const LexicalVaultView: React.FC<LexicalVaultViewProps> = ({ preferences }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const categories = ['All', 'Idiom', 'Collocation', 'Discourse Marker', 'Academic Word'];
  const topics = ['All', 'General', 'Technology', 'Environment', 'Society & Culture', 'Work & Education'];

  const filteredItems = LEXICAL_VAULT.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesTopic = selectedTopic === 'All' || item.topic === selectedTopic;

    return matchesSearch && matchesCategory && matchesTopic;
  });

  const handlePronounce = (term: string) => {
    speechService.speakText(term, {
      accent: preferences.examinerVoice.accent,
      rate: 0.9
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-3 border border-purple-200 dark:border-purple-800">
          <Sparkles className="w-3.5 h-3.5" />
          Lexical Resource Accelerator
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Band 8 & 9 Lexical Vault
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          Master high-frequency collocations, native idiomatic phrases, and academic signposting to transform elementary Band 5 responses into Band 8+ eloquence.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search idioms, collocations, definitions, or topics..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-2">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Topic Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-2">Topic:</span>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedTopic === t
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Lexical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {item.bandLevel}
                  </span>
                  <button
                    onClick={() => handlePronounce(item.term)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 transition"
                    title="Hear native pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Main Term */}
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {item.term}
              </h3>

              {/* Definition */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {item.definition}
              </p>

              {/* Example sentence */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Contextual Example:
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed">
                  "{item.exampleSentence}"
                </p>
              </div>
            </div>

            {/* Band 5 Upgrade comparison */}
            {item.alternativesForBand5 && item.alternativesForBand5.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Replaces Band 5:
                </span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {item.alternativesForBand5.map((alt, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 line-through text-[11px]"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-semibold">No vocabulary matched your search query.</p>
          <p className="text-xs mt-1">Try another keyword or reset the category filters.</p>
        </div>
      )}
    </div>
  );
};
