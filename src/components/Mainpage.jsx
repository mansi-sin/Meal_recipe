import React, { useState, useEffect } from 'react';
import MealCard from './MealCard';
import { useLang } from '../context/LanguageContext';
import { STRINGS, CATEGORY_NAMES } from '../utils/strings';

const STORAGE_KEY = 'culinary_canvas_state';

const Mainpage = () => {
  const { lang } = useLang();
  const s = STRINGS[lang];

  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  // ── Restore previous search state on back navigation ──
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { data, search, activeCategory } = JSON.parse(saved);
        if (data) setData(data);
        if (search) setSearch(search);
        if (activeCategory) setActiveCategory(activeCategory);
      }
    } catch { /* ignore */ }
  }, []);

  const saveState = (results, searchTerm, category) => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data: results, search: searchTerm, activeCategory: category })
      );
    } catch { /* ignore */ }
  };

  const fetchMeals = async (query, category = '') => {
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const json = await res.json();
      if (json.meals) {
        setData(json.meals);
        saveState(json.meals, query, category);
      } else {
        setData([]);
        setMsg(
          lang === 'hi'
            ? `"${query}" के लिए कोई रेसिपी नहीं मिली।`
            : `No recipes found for "${query}".`
        );
        saveState([], query, category);
      }
    } catch {
      setMsg(lang === 'hi' ? 'कुछ गलत हुआ। दोबारा कोशिश करें।' : 'Something went wrong. Please try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setMsg(lang === 'hi' ? 'खाने का नाम लिखें।' : 'Type a dish name to get started.');
      return;
    }
    setActiveCategory('');
    fetchMeals(search.trim(), '');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCategory = (value) => {
    setActiveCategory(value);
    setSearch('');
    setMsg('');
    fetchMeals(value, value);
  };

  // Category chips with translated labels
  const categories = CATEGORY_NAMES.en.map((val, i) => ({
    label: lang === 'hi' ? CATEGORY_NAMES.hi[i] : val,
    value: val, // always English for API
  }));

  // Result count text
  const resultText = activeCategory
    ? s.recipesIn(data?.length ?? 0, lang === 'hi' ? CATEGORY_NAMES.hi[CATEGORY_NAMES.en.indexOf(activeCategory)] : activeCategory)
    : s.recipesFor(data?.length ?? 0, search);

  return (
    <>
      {/* Header */}
      <div className="hero">
        <h1 className="head">
          Foodie<span>Book </span>
        </h1>
        <p className="hero-tagline">{s.tagline}</p>
      </div>

      {/* Search + Filters */}
      <div className="container">
        <div className="searchBar">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={s.searchPlaceholder}
          />
          <button onClick={handleSearch}>{s.searchBtn}</button>
        </div>

        {lang === 'hi' && s.searchNote && (
          <p className="searchNote">{s.searchNote}</p>
        )}

        <div className="categoryChips">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`chip${activeCategory === cat.value ? ' active' : ''}`}
              onClick={() => handleCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {msg && <p className="error">{msg}</p>}

        {/* Result count */}
        {!loading && data && data.length > 0 && (
          <>
            <hr className="sectionDivider" />
            <p className="resultCount">
              <strong>{data.length}</strong> {resultText}
            </p>
          </>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="skeletonGrid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="skeletonCard" key={i}>
                <div className="skeletonImage" />
                <div className="skeletonText" />
                <div className="skeletonText short" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && data && data.length === 0 && (
          <div className="emptyState">
            <span className="emptyIcon">🍽️</span>
            <h3>{s.nothingFound}</h3>
            <p>{s.nothingFoundSub}</p>
          </div>
        )}

        {/* Results */}
        {!loading && data && data.length > 0 && (
          <MealCard detail={data} />
        )}
      </div>
    </>
  );
};

export default Mainpage;
