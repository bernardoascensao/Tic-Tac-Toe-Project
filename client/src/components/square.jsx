import React from 'react'
import X_IMG from '../assets/X.png'
import O_IMG from '../assets/O.png'

const Square = ({ value, onClick }) => {
  return (
    <button className='w-[20vh] h-[20vh] p-3 border-2 rounded-md bg-slate-50 hover:bg-slate-100' onClick={onClick}>
      {
        value === "X" ? (
          <img src={X_IMG} alt="X" />
        ) : value === "O" ? (
          <img src={O_IMG} alt="O" />
        ) : (
          null
        )
      }
    </button>
  );
};

export default Square
