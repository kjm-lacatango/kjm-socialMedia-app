import React, { useContext, useEffect, useState } from 'react'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import { MyContext } from '../components/MyContext'
import bg from '../images/socialMedia.jpg'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const Main = () => {
    const navigate = useNavigate()
    const {isReg, isLog, isRegister, isLogin} = useContext(MyContext)
    const [isHome, setIsHome] = useState(true)
    const [isShow, setIsShow] = useState(false)

    useEffect(() => {
        const isActive = localStorage.getItem('token')
        if (isActive) {
            navigate('/dash')
        }
    }, [])

  return (
    <div>
        <div className='relative h-screen w-screen bg-gradient-to-tl from-cyan-950 to-sky-100'>
            <img src={bg} className='absolute h-screen w-screen object-cover mix-blend-overlay' />
            <header className='flex justify-between items-center py-3 px-10 sm:pl-28 bg-transparent fixed w-screen'>
                <h1 className='text-3xl text-blue-950 cursor-default'>KJM</h1>
                <div className='flex justify-around items-center w-96 hidden sm:flex'>
                    <h3 onClick={() => setIsHome(true)} style={{color: isHome ? 'orangered' : ''}} className='z-10 cursor-pointer text-zinc-100 hover:text-orange-600'>Home</h3>
                    <h3 onClick={() => setIsHome(false)} style={{color: isHome ? '' : 'orangered'}} className='z-10 cursor-pointer text-zinc-100 hover:text-orange-600'>About</h3>
                    <button onClick={isRegister}
                        className='z-10 border rounded-xl border-zinc-100 px-2 text-orange-100 hover:bg-orange-800 hover:border-orange-800'
                    >Signup</button>
                </div>
                <FontAwesomeIcon icon={faBars} onClick={() => setIsShow(true)} className='block sm:hidden cursor-pointer text-zinc-900 text-2xl hover:text-orange-700' />
            </header>

            {isShow && (
                <div className='h-full backdrop-blur-sm sm:hidden absolute w-full z-20'>
                    <div className='bg-blue-900 text-zinc-100 p-8 flex flex-col justify-center items-center'>
                        <FontAwesomeIcon icon={faArrowLeft} onClick={() => setIsShow(false)} className='absolute top-8 left-8 text-xl cursor-pointer' />
                        <h3 onClick={() => {setIsShow(false);setIsHome(true)}} className='w-full py-3 text-center rounded-2xl hover:bg-blue-950 cursor-pointer mt-16'>Home</h3>
                        <h3 onClick={() => {setIsShow(false);setIsHome(false)}} className='w-full py-3 text-center rounded-2xl hover:bg-blue-950 cursor-pointer mb-14'>About</h3>
                        <button onClick={isRegister} className='w-full py-3 text-gray-300 border-2 border-blue-950 hover:bg-blue-950 text-center rounded-2xl'>Signup</button>
                    </div>
                </div>
            )}

            {isHome ? (
                <main className='flex flex-col justify-center items-center h-screen'>
                    <h1 className='text-white text-5xl sm:text-6xl font-bold mb-12 px-5 text-center'>Social Media</h1>
                    <p className='z-10 cursor-default text-gray-200 text-xl mb-3'>Click the button below to get started</p>
                    <button onClick={isLogin} className='z-10 bg-orange-950 text-white py-1 px-3 rounded-3xl shadow shadow-zinc-400 border border-orange-950 hover:bg-transparent hover:border-orange-800 hover:border-white'>Get Started</button>    
                </main>
            ) : (
                <div className='flex flex-col justify-center items-center h-screen'>
                    <div>
                    <h1 className='text-white text-center text-5xl sm:text-6xl font-bold mb-12'>About Us</h1>
                    <p className='z-10 cursor-default text-gray-200 text-lg sm:text-xl mb-3 px-10 sm:px-20'>
                        This is created by Keannu John Mellen Lacatango using Mysql, Express, React and Node.<br />
                        I did this to broaden my understanding of web development.<br /><br />
                        Similar to other social media apps, it allows you to post, like, comment, save and do other things.<br/>
                        To continue press the button below.
                    </p>
                    </div>
                    <button onClick={isLogin} className='z-10 bg-orange-950 text-white py-1 px-3 rounded-3xl shadow shadow-zinc-400 border border-orange-950 hover:bg-transparent hover:border-orange-800 hover:border-white'>Continue</button>
                </div>
            )}
        </div>

        {isLog && <Login />}
        {isReg && <Register />}
    </div>
  )
}

export default Main
