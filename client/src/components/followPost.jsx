import React, { useContext, useEffect, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBookmark, faHeart, faMessage, faTrash, faUser} from '@fortawesome/free-solid-svg-icons'
import { MyContext } from './MyContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Axios from 'axios'
import moment from 'moment'

const FollowPost = ({followPost, handleComment}) => {
    const queryClient = useQueryClient()
    const currentUser = JSON.parse(localStorage.getItem('userInfo'))
    const {parStyle, handleSave, setIsTextOpen, isTextOpen, isDark} = useContext(MyContext)
    const [isSaved, setsIsSaved] = useState(JSON.parse(localStorage.getItem(`isSaved_${followPost.id}`)))
    
    const mutation = useMutation({
        mutationFn: (uid) => (
            Axios.delete(`http://localhost:5001/api/relationship/deleteRelation/${uid}`, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
        ),
        onSuccess: () => {
            queryClient.invalidateQueries(["relation"])
        }
    })

    const unFollow = (uid) => {
        mutation.mutate(uid)
    }

    // to get all the likes
    const {data: likes, isLoading} = useQuery({
        queryKey: ['followLikes', followPost.id],
        queryFn: () => (
          Axios.get(`http://localhost:5001/api/likes/getLikes/${followPost.id}`, {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
          }).then(res => res.data.result)
        )
    })
    const likesMutation = useMutation({
        mutationFn: (uid) => {
            if (uid) {
                return Axios.delete(`http://localhost:5001/api/likes/unLike/${followPost.id}`, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                })
            } else {
                return Axios.post(`http://localhost:5001/api/likes/addLike`, {pid: followPost.id}, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["followLikes"])
        }
    })
    const handleLike = () => {
        likesMutation.mutate(likes.includes(currentUser.id))
    }

    // for saved and unsaved post
    const handleSaved = () => {
        Axios.post(`http://localhost:5001/api/savedPosts/addSavedPost`, {pid: followPost.id}, {
          headers: {
            "x-access-token": localStorage.getItem('token')
          }
        }).then(res => {
            console.log(res.data)
            setsIsSaved(localStorage.setItem(`isSaved_${followPost.id}`, JSON.stringify({curUser: currentUser.id, postId: followPost.id})))
        })
    }
    const handleUnSaved = () => {
        Axios.delete(`http://localhost:5001/api/savedPosts/delSavedPost/${followPost.id}`, {
          headers: {
            "x-access-token": localStorage.getItem('token')
          }
        }).then(res => {
            console.log(res.data)
            setsIsSaved(localStorage.removeItem(`isSaved_${followPost.id}`))
        })
    }

  return (
    <div className={isDark ? 'shadow-2xl shadow-zinc-600 flex flex-col justify-center w-full rounded-3xl py-3' : 'shadow-2xl flex flex-col justify-center w-full rounded-3xl py-3'} 
     style={isDark ? {background: 'rgba(52, 52, 52, 50)'} : null}>
        <div>
            <div className='flex justify-between px-4 pb-2'>
                <div className='flex'>
                    {followPost.profile_pic ? (
                        <img src={`http://localhost:5001/images/${followPost.profile_pic}`} style={isDark ? {boxShadow: '1px 2px 4px #fff5'} : null}
                         className='w-8 h-8 rounded-full mr-3'  />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className='mr-3 text-9xl w-5 h-4 pt-1 pb-2 px-1 rounded-full text-gray-200 bg-gray-500' />
                    )}
                    <div className='flex flex-col items-start'>
                        <h1 className={isDark ? 'text-white' : ''}>{followPost.firstname} {followPost.lastname}</h1>
                        <button className='text-blue-500' onClick={() => unFollow(followPost.userId)}>Unfollow</button>
                    </div>
                </div>
                <h1 className={isDark ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>{moment(followPost.createdAt).fromNow()}</h1>
            </div>
            <hr />
            <p style={isTextOpen ? null : parStyle} onClick={() => setIsTextOpen(prev => !prev)} className={isDark ? 'cursor-pointer px-2 pt-1 mb-3 text-white' : 'cursor-pointer px-2 pt-1 mb-3'}>
                {followPost.description}
            </p>
            {followPost.image && <img src={`http://localhost:5001/images/${followPost.image}`} className='w-full h-80' />}
        </div>

        <div className='flex justify-between mt-4 px-8'>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                <FontAwesomeIcon icon={faHeart} onClick={handleLike} style={{color: likes?.includes(currentUser.id) ? 'red' : ''}} className='mr-2 cursor-pointer' />
                {isLoading ? '...' : likes?.length === 0 ? '' : likes.length === 1 ? likes.length + ' like' : likes.length + " likes"}
            </span>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                <FontAwesomeIcon icon={faMessage} onClick={() => handleComment(followPost.id)} className='mr-2 cursor-pointer' />Comments
            </span>
            {isSaved ? (
                isSaved.postId === followPost.id && currentUser.id === isSaved.curUser ?
                    <FontAwesomeIcon icon={faBookmark} onClick={handleUnSaved} className='cursor-pointer text-blue-600' />
                : (
                    <FontAwesomeIcon icon={faBookmark} onClick={handleSaved}
                    className={isDark ? 'cursor-pointer text-gray-400' : 'cursor-pointer text-gray-600'} />
                )
            ): (
                <FontAwesomeIcon icon={faBookmark} onClick={handleSaved}
                 className={isDark ? 'cursor-pointer text-gray-400' : 'cursor-pointer text-gray-600'} />
            )}
        </div>
    </div>
  )
}

export default FollowPost
