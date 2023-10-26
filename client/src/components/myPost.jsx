import React, { useContext, useState } from 'react'
import { faBookmark, faHeart, faMessage, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MyContext } from './MyContext'
import moment from 'moment'
import Axios from 'axios'
import Swal from 'sweetalert2'

const MyPost = ({post, handleComment}) => {
    const queryClient = useQueryClient()
    const currentUser = JSON.parse(localStorage.getItem('userInfo'))
    const {setIsTextOpen, isTextOpen, parStyle, isDark} = useContext(MyContext)

    // to get all likes
    const {data: likes, isLoading} = useQuery({
        queryKey: ['myPostLikes', post.id],
        queryFn: () => (
          Axios.get(`http://localhost:5001/api/likes/getLikes/${post.id}`, {
            headers: {
                "x-access-token": localStorage.getItem('token')
            }
          }).then(res => res.data.result)
        )
    })
    const likesMutation = useMutation({
        mutationFn: (uid) => {
            if (uid) {
                return Axios.delete(`http://localhost:5001/api/likes/unLike/${post.id}`, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                })
            } else {
                return Axios.post(`http://localhost:5001/api/likes/addLike`, {pid: post.id}, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["myPostLikes"])
        }
    })
    const handleLike = () => {
        likesMutation.mutate(likes.includes(currentUser.id))
    }
    
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this post',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(res => {
            if (res.isConfirmed) {
                Axios.delete(`http://localhost:5001/api/posts/deletePost/${id}`, {
                    headers: {
                        "x-access-token": localStorage.getItem('token')
                    }
                }).then(res => Swal.fire("Information", res.data.result, 'success'))
            }
        })
    }
  
    return (
        <div className={isDark ? 'shadow-2xl shadow-gray-600 flex flex-col justify-center w-full rounded-3xl py-3' : 'shadow-2xl flex flex-col justify-center w-full rounded-3xl py-3'}>
            <div>
                <div className='flex justify-between px-4 pb-2'>
                    <div className='flex'>
                        {post.profile_pic ? (
                            <img src={`http://localhost:5001/images/${post.profile_pic}`} style={isDark ? {boxShadow: '1px 2px 4px #fff5'} : null}
                             className='w-8 h-8 rounded-full mr-3' />
                        ) : (
                            <FontAwesomeIcon icon={faUser} className='mr-3 text-9xl w-5 h-4 pt-1 pb-2 px-1 rounded-full text-gray-200 bg-gray-500' />
                        )}
                        <h1 className={isDark ? 'text-white' : ''}>{post.firstname} {post.lastname}</h1>
                    </div>
                    <h1  className={isDark ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>{moment(post.createdAt).fromNow()}</h1>
                </div>
                <hr />
                <p style={isTextOpen ? null : parStyle} onClick={() => setIsTextOpen(prev => !prev)} 
                 className={isDark ? 'cursor-pointer px-2 pt-1 mb-3 text-white' : 'cursor-pointer px-2 pt-1 mb-3'}>
                    {post.description}
                </p>
                {post.image && <img src={`http://localhost:5001/images/${post.image}`} className='w-full h-80' />}
            </div>

            <div className='flex justify-between mt-4 px-8'>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    <FontAwesomeIcon icon={faHeart} onClick={handleLike} style={{color: likes?.includes(currentUser.id) ? 'red' : ''}} className='mr-2 cursor-pointer' />
                    {isLoading ? '...' : likes?.length === 0 ? '' : likes.length === 1 ? likes.length + ' like' : likes.length + " likes"}
                </span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    <FontAwesomeIcon icon={faMessage} onClick={() => handleComment(post.id)} className='mr-2 cursor-pointer' />Comments
                </span>
                <FontAwesomeIcon onClick={() => handleDelete(post.id)} icon={faTrash} title="Delete post" 
                 className={isDark ? 'cursor-pointer text-gray-400 hover:text-red-600' : 'cursor-pointer text-gray-600 hover:text-red-600'} />
            </div>
        </div>
    )
}

export default MyPost
