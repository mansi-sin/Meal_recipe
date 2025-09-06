import React from 'react'
import { NavLink } from 'react-router-dom'

const MealCard = ({detail}) => {
    console.log(detail)
  return (
    <div className='meals'>
      {!detail? "" : detail.map((item)=>{
        return(
        <div className='mealImg'>
            <img src={item.strMealThumb}/>
            <p>{item.strMeal}</p>
           <NavLink to={`/${item.idMeal}`}> <button >Recipe</button></NavLink>
        </div>
        )
        })
    }
    </div>
  )
}

export default MealCard
