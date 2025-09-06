import React from 'react';
import Mainpage from './components/Mainpage';
import {Route,Routes} from 'react-router-dom';
import MealInfo from './components/MealInfo';
import './App.css';
const App = () => {
  return (
 
    //  <Mainpage/>
      <Routes>
        <Route path='/' element={<Mainpage/>}></Route>
        <Route path='/:mealid' element={<MealInfo/>}/>
      
      </Routes>
  
  )
}

export default App
