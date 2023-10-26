import React, { useContext, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPhotoFilm, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons'
import {MyContext} from '../MyContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Axios from 'axios'
import swal from 'sweetalert2'

const CatCreatePost = () => {
  const {handleBack, isDark} = useContext(MyContext)
  const queryClient = useQueryClient()
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState(null)

  const mutation = useMutation({
    mutationFn: (data) => (
      Axios.post('http://localhost:5001/api/posts/createPost', data, {
        headers: {
          "x-access-token": localStorage.getItem('token')
        }
      })
    ),
    onSuccess: () => {
      queryClient.invalidateQueries(['allPosts'])
      setFile(null)
      setDesc('')
      handleBack()
    }
  })

  const handleUpload = () => {
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      Axios.post('http://localhost:5001/api/uploadImage', formData).then(res => mutation.mutate({desc, image: res.data.result}))
    } else if (desc.trim()) {
      mutation.mutate({desc})
    } else {
      swal.fire('Error', 'Invalid!', 'error')
    }
  }

  return (
    <div className='h-full flex flex-col items-center pb-10 px-10 lg:px-40 md:px-20 sm:px-28 relative' style={isDark ? {background: 'rgba(52, 52, 52, 50)'} : null}>
      <div className='w-full'>
        <FontAwesomeIcon onClick={handleBack} icon={faArrowLeft} className={isDark ? 'cursor-pointer text-2xl hover:text-blue-700 text-gray-700 absolute left-8 top-3 text-white'
         : 'cursor-pointer text-2xl hover:text-blue-700 text-gray-700 absolute left-8 top-3'} />
        <h1 className={isDark ? 'text-3xl text-center my-6 text-cyan-400' : 'text-3xl text-center my-6 text-cyan-700'}>
          <FontAwesomeIcon icon={faPlus} className='mr-4' />Create Post
        </h1>
        <textarea onChange={(e) => setDesc(e.target.value)} placeholder="What's on your mind?" style={isDark ? {background: 'rgba(52, 52, 52, 50)', color: 'white'} : null}
          className='border border-gray-400 w-full h-20 px-4 py-1 mb-6 rounded-2xl outline-none shadow-2xl' />
        {file && <img src={URL.createObjectURL(file)} className='w-full h-80 rounded-lg mb-4' />}
      </div>
      <div className='flex justify-between w-full px-8'>
        <input type="file" id='pic' style={{display: 'none'}} onChange={(e) => setFile(e.target.files[0])} />
        {!file ? (
          <label htmlFor='pic' className='bg-blue-700 px-2 pt-1.5 text-white rounded-2xl hover:bg-blue-900 duration-200 cursor-pointer'>
            <FontAwesomeIcon icon={faPhotoFilm} className='mr-2' />Add Photo
          </label>
        ) : (
          <button onClick={() => setFile(null)} className='bg-gray-700 py-1 text-white px-2 rounded-2xl hover:bg-red-800 duration-200'>
            <FontAwesomeIcon icon={faPhotoFilm} className='mr-2' />Remove Photo
          </button>
        )}
        <button onClick={handleUpload} disabled={mutation.isPending}
         className={isDark ? 'border-2 border-blue-600 text-blue-300 hover:bg-blue-600 hover:text-white py-1 px-2 rounded-2xl duration-200'
         : 'border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white py-1 px-2 rounded-2xl duration-200'}>
          <FontAwesomeIcon icon={faUpload} className='mr-2' />Upload
        </button>
      </div>
    </div>
  )
}

export default CatCreatePost
