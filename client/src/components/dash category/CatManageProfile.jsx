import React, { useContext, useEffect, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowLeft, faFloppyDisk, faPencil, faUser } from '@fortawesome/free-solid-svg-icons'
import { MyContext } from '../MyContext'
import Axios from 'axios'
import Swal from 'sweetalert2'

const CatManageProfile = () => {
  const {handleBack, setUserInfo, userInfo, isDark} = useContext(MyContext)
  const [isUpdateFname, setIsUpdateFname] = useState(false)
  const [isUpdateLname, setIsUpdateLname] = useState(false)
  const [newFname, setNewFname] = useState('')
  const [newLname, setNewLname] = useState('')
  const [file, setFile] = useState(null)

  const updateInfo = (updateData, newData) => {
    Axios.put(`http://localhost:5001/api/auth/${updateData}`, {newData: newData}, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    }).then(res => {
      if (updateData === 'updateFname') {
        setIsUpdateFname(false)
      } else if (updateData === 'updateLname') {
        setIsUpdateLname(false)
      }
      setUserInfo(res.data.result)
    })
  }

  useEffect(() => {
    setNewFname(userInfo.firstname)
    setNewLname(userInfo.lastname)
  }, [])
  const handleCancelFname = () => {
    setIsUpdateFname(false)
    setNewFname(userInfo.firstname)
  }
  const handleCancelLname = () => {
    setIsUpdateLname(false)
    setNewLname(userInfo.lastname)
  }
  const handleSaveFname = () => {
    if (newFname.trim() !== '') {
      updateInfo('updateFname', newFname)
    } else {
      Swal.fire('Error', "Doesn't accept empty feild!", 'error')
    }
  }
  const handleSaveLname = () => {
    if (newLname.trim() !== '') {
      updateInfo('updateLname', newLname)
    } else {
      Swal.fire('Error', "Doesn't accept empty feild!", 'error')
    }
  }
  const updateProf = (img) => {
    Axios.post(`http://localhost:5001/api/auth/updateProfile`, {image: img}, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    }).then(res => {
      setUserInfo(res.data.result)
      setFile(null)
    })
  }
  const updateProfile = () => {
    const formData = new FormData()
    formData.append("image", file)
    Axios.post("http://localhost:5001/api/uploadImage", formData).then(res => updateProf(res.data.result))
  }

  return (
    <div className='h-full flex flex-col justify-center items-center pb-10 px-10 lg:px-40 md:px-20 sm:px-28 relative'
     style={isDark ? {background: 'rgba(52, 52, 52, 50)'} : null}>
      <div className='w-full'>
        <FontAwesomeIcon onClick={handleBack} icon={faArrowLeft} className={isDark ? 'cursor-pointer text-2xl hover:text-blue-700 text-white absolute left-8 top-3'
         : 'cursor-pointer text-2xl hover:text-blue-700 text-gray-700 absolute left-8 top-3'} />
      </div>
      <h1 className={isDark ? 'text-3xl text-center mb-4 text-gray-100' : 'text-3xl text-center mb-4 text-gray-600'}>
        <FontAwesomeIcon icon={faUser} className={isDark ? 'mr-4 text-gray-400' : 'mr-4 text-gray-700'} />Manage Profile
      </h1>
      
      {/* this is for updating profile picture */}
      <div className='border-b border-gray-400 w-full flex flex-col justify-center items-center mb-6'>
        <input type="file" id="inputFile" style={{display: 'none'}} onChange={(e) => setFile(e.target.files[0])} />
        <label htmlFor="inputFile">
          <FontAwesomeIcon icon={faPencil} title='update' className='ml-40 text-gray-600 text-xl cursor-pointer'
           style={isDark ? {color: 'lightgray'} : null} />
        </label>
        {userInfo.profile_pic ? (
          <>
            {file ? (
              <>
                <img src={URL.createObjectURL(file)} alt='profile' className={isDark ? 'w-60 h-60 rounded-full shadow-2xl shadow-gray-600' : 'w-60 h-60 rounded-full shadow-2xl'} />
                <div className='flex justify-between w-60 mb-4'>
                  <button onClick={updateProfile} className='border border-blue-700 hover:border-blue-800 bg-blue-700 text-white hover:bg-blue-800 hover:text-white py-.5 px-2 rounded-2xl duration-200'>
                    <FontAwesomeIcon icon={faFloppyDisk} className='mr-2' />save
                  </button>
                  <button onClick={() => setFile(null)} className='border border-gray-700 hover:border-red-800 bg-gray-300 text-gray-800 hover:bg-red-800 hover:text-white px-2 rounded-2xl duration-200'>
                    cancel
                  </button>
                </div>
              </>
            ) : (
              <img src={`http://localhost:5001/images/${userInfo.profile_pic}`} alt='profile' className={isDark ? 'w-60 h-60 rounded-full shadow-2xl shadow-gray-600' : 'w-60 h-60 rounded-full shadow-2xl'} />
            )}
          </>
        ) : (
          <>
            {file ? (
              <>
                <img src={URL.createObjectURL(file)} alt='profile' className={isDark ? 'w-60 h-60 rounded-full shadow-2xl shadow-gray-600' : 'w-60 h-60 rounded-full shadow-2xl'} />
                <div className='flex justify-between w-60 mb-4'>
                  <button onClick={updateProfile} className='border border-blue-700 hover:border-blue-800 bg-blue-700 text-white hover:bg-blue-800 hover:text-white py-.5 px-2 rounded-2xl duration-200'>
                    <FontAwesomeIcon icon={faFloppyDisk} className='mr-2' />save
                  </button>
                  <button onClick={() => setFile(null)} className='border border-gray-700 hover:border-red-800 bg-gray-300 text-gray-800 hover:bg-red-800 hover:text-white px-2 rounded-2xl duration-200'>
                    cancel
                  </button>
                </div>
              </>
            ) : (
              <FontAwesomeIcon icon={faUser} className='text-9xl w-40 h-40 pt-7 pb-9 px-8 rounded-full shadow-2xl text-gray-200 bg-gray-500' />
            )}
          </>
        )}
        <h1 className={isDark ? 'text-center my-2 text-xl text-white' : 'text-center my-2 text-xl'}>{userInfo.username}</h1>
      </div>

      {/* this is for updating firstname and lastname */}
      {isUpdateFname ? (
        <div className='flex justify-between w-full items-center mb-4'>
          <input value={newFname} onChange={(e) => setNewFname(e.target.value)}
            placeholder='Firstname' className={isDark ? 'w-full pl-2 py-1 border-b-2 border-gray-500 outline-none bg-transparent text-white' : 'w-full pl-2 py-1 border-b-2 border-gray-700 outline-none'} />
          <div className='flex'>
            <button onClick={handleSaveFname} className='bg-blue-800 text-white px-2 mx-3 rounded-xl hover:bg-blue-950 duration-200'>
              save
            </button>
            <button onClick={handleCancelFname} className={isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-800 hover:text-red-800'} title='cancel'><b>X</b></button>
          </div>
        </div>
      ) : (
        <div className='flex justify-between w-full items-center mb-2'>
          <p className='w-full pl-6 py-1 cursor-default text-lg' style={isDark ? {color: 'white'} : null}>{newFname}</p>
          <FontAwesomeIcon onClick={() => setIsUpdateFname(true)} icon={faPencil} title='update' className='text-gray-500 cursor-pointer' />
        </div>
      )}
      {isUpdateLname ? (
        <div className='flex justify-between w-full items-center mb-2'>
          <input value={newLname} onChange={(e) => setNewLname(e.target.value)}
            placeholder='Lastname' className={isDark ? 'w-full pl-2 py-1 border-b-2 border-gray-500 outline-none bg-transparent text-white' : 'w-full pl-2 py-1 border-b-2 border-gray-700 outline-none'} />
          <div className='flex'>
            <button onClick={handleSaveLname} className='bg-blue-800 text-white px-2 mx-3 rounded-xl hover:bg-blue-950 duration-200'>
            save
            </button>
            <button onClick={handleCancelLname} className={isDark ? 'text-gray-400 hover:text-red-500' : 'text-gray-800 hover:text-red-800'} title='cancel'><b>X</b></button>
          </div>
        </div>
      ) : (
        <div className='flex justify-between w-full items-center'>
          <p className='w-full pl-6 py-1 cursor-default text-lg' style={isDark ? {color: 'white'} : null}>{newLname}</p>
          <FontAwesomeIcon onClick={() => setIsUpdateLname(true)} icon={faPencil} title='update' className='text-gray-500 cursor-pointer' />
        </div>
      )}
    </div>
  )
}

export default CatManageProfile
