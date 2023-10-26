import React, { useContext, useEffect } from 'react'
import { MyContext } from '../MyContext'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const {isLogin, userReg, setUserReg, handleCancel, handleRegister, isLogged} = useContext(MyContext)
  const navigate = useNavigate()

  const handleReg = (e) => {
    e.preventDefault()
    handleRegister()
  }
  
  useEffect(() => {
    if (isLogged) navigate("/dash")
  }, [isLogged])
  
  return (
    <div className='backdrop-blur-sm absolute top-0 w-screen h-screen flex justify-center items-center z-20'>
      <form onSubmit={handleReg} className=' relative bg-white py-5 px-10 rounded-3xl flex flex-col justify-center items-center w-96'>
        <h1 onClick={handleCancel} className='absolute top-2 right-4 font-semibold text-xl hover:text-red-600 cursor-pointer'>X</h1>
        <h1 className='text-3xl my-3 text-blue-900'>Sign Up</h1>
        <input className='border-b border-gray-600 w-full pl-1 text-lg outline-none mb-3' required
          placeholder='Firstname' value={userReg.fname} onChange={(e) => setUserReg({...userReg, fname: e.target.value})} />
        <input className='border-b border-gray-600 w-full pl-1 text-lg outline-none mb-3' required
          placeholder='Lastname' value={userReg.lname} onChange={(e) => setUserReg({...userReg, lname: e.target.value})} />
        <input className='border-b border-gray-600 w-full pl-1 text-lg outline-none mb-3' required
          placeholder='Username' value={userReg.username} onChange={(e) => setUserReg({...userReg, username: e.target.value})} />
        <input className='border-b border-gray-600 w-full pl-1 text-lg outline-none mb-3' required
          type='password' placeholder='Password' value={userReg.password} onChange={(e) => setUserReg({...userReg, password: e.target.value})} />
        <input className='border-b border-gray-600 w-full pl-1 text-lg outline-none mb-10' required
          type='password' placeholder='Confirm Password' value={userReg.confirmPass} onChange={(e) => setUserReg({...userReg, confirmPass: e.target.value})} />
        <p className='italic text-gray-400 mb-2'>Already have an account?
          <span onClick={isLogin} className='text-gray-700 ml-2 hover:text-orange-500 cursor-pointer'>Login</span>
        </p>
        <button type='submit' className='bg-blue-950 text-white py-0.5 px-3 rounded-3xl border-blue-900 border hover:bg-white hover:text-blue-900'>
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
