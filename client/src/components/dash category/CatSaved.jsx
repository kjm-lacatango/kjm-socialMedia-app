import React, { useContext, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBookmark } from '@fortawesome/free-solid-svg-icons'
import {MyContext} from '../MyContext'
import Comment from '../Comment'
import Axios from 'axios'
import MySavedPost from '../mySavedPost'
import { useQuery } from '@tanstack/react-query'

const CatSaved = () => {
  const {handleBack, isDark} = useContext(MyContext)
  const [comment, setComment] = useState(null)
  const [sid, setSid] = useState(null)

  const {data: CurrentUserSavedPosts, isLoading} = useQuery({
    queryKey: ['mySavedPost'],
    queryFn: () => (
      Axios.get(`http://localhost:5001/api/savedPosts/getSavedPosts`, {
        headers: {
          "x-access-token": localStorage.getItem('token')
        }
      }).then(res => res.data.result)
    )
  })

  const handleComment = (pid, savedId) => {
    setComment(pid)
    setSid(savedId)
  }

  return (
    <div className='h-full flex flex-col items-center pb-10 px-10 lg:px-40 md:px-20 sm:px-28 relative'
    style={isDark ? {overflow: 'auto'} : null}>
      <div className='z-20 backdrop-blur-sm fixed flex justify-center py-3 md:w-2/3 w-full px-4'>
        <div className='w-full'>
          <FontAwesomeIcon onClick={handleBack} icon={faArrowLeft} className={isDark ? 'cursor-pointer text-2xl hover:text-blue-700 text-white absolute left-8 top-3'
           : 'cursor-pointer text-2xl hover:text-blue-700 text-gray-700 absolute left-8 top-3'} />
          <h1 className={isDark ? 'text-3xl text-center my-6 text-gray-200' : 'text-3xl text-center my-6 text-gray-700'}>
            <FontAwesomeIcon icon={faBookmark} className='mr-4 text-cyan-700' />Saved
          </h1>
        </div>
      </div>

      <div className='pb-10 pt-28 flex flex-col items-center gap-12 w-full'>
        {isLoading ? <h1 className={isDark ? 'text-2xl mt-40 text-white' : 'text-2xl mt-28'}><b>Loading . . .</b></h1> : (
          CurrentUserSavedPosts.length > 0 ? CurrentUserSavedPosts.map(savedPosts => savedPosts.postId === comment && savedPosts.id === sid ? (
            <Comment key={savedPosts.id} setPostId={setComment} pid={savedPosts.postId} />
          ) : (
            <MySavedPost key={savedPosts.id} savedPosts={savedPosts} handleComment={handleComment} />
          )) : (
            <h1 className={isDark ? 'text-2xl text-white mt-40' : 'text-2xl text-black mt-40'}>You have no saved</h1>
          )
        )}
      </div>
    </div>
  )
}

export default CatSaved
