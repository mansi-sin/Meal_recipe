import React from 'react';
import { NavLink } from 'react-router-dom';
import useTranslate from '../hooks/useTranslate';
import { useLang } from '../context/LanguageContext';
import { STRINGS } from '../utils/strings';

/** Translates a single meal name, shows shimmer while loading */
const TranslatedName = ({ name }) => {
  const { text, loading } = useTranslate(name);
  return (
    <p className={loading ? 'translating' : ''}>
      {text || name}
    </p>
  );
};

const MealCard = ({ detail }) => {
  const { lang } = useLang();
  const s = STRINGS[lang];

  if (!detail || detail.length === 0) return null;

  return (
    <div className="meals">
      {detail.map((item, index) => (
        <div
          className="mealImg"
          key={item.idMeal}
          style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
        >
          {/* Category ribbon */}
          {item.strCategory && (
            <span className="mealRibbon">{item.strCategory}</span>
          )}

          <img src={item.strMealThumb} alt={item.strMeal} />

          <div className="mealCardBody">
            <TranslatedName name={item.strMeal} />

            <div className="cardFooter">
              {item.strArea && (
                <span className="mealAreaTag">{item.strArea}</span>
              )}
              <NavLink to={`/${item.idMeal}`}>
                <button>{s.viewRecipe}</button>
              </NavLink>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealCard;
