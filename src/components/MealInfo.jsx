import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../utils/strings';
import useTranslate from '../hooks/useTranslate';

/** Parses all non-empty ingredient + measure pairs from the meal object */
const getIngredients = (meal) => {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      list.push({ name: name.trim(), measure: measure ? measure.trim() : '' });
    }
  }
  return list;
};

/** Single ingredient row — translates its own name */
const IngredientItem = ({ name, measure }) => {
  const { text: translatedName, loading } = useTranslate(name);
  return (
    <div className={`ingredientItem${loading ? ' translating' : ''}`}>
      <span className="dot" />
      <span className="ingName">{translatedName || name}</span>
      {measure && <span className="ingMeasure">{measure}</span>}
    </div>
  );
};

const MealInfo = () => {
  const { mealid } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const s = STRINGS[lang];

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Translate the recipe title and instructions via API
  const { text: translatedTitle, loading: titleLoading } = useTranslate(info?.strMeal || '');
  const { text: translatedInstructions, loading: instrLoading } = useTranslate(info?.strInstructions || '');

  // ── Fetch recipe ──
  useEffect(() => {
    if (!mealid) return;
    const fetchInfo = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealid}`
        );
        const json = await res.json();
        if (json.meals) {
          setInfo(json.meals[0]);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mealid]);

  // ── Stop speech when navigating away or language changes ──
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [lang, mealid]);

  // ── Text-to-Speech ──
  const handleSpeak = useCallback(() => {
    if (!window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const content = `${translatedTitle}. ${translatedInstructions}`;
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.88;
    utterance.pitch = 1;

    // Pick best available voice for the language
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v =>
      v.lang === (lang === 'hi' ? 'hi-IN' : 'en-US')
    );
    if (match) utterance.voice = match;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [speaking, translatedTitle, translatedInstructions, lang]);

  // ── Render states ──
  if (loading) {
    return (
      <div className="mealInfoContainer">
        <div className="loadingSpinner">
          <div className="spinner" />
          <p>{s.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="mealInfoContainer">
        <button className="backBtn" onClick={() => navigate(-1)}>← {s.back}</button>
        <div className="emptyState">
          <span className="emptyIcon">🍽️</span>
          <h3>{s.recipeNotFound}</h3>
          <p>{s.recipeNotFoundSub}</p>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(info);

  return (
    <div className="mealInfoContainer">
      {/* Back button */}
      <button className="backBtn" onClick={() => navigate(-1)} aria-label="Go Back">
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
          viewBox="0 0 512 512" height="1em" width="1em"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.4-33.9 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" />
        </svg>
        {s.back}
      </button>

      <div className="msg">
        {/* Left — meal photo */}
        <img className="mealDetailImg" src={info.strMealThumb} alt={info.strMeal} />

        {/* Right — info panel */}
        <div className="info">

          {/* Title */}
          <h1 className={titleLoading ? 'translating' : ''}>
            {translatedTitle || info.strMeal}
          </h1>

          {/* Tags */}
          <div className="infoTags">
            {info.strCategory && (
              <span className="infoTag category">{info.strCategory}</span>
            )}
            {info.strArea && (
              <span className="infoTag area">{info.strArea} Cuisine</span>
            )}
            {info.strTags &&
              info.strTags.split(',').filter(Boolean).map(tag => (
                <span className="infoTag" key={tag.trim()}>{tag.trim()}</span>
              ))}
          </div>

          {/* Action buttons row */}
          <div className="actionRow">
            {/* Speaker / TTS button */}
            {window.speechSynthesis && (
              <button
                className={`speakerBtn${speaking ? ' speaking' : ''}`}
                onClick={handleSpeak}
                disabled={instrLoading || titleLoading}
                title={speaking ? s.stopSpeak : s.speak}
              >
                {speaking ? (
                  /* Stop icon */
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  /* Speaker icon */
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
                {speaking ? s.stopSpeak : s.speak}
              </button>
            )}

            {/* YouTube link */}
            {info.strYoutube && (
              <a
                href={info.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="youtubeBtn"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8z" />
                  <path d="M9.8 15.5V8.5l6.3 3.5-6.3 3.5z" fill="#111" />
                </svg>
                {s.watchYT}
              </a>
            )}
          </div>

          {/* Ingredients */}
          {ingredients.length > 0 && (
            <>
              <h3>{s.ingredients}</h3>
              <div className="ingredientsList">
                {ingredients.map(({ name, measure }) => (
                  <IngredientItem key={name} name={name} measure={measure} />
                ))}
              </div>
            </>
          )}

          {/* Instructions */}
          <h3>{s.instructions}</h3>
          {instrLoading ? (
            <p className="translating">{info.strInstructions}</p>
          ) : (
            <p>{translatedInstructions || info.strInstructions}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealInfo;
