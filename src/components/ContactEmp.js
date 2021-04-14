import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { increaseCount, decreaseCount } from '../store/actions/participantActions';

const ContactEmp = () => {
    const countNumber = useSelector(state=>state.count.countNumber)
    const result = useSelector(state=>state.count.result);
    const dispatch = useDispatch()
    
  console.log('res', countNumber);
    return (
        <div>
        <button onClick={()=>dispatch(decreaseCount())}>-</button>
           <h1>
             Count: {countNumber}
           </h1>
      <button onClick={()=>dispatch(increaseCount([1,'2']))}>+</button>
        </div>
    )
}

export default ContactEmp
