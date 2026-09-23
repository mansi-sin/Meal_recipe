import React from 'react';
import Mainpage from './components/Mainpage';
import { Route, Routes } from 'react-router-dom';
import MealInfo from './components/MealInfo';
import { LanguageProvider, useLang } from './context/LanguageContext';
import './App.css';

/** Fixed top-right language toggle — visible on every page */
const LangToggle = () => {
  const { lang, toggleLang } = useLang();
  return (
    <button
      className="langToggle"
      onClick={toggleLang}
      title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      aria-label="Toggle language"
    >
      <span className={lang === 'en' ? 'lt-active' : ''}>EN</span>
      <span className="lt-sep" />
      <span className={lang === 'hi' ? 'lt-active' : ''}>HI</span>
    </button>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <LangToggle />
      <Routes>
        <Route path='/' element={<Mainpage />} />
        <Route path='/:mealid' element={<MealInfo />} />
      </Routes>
    </LanguageProvider>
  );
};

export default App;
