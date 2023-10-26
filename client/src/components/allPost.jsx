import React, { useContext, useRef, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBookmark, faHeart, faMessage, faUser} from '@fortawesome/free-solid-svg-icons'
import { MyContext } from './MyContext'
import Axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'

const Post = ({allPost, handleComment}) => {
    const currentUser = JSON.parse(localStorage.getItem('userInfo'))
    const queryClient = useQueryClient()
    const {parStyle, setIsTextOpen, isTextOpen, isDark} = useContext(MyContext)
    const [isSaved, setsIsSaved] = useState(JSON.parse(localStorage.getItem(`isSaved_${allPost.id}`)))

    // to see all the followed user
    const {data} = useQuery({
        queryKey: ['relation'],
        queryFn: () => (
            Axios.get('http://localhost:5001/api/relationship/getRelation', {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then(res => res.data.result)
        )
    })
    const mutation = useMutation({
        mutationFn: (uid) => (
            Axios.post(`http://localhost:5001/api/relationship/addRelation`, {uid: uid}, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
        ),
        onSuccess: () => {
            queryClient.invalidateQueries(["relation"])
        }
    })
    const handleFollow = (uid) => {
        mutation.mutate(uid)
    }
    
    // to see all the likes each posts
    const {data: likes, isLoading} = useQuery({
        queryKey: ['allLikes', allPost.id],
        queryFn: () => (
          Axios.get(`http://localhost:5001/api/likes/getLikes/${allPost.id}`, {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
          }).then(res => res.data.result)
        )
    })
    const likesMutation = useMutation({
        mutationFn: (uid) => {
            if (uid) {
                return Axios.delete(`http://localhost:5001/api/likes/unLike/${allPost.id}`, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                })
            } else {
                return Axios.post(`http://localhost:5001/api/likes/addLike`, {pid: allPost.id}, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["allLikes"])
        }
    })
    const handleLike = () => {
        likesMutation.mutate(likes.includes(currentUser.id))
    }

    // for saved and unsaved post
    const handleSaved = () => {
        Axios.post(`http://localhost:5001/api/savedPosts/addSavedPost`, {pid: allPost.id}, {
          headers: {
            "x-access-token": localStorage.getItem('token')
          }
        }).then(res => {
            console.log(res.data)
            setsIsSaved(localStorage.setItem(`isSaved_${allPost.id}`, JSON.stringify({curUser: currentUser.id, postId: allPost.id})))
        })
    }
    const handleUnSaved = () => {
        Axios.delete(`http://localhost:5001/api/savedPosts/delSavedPost/${allPost.id}`, {
          headers: {
            "x-access-token": localStorage.getItem('token')
          }
        }).then(res => {
            console.log(res.data)
            setsIsSaved(localStorage.removeItem(`isSaved_${allPost.id}`))
        })
    }

  return (
    <div className={isDark ? 'shadow-2xl shadow-gray-600 flex flex-col justify-center w-full rounded-3xl py-3' : 'shadow-2xl flex flex-col justify-center w-full rounded-3xl py-3'}>
        <div>
            <div className='flex justify-between px-4 pb-2'>
                <div className='flex'>
                    {allPost.profile_pic ? (
                        <img src={`http://localhost:5001/images/${allPost.profile_pic}`} style={isDark ? {boxShadow: '1px 2px 4px #fff5'} : null}
                         className='w-8 h-8 rounded-full mr-3' />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className='mr-3 text-9xl w-5 h-4 pt-1 pb-2 px-1 rounded-full text-gray-200 bg-gray-500' />
                    )}
                    <div className='flex flex-col items-start'>
                        <h1 className={isDark ? 'text-white' : ''}>{allPost.firstname} {allPost.lastname}</h1>
                        {!data?.includes(allPost.userId) && allPost.userId !== currentUser.id && (
                            <button className='text-blue-500' onClick={() => handleFollow(allPost.userId)}>Follow</button>
                        )}
                    </div>
                </div>
                <h1 className={isDark ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>{moment(allPost.createdAt).fromNow()}</h1>
            </div>
            <hr />
            <p style={isTextOpen ? null : parStyle} onClick={() => setIsTextOpen(prev => !prev)} 
             className={isDark ? 'cursor-pointer px-2 pt-1 mb-3 text-white' : 'cursor-pointer px-2 pt-1 mb-3'}>
                {allPost.description}
            </p>
            {allPost.image && <img src={`http://localhost:5001/images/${allPost.image}`} className='w-full h-80' />}
        </div>
        <div className='flex justify-between mt-4 px-8'>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                <FontAwesomeIcon icon={faHeart} onClick={handleLike} style={{color: likes?.includes(currentUser.id) ? 'red' : ''}} className='mr-2 cursor-pointer' />
                {isLoading ? '...' : likes?.length === 0 ? '' : likes.length === 1 ? likes.length + ' like' : likes.length + " likes"}
            </span>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                <FontAwesomeIcon icon={faMessage} onClick={() => handleComment(allPost.id)} className='mr-2 cursor-pointer' />Comments
            </span>
            {isSaved ? (
                isSaved.postId === allPost.id && currentUser.id === isSaved.curUser ?
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

export default Post
