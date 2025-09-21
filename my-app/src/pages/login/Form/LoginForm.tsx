import { useForm } from "react-hook-form"
import axios from 'axios'
import { useDispatch } from "react-redux"
import { login, loadToken,  } from "../../../redux/user/actions";
import { useState } from "react";
import { push } from "connected-react-router";

import "../Login.scss"


const { REACT_APP_BACKEND_URL } = process.env


export function LoginForm() {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch();
  const [error, setError] = useState('')
 
  
  return (
    <div className="formCenter">
      {/* login form */}
      <form className="formFields" onSubmit={handleSubmit(async data => {
        try {
          const res = await axios.post<any>(`${REACT_APP_BACKEND_URL}/login`, {
            email: data.loginEmail,
            password: data.loginPassword
          })
          // console.log(res.data.result.data.msg)
          
          if (res.data.token != null) {
            
            localStorage.setItem('token', res.data.token)
            dispatch(login(res.data.token))
            dispatch(loadToken(res.data.token))
            
            dispatch(push('/'))
          }
          else{
            setError(`${res.data.data.msg}`)
          }
        } catch (e: any) {
          setError('unknown error')
        }
      })}>
        <div className="formField">
          <label className="formFieldLabel" htmlFor="email">
            Email:
          </label>
          <input 
           className="formFieldInput"
           placeholder="Enter your email"
          {...register('loginEmail')} /> 
        </div>
        <div className="formField">
          <label className="formFieldLabel" htmlFor="password">
            Password:
          </label>
          <input 
            type="password"
            className="formFieldInput"
            placeholder="Enter your password"
            {...register('loginPassword')} />
        </div>
        <div className="formField">
          {error}
        </div>


        <div className="formField">
          <input className="formFieldButton" type="submit"/>
        </div>
      </form> 
    </div>
  )
}



