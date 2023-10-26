import React, { useContext, useEffect } from 'react'
import { MyContext } from '../MyContext'
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const {userLog, setUserLog, isRegister, handleCancel, handleLogin, isLogged} = useContext(MyContext)
  const navigate = useNavigate()

  const handleLog = (e) => {
    e.preventDefault()
    handleLogin()
  }
  useEffect(() => {
    if (isLogged) navigate("/dash")
  }, [isLogged])

  return (
    <div className='absolute top-0 backdrop-blur-sm w-screen h-screen flex justify-center items-center z-20'>
      <form onSubmit={handleLog} className='relative bg-white py-5 px-10 rounded-3xl flex flex-col items-center w-96'>
        <h1 onClick={handleCancel} className='absolute top-2 right-4 font-semibold text-xl hover:text-red-600 cursor-pointer'>X</h1>
        <h1 className='text-3xl my-3 text-blue-900'>Sign In</h1>
        <input className='border-b border-gray-600 w-full pl-1 text-lg outline-none mb-3' required
          placeholder='Username' value={userLog.username} onChange={(e) => setUserLog({...userLog, username: e.target.value})} />
        <input className='border-b border-gray-600 w-full pl-1 text-lg outline-none mb-10' required
          type='password' placeholder='Password' value={userLog.password} onChange={(e) => setUserLog({...userLog, password: e.target.value})} />
        <p className='italic text-gray-400 mb-2'>Don't have an account?
          <span onClick={isRegister} className='text-gray-700 ml-2 hover:text-orange-500 cursor-pointer'>Register</span>
        </p>
        <button type='submit' className='bg-blue-950 text-white py-0.5 px-3 rounded-3xl border-blue-900 border hover:bg-white hover:text-blue-900'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
