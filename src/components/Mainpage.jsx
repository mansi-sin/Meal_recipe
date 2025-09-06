import React, { useState } from 'react'
import MealCard from './MealCard';

const Mainpage = () => {
    const [data,setdata]=useState();
    const [search,setsearch]=useState("");
    const [msg,setmsg]=useState("");
    const handleInput=(e)=>{
      setsearch(e.target.value);
    }
    const fun=async()=>{
      if(search == ""){
        setmsg("Please Enter Your Food");
      }
      else{
        const get=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
        const getdata = await get.json();
     //   console.log(getdata.meals);   
        setdata(getdata.meals);
        setmsg("")
    }
  }
  //  console.log(data);
  return (
    <>
    <h1 className='head'>Food Recipe App</h1>
      <div className='container'>
        <div className='serachBar'>
            <input type='text' onChange={handleInput} placeholder='enter your food'></input>
        <button onClick={fun}>Search</button>
        </div>
        <h4 className='error'>{msg}</h4>
        <div>
      <MealCard detail={data}/>
     
        </div>
      </div>
    </>
  )
}

export default Mainpage;
