import React, { useContext } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser, faMoon, faPowerOff, faShare, faPlus, faBookmark, faArrowLeft, faSun} from '@fortawesome/free-solid-svg-icons'
import AllAndFollowing from '../components/AllAndFollowing'
import CatCreatePost from '../components/dash category/CatCreatePost'
import CatManageProfile from '../components/dash category/CatManageProfile'
import CatMyPost from '../components/dash category/CatMyPost'
import CatSaved from '../components/dash category/CatSaved'
import { MyContext } from '../components/MyContext'
import {useNavigate} from 'react-router-dom'
import Axios from 'axios'
import swal from 'sweetalert2'

const Dashboard = () => { 
  const navigate = useNavigate()
  const {
    isAllAndFollowing, isCatCreatePost, isCatManageProfile, isCatMyPost, isCatSaved, createPost, manageProfile, myPost, saved,
    isShow, setIsShow,dropCreatePost, dropManageProfile, dropMyPost, dropSaved, userInfo, setIsLogged, isDark, handleDark, 
    setIsCatSaved, setIsCatMyPost, setIsCatManageProfile, setIsCatCreatePost, setIsAllAndFollowing
  } = useContext(MyContext)

  const handleLogout = () => {
    swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.isConfirmed) {
        Axios.post('http://localhost:5001/api/auth/logout').then((res) => {
          if (res.data.message) {
            console.log(res.data.message)
            localStorage.removeItem('userInfo')
            localStorage.removeItem('token')
            navigate('/')
            setIsShow(true)
            setIsLogged(false)
            setIsCatCreatePost(false)
            setIsCatManageProfile(false)
            setIsCatMyPost(false)
            setIsCatSaved(false)
            setIsAllAndFollowing(true)
          } else {
            swal.fire('Error', 'Logout error!', 'error')
          }
        }).catch(err => console.log(err))  
      }
    })
  }

  return (
    <div>
      <header className='z-20 flex justify-between items-center z-10 pt-3 pb-4 px-10 pl-10 md:pl-28 bg-white fixed w-screen'
       style={isDark ? {background: 'rgba(52, 52, 52, 50)'} : null}>
        <h1 className='text-3xl text-blue-950 cursor-default' style={isDark ? {color: 'aliceblue'} : null}>KJM</h1>
        <div className='flex items-center md:cursor-default'>
          <h2 className='mr-3 text-sm' style={isDark ? {color: 'white'} : null}>{userInfo.firstname} {userInfo.lastname}</h2>
          {userInfo.profile_pic ? (
            <img src={`http://localhost:5001/images/${userInfo.profile_pic}`} alt="pic" className='w-7 h-7 rounded-full hidden md:block'
            style={isDark ? {boxShadow: '1px 1px 3px aliceblue'} : null}/>
          ) : (
            <FontAwesomeIcon icon={faUser} style={isDark ? {color: 'white', background: 'lightgray'} : null}
             className='text-9xl w-5 h-4 pt-1 pb-2 px-1 rounded-full shadow-2xl text-gray-200 bg-gray-500 hidden md:block' />
          )}
          {/* for small screen */}
          <div className='block md:hidden cursor-pointer flex' onClick={() => setIsShow(false)}>
            {userInfo.profile_pic ? (
              <img src={`http://localhost:5001/images/${userInfo.profile_pic}`} alt="pic" className='w-7 h-7 rounded-full'
              style={isDark ? {boxShadow: '1px 1px 3px aliceblue'} : null} />
            ) : (
              <FontAwesomeIcon icon={faUser} style={isDark ? {color: 'white', background: 'lightgray'} : null}
               className='text-9xl w-5 h-4 pt-1 pb-2 px-1 rounded-full shadow-2xl text-gray-200 bg-gray-500' />
            )}
            <span className='ml-1' style={isDark ? {color: 'white'} : null}>v</span>
          </div>
        </div>
      </header>

      {isShow ? (
        <main className='flex h-screen pl-1/3' style={isDark ? {background: 'rgba(52, 52, 52, 50)'} : null}>
          {/* left side */}
          <div className='w-1/3 hidden md:block'>
            <div style={isDark ? {background: 'rgba(52, 52, 52, 50)', border: '2px solid lightGray'} : null}
             className='h-full z-10 border-r-2 border-gray-500 px-12  flex-col justify-between pb-8 pt-16 fixed hidden md:flex md:1/3 lg:w-1/3'>
              <div>
                <div className='flex justify-center'>
                  {userInfo.profile_pic ? (
                    <img src={`http://localhost:5001/images/${userInfo.profile_pic}`} alt="pic" style={isDark ? {boxShadow: '1px 2px 8px #fff5'} : null}
                     className='w-48 h-48 rounded-full shadow-md shadow-zinc-600 mx-auto' />
                  ) : (
                    <FontAwesomeIcon icon={faUser} style={isDark ? {color: 'white', background: 'lightgray'} : null}
                     className='mt-2 text-9xl w-28 h-28 pt-4 pb-8 px-6 rounded-full text-gray-200 bg-gray-500' />
                  )}
                </div>
                <h1 className='text-center text-lg pb-1 pt-4' style={isDark ? {color: 'white'} : null}>{userInfo.username}</h1>
                <hr className='mb-5' />
                <button onClick={createPost} 
                 className={!isDark ? 'flex w-full hover:bg-blue-100 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box text-lg text-cyan-700'
                 : 'flex w-full hover:bg-gray-700 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box text-lg text-cyan-400'}>
                  <FontAwesomeIcon icon={faPlus}  className={!isDark ? 'mr-3 text-cyan-700 text-xl' : 'mr-3 text-cyan-400 text-xl'} />Create Post
                </button>
                <button onClick={manageProfile} style={isDark ? {color: 'white'} : null}
                 className={!isDark ? 'flex w-full hover:bg-blue-100 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box' 
                 : 'flex w-full hover:bg-gray-700 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box'}>
                  <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-700' style={isDark ? {color: 'gray'} : null} />Manage Profile
                </button>
                <button onClick={handleDark} className={!isDark ? 'flex w-full hover:bg-blue-100 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box'
                 : 'flex w-full hover:bg-gray-700 duration-200 items-center text-white text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box'}>
                  {!isDark ? <><FontAwesomeIcon icon={faMoon}  className='mr-3 text-black' />Dark Mode</> : <><FontAwesomeIcon icon={faSun} className='mr-3 text-white' />Light Mode</>}
                </button>
                <button onClick={myPost} className={!isDark ? 'flex w-full hover:bg-blue-100 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box'
                 : 'flex w-full hover:bg-gray-700 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box text-white'}>
                  <FontAwesomeIcon icon={faShare}  className='mr-3 text-blue-500' />My Post
                </button>
                <button onClick={saved} className={!isDark ? 'flex w-full hover:bg-blue-100 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box'
                 : 'flex w-full hover:bg-gray-700 duration-200 items-center text-left py-1 px-3 mb-1 rounded-xl hover:pl-4 cursor-pointer border-box text-white'}>
                  <FontAwesomeIcon icon={faBookmark}  className='mr-3 text-blue-700' />Saved
                </button>
              </div>
              <button onClick={handleLogout} className={!isDark ? 'flex justify-center w-full hover:bg-blue-100 duration-200 items-center py-1 px-3 rounded-xl cursor-pointer border-2 border-gray-300'
               : 'flex justify-center w-full hover:bg-gray-700 duration-200 items-center py-1 px-3 rounded-xl cursor-pointer border-2 border-gray-500 text-white'}>
                <FontAwesomeIcon icon={faPowerOff} className={!isDark ? 'mr-3 text-gray-500' : 'mr-3 text-gray-400'} />Logout
              </button> 
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='md:w-2/3 pt-16 w-full'>
            {/* for all and following post */}
            {isAllAndFollowing && <AllAndFollowing />}
            {/* for create post */}
            {isCatCreatePost && <CatCreatePost />}
            {/* for manage post */}
            {isCatManageProfile && <CatManageProfile />}
            {/* for my post */}
            {isCatMyPost && <CatMyPost />}
            {/* for saved */}
            {isCatSaved && <CatSaved />}
          </div>
        </main>
      ) : (
        // drop down for small device
        <div className='absolute bg-white flex flex-col justify-between py-10 px-8 h-screen z-20 w-screen h-screen block'
           style={isDark ? {background: 'rgba(52, 52, 52, 50)', overflow: 'auto'} : null}>
          <div className='flex flex-col'>
            <FontAwesomeIcon icon={faArrowLeft} onClick={() => setIsShow(true)} className={!isDark ? 'absolute text-2xl text-left text-gray-700 hover:text-blue-600 cursor-pointer'
             : 'absolute text-2xl text-left text-white hover:text-blue-400 cursor-pointer'} />
            {userInfo.profile_pic ? (
              <img src={`http://localhost:5001/images/${userInfo.profile_pic}`} alt="pic" style={isDark ? {boxShadow: '1px 2px 8px #fff5'} : null}
               className='w-48 h-48 rounded-full shadow-md shadow-zinc-600 mx-auto' />
            ) : (
              <FontAwesomeIcon icon={faUser} style={isDark ? {color: 'white', background: 'lightgray'} : null}
               className='mt-2 text-9xl w-28 h-28 pt-4 pb-8 px-6 rounded-full text-gray-200 bg-gray-500 mx-auto' />
            )}
            <h1 className={!isDark ? 'text-center text-lg pb-1 pt-4' :'text-center text-lg pb-1 pt-4 text-white'}>{userInfo.username}</h1>
            <hr className='mb-5' />
            <button onClick={dropCreatePost} className={!isDark ? 'rounded-2xl py-2 hover:bg-blue-100 mb-1 text-cyan-700 text-xl'
             : 'rounded-2xl py-2 hover:bg-gray-700 mb-1 text-cyan-400 text-xl'}>
              <FontAwesomeIcon icon={faPlus}  className={!isDark ? 'mr-3 text-cyan-700 text-xl' : 'mr-3 text-cyan-400 text-xl'} />Create Post
            </button>
            <button onClick={dropManageProfile} className={!isDark ? 'rounded-2xl py-2 hover:bg-blue-100 mb-1'
             : 'rounded-2xl py-2 hover:bg-gray-700 mb-1 text-white'}>
              <FontAwesomeIcon icon={faUser} className='mr-3 text-gray-700' style={isDark ? {color: 'gray'} : null} />Manage Profile
            </button>
            <button onClick={handleDark} className={!isDark ? 'rounded-2xl py-2 hover:bg-blue-100 mb-1' : 'rounded-2xl py-2 hover:bg-gray-700 mb-1 text-white'}>
            {!isDark ? <><FontAwesomeIcon icon={faMoon}  className='mr-3 text-black' />Dark Mode</> : <><FontAwesomeIcon icon={faSun} className='mr-3 text-white' />Ligth Mode</>}
            </button>
            <button onClick={dropMyPost} className={!isDark ? 'rounded-2xl py-2 hover:bg-blue-100 mb-1' : 'rounded-2xl py-2 hover:bg-gray-700 mb-1 text-white'}>
              <FontAwesomeIcon icon={faShare}  className='mr-3 text-blue-500'/>My Post
            </button>
            <button onClick={dropSaved} className={!isDark ? 'rounded-2xl py-2 hover:bg-blue-100 mb-1' : 'rounded-2xl py-2 hover:bg-gray-700 mb-1 text-white'}>
              <FontAwesomeIcon icon={faBookmark}  className='mr-3 text-blue-700' />Saved
            </button>
          </div>
          <button onClick={handleLogout} className={!isDark ? 'rounded-2xl py-2 hover:bg-blue-100 mb-1 border-2 border-gray-300'
           : 'rounded-2xl py-2 hover:bg-gray-700 mb-1 border-2 border-gray-500 text-white'}>
            <FontAwesomeIcon icon={faPowerOff} className={!isDark ? 'mr-3 text-gray-500' : 'mr-3 text-gray-400'} />Logout
          </button> 
        </div>
      )}
    </div>
  )
}

export default Dashboard
