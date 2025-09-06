import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
const MealInfo = () => {
    const {mealid}=useParams();
    const [info,setinfo]=useState();
    const getinfo=async()=>{
        const get=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealid}`)
        const jsondata=await get.json();
        console.log(jsondata.meals[0]);
        setinfo(jsondata.meals[0]);
    }
    if(info != ""){
        getinfo();
    }
  return (
    <>
    { !info? "Data Not Found" :  <div className='msg'>
      <img src={info.strMealThumb}/>
      <div className='info'>
        <h1>Recipe Detail</h1>
        <button>{info.strMeal}
        </button>
        <h3>Instruction</h3>
        <p>{info.strInstructions}</p>
      </div>
    </div>}
    </>
   
  )
}

export default MealInfo
