import React, { useContext, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faArrowLeft, faShare } from '@fortawesome/free-solid-svg-icons'
import {MyContext} from '../MyContext'
import Comment from '../Comment'
import MyPost from '../myPost'
import { useQuery } from '@tanstack/react-query'
import Axios from 'axios'

const CatMyPost = () => {
  const {handleBack, isDark} = useContext(MyContext)
  const [postId, setPostId] = useState(null)

  const {data: myPostData, isLoading} = useQuery({
    queryKey: ["myPost"],
    queryFn: () => (
      Axios.get('http://localhost:5001/api/posts/getMyPosts', {
        headers: {
          "x-access-token": localStorage.getItem('token')
        }
      }).then(res => res.data.result)
    )
  })

  const handleComment = (id) => {
    setPostId(id)
  }

  if (isLoading) {
    <div className='bg-red-500'>
      <h1 className='text-2xl'><b>Loading...</b></h1>
    </div>
  } else {
    return (
      <div className='h-full flex flex-col items-center pb-10 px-10 lg:px-40 md:px-20 sm:px-28 relative'
       style={isDark ? {overflow: 'auto'} : null}>
        <div className='z-20 backdrop-blur-sm fixed flex justify-center py-3 md:w-2/3 w-full px-4'>
          <div className='w-full'>
            <FontAwesomeIcon onClick={handleBack} icon={faArrowLeft} className={isDark ? 'cursor-pointer text-2xl hover:text-blue-700 text-white absolute left-8 top-3'
             : 'cursor-pointer text-2xl hover:text-blue-700 text-gray-700 absolute left-8 top-3'} />
            <h1 className={isDark ? 'text-3xl text-center my-6 text-gray-200' : 'text-3xl text-center my-6 text-gray-700'}>
              <FontAwesomeIcon icon={faShare} className='mr-4 text-cyan-700' />My Post
            </h1>
          </div>
        </div>

        <div className='pb-10 pt-28 flex flex-col items-center gap-12' 
         style={isDark ? {background: 'rgba(52, 52, 52, 50)', width: '100%'} : null}>
          {isLoading ? <h1 className={isDark ? 'text-white text-2xl mt-28' : 'text-black text-2xl mt-28'}><b>Loading . . .</b></h1> : (
            myPostData.map(p => p.id === postId ? (
              <Comment key={p.id} setPostId={setPostId} />
            ) : (
              <MyPost key={p.id} post={p} handleComment={handleComment} />
            ))
          )}
        </div>
      </div>
    )
  }
}

export default CatMyPost
