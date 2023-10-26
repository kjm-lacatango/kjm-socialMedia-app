import React, { useContext } from 'react'
import { MyContext } from './MyContext'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faMessage, faHeart, faUser } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Axios from 'axios'
import Swal from 'sweetalert2'

const MySavedPost = ({savedPosts, handleComment}) => {
  const {isDark, isTextOpen, setIsTextOpen, parStyle} = useContext(MyContext)
  const currentUser = JSON.parse(localStorage.getItem('userInfo'))
  const queryClient = useQueryClient()

  // to see all the likes each posts
  const {data: likes, isLoading} = useQuery({
    queryKey: ['savedLikes', savedPosts.id],
    queryFn: () => (
      Axios.get(`http://localhost:5001/api/likes/getLikes/${savedPosts.postId}`, {
        headers: {
          "x-access-token": localStorage.getItem('token')
        }
      }).then(res => res.data.result)
    )
  })
  // to like and dislike
  const likesMutation = useMutation({
    mutationFn: (uid) => {
      if (uid) {
          return Axios.delete(`http://localhost:5001/api/likes/unLike/${savedPosts.postId}`, {
          headers: {
            "x-access-token": localStorage.getItem('token')
          }
        })
      } else {
        return Axios.post(`http://localhost:5001/api/likes/addLike`, {pid: savedPosts.postId}, {
          headers: {
            "x-access-token": localStorage.getItem('token')
          }
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["savedLikes"])
    }
  })
  const handleLike = () => {
    likesMutation.mutate(likes.includes(currentUser.id))
  }

  // to unsaved
  const savedMutation = useMutation({
    mutationFn: () => (
      Axios.delete(`http://localhost:5001/api/savedPosts/unSavedPost/${savedPosts.id}`, {
        headers: {
          "x-access-token": localStorage.getItem('token')
        }
      })
    ), 
    onSuccess: () => {
      localStorage.removeItem(`isSaved_${savedPosts.postId}`)
      queryClient.invalidateQueries(["mySavedPost"])
    }
  })
  const handleSave = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to unsaved this post',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.isConfirmed) {
        savedMutation.mutate()
      }
    })
  }

  return (
    <div className={isDark ? 'shadow-2xl shadow-gray-600 flex flex-col justify-center w-full rounded-3xl py-3' : 'shadow-2xl flex flex-col justify-center w-full rounded-3xl py-3'}>
        <div>
            <div className='flex justify-between px-4 pb-2'>
                <div className='flex'>
                    {savedPosts.profile_pic ? (
                        <img src={`http://localhost:5001/images/${savedPosts.profile_pic}`} style={isDark ? {boxShadow: '1px 2px 4px #fff5'} : null}
                         className='w-8 h-8 rounded-full mr-3' />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className='mr-3 text-9xl w-5 h-4 pt-1 pb-2 px-1 rounded-full text-gray-200 bg-gray-500' />
                    )}
                    <h1 className={isDark ? 'text-white' : ''}>{savedPosts.firstname} {savedPosts.lastname}</h1>
                </div>
                <h1 className={isDark ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>{moment(savedPosts.createdAt).fromNow()}</h1>
            </div>
            <hr />
            <p style={isTextOpen ? null : parStyle} onClick={() => setIsTextOpen(prev => !prev)} 
             className={isDark ? 'cursor-pointer px-2 pt-1 mb-3 text-white' : 'cursor-pointer px-2 pt-1 mb-3'}>
                {savedPosts.description}
            </p>
            {savedPosts.image && <img src={`http://localhost:5001/images/${savedPosts.image}`} className='w-full h-80' />}
        </div>
        <div className='flex justify-between mt-4 px-8'>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                <FontAwesomeIcon icon={faHeart} onClick={handleLike} style={{color: likes?.includes(currentUser.id) ? 'red' : ''}} className='mr-2 cursor-pointer' />
                {isLoading ? '...' : likes?.length === 0 ? '' : likes.length === 1 ? likes.length + ' like' : likes.length + " likes"}
            </span>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                <FontAwesomeIcon icon={faMessage} onClick={() => handleComment(savedPosts.postId, savedPosts.id)} className='mr-2 cursor-pointer' />Comments
            </span>
            <FontAwesomeIcon icon={faBookmark} onClick={handleSave} className={isDark ? 'cursor-pointer text-blue-700' : 'cursor-pointer text-blue-700'} />
        </div>
    </div>
  )
}

export default MySavedPost
