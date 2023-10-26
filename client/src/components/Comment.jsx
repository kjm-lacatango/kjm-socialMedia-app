import React, { useContext, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowLeft, faTrash, faUser} from '@fortawesome/free-solid-svg-icons'
import { MyContext } from './MyContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Axios from 'axios'
import moment from 'moment'
import swal from 'sweetalert2'

const Comment = ({setPostId, pid}) => {
    const {isTextOpen, setIsTextOpen, parStyle, isDark} = useContext(MyContext)
    const [comment, setComment] = useState('')
    const currentUser = JSON.parse(localStorage.getItem('userInfo'))
    const queryClient = useQueryClient()

    const {data: comments, isLoading} = useQuery({
        queryKey: ['comments'],
        queryFn: () => (
            Axios.get(`http://localhost:5001/api/comments/getComments/${pid}`, {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            }).then(res => res.data.result)
        )
    })

    const addMutation = useMutation({
        mutationFn: (comData) => (
            Axios.post(`http://localhost:5001/api/comments/addComment`, comData, {
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            })
        ),
        onSuccess: () => {
            queryClient.invalidateQueries(['comments'])
            setComment('')
        }
    })
    const handleSend = () => {
        if (comment.trim()) {
            addMutation.mutate({pid: pid, desc: comment})
        } else {
            swal.fire('Error', "Doesn't accept empty comment!", 'error')
        }
    }

    const delMutation = useMutation({
        mutationFn: (cid) => (
            Axios.delete(`http://localhost:5001/api/comments/deleteComment/${cid}`, {
                headers: {
                    "x-access-token": localStorage.getItem('token')
                }
            })
        ),
        onSuccess: () => {
            queryClient.invalidateQueries(['comments'])
        }
    })
    const handleDeleteComment = (id) => {
        swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this comment',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(res => {
            if (res.isConfirmed) {
                delMutation.mutate(id)
            }
        })
    }

  return (
    <div className={isDark ? 'shadow-2xl shadow-zinc-600 w-full rounded-3xl h-96 relative' : 'shadow-2xl w-full rounded-3xl h-96 relative'}>
        <div className='bg-gray-50 h-96 overflow-auto overflow-auto rounded-3xl' style={isDark ? {background: 'rgba(72, 72, 72, 60)'} : null}>
            <div className='flex absolute border-b border-gray-400 w-full left-0 bg-white pt-2 rounded-t-3xl' style={isDark ? {background: 'rgba(62, 62, 62, 60)'} : null}>
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => setPostId(false)} className={isDark ? 'cursor-pointer hover:text-blue-500 text-xl text-gray-100 mb-1 ml-4' 
                 : 'cursor-pointer hover:text-blue-500 text-xl text-gray-600 mb-1 ml-4'} />
                <h1 className={isDark ? 'text-gray-300 ml-6 mb-1' : 'text-gray-500 ml-6 mb-1'}>
                    {isLoading ? '...' : comments.length === 0 ? 'No comment' : comments.length === 1 ? comments.length + ' Comment' : comments.length + ' Comments'}
                </h1>
            </div>

            <div  className='mb-12 p-3 mt-10'>
                {isLoading ? <h1><b className={isDark ? 'text-2xl text-white flex justify-center mt-20' : 'text-2xl flex justify-center mt-20'}>. . .</b></h1>  : (
                    comments.length ? comments.map(com => com.userId !== currentUser.id ? (
                        // others comment
                        <div key={com.id} className='flex mb-4'>
                            {com.profile_pic ? (
                                <img src={`http://localhost:5001/images/${com.profile_pic}`} alt='pic' className='w-8 h-8 rounded-full mr-3 shadow' />
                            ) : (
                                <FontAwesomeIcon icon={faUser} className='mr-3 text-9xl w-4 h-4 pt-1 pb-2 px-1.5 rounded-full text-gray-200 bg-gray-500' />
                            )}
                            <div>
                                <div className='flex flex-col w-full bg-white border border-gray-400 px-3 rounded-xl mr-10'
                                 style={isDark ? {background: 'rgba(52, 52, 52, 50)', border: '1px solid #0005'} : null}>
                                    <p onClick={() => setIsTextOpen(prev => !prev)} style={isTextOpen ? null : parStyle}
                                     className={isDark ? 'cursor-pointer text-white' : 'cursor-pointer'}>
                                        {com.comment}
                                    </p>
                                    <div className={isDark ? 'border-t border-gray-500 mt-2 flex px-2 justify-end items-center' : 'border-t border-gray-600 mt-2 flex px-2 justify-end items-center'}>
                                        <h1 className={isDark ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>{moment(com.createdAt).fromNow()}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ): (
                        // current user's comment
                        <div key={com.id} className='flex mb-4 justify-end'>
                            <div className='flex flex-col bg-blue-600 px-3 py-1 rounded-xl ml-10 relative mr-2'>
                                    <p onClick={() => setIsTextOpen(prev => !prev)} style={isTextOpen ? null : parStyle} className='cursor-pointer text-gray-200'>
                                        {com.comment}
                                    </p>
                                
                                <div className='border-t border-gray-300 mt-2 flex px-2 justify-between items-center'>
                                    <h1 className='text-gray-300 text-sm cursor-default'>{moment(com.createdAt).fromNow()}</h1>
                                    <button onClick={() => handleDeleteComment(com.id)} className='text-gray-300 hover:text-red-600 ml-12' title='delete'>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                            {com.profile_pic ? (
                                <img src={`http://localhost:5001/images/${com.profile_pic}`} alt='pic' className='w-8 h-8 rounded-full mr-3 shadow' />
                            ) : (
                                <FontAwesomeIcon icon={faUser} className='mr-3 text-9xl w-4 h-4 pt-1 pb-2 px-1.5 rounded-full text-gray-200 bg-gray-500' />
                            )}
                        </div>
                    )) : (
                        <h1 className={isDark ? 'text-center mt-10 font-semibold text-white' : 'text-center mt-10 font-semibold'}>No comment</h1>
                    )
                )}
            </div>
            
            <div className='flex justify-between p-4 border-t border-gray-500 absolute bottom-0 left-0 w-full bg-white rounded-b-3xl'
             style={isDark ? {background: 'rgba(52, 52, 52, 50)'} : null}>
                <input className='bg-white w-full outline-none mr-3 border-b-2 pl-1' onChange={(e) => setComment(e.target.value)} placeholder='Enter comment'
                 style={isDark ? {background: 'rgba(52, 52, 52, 50)', borderBottom: '2px solid #fff8', color: 'white'} : null} value={comment} />
                <button onClick={handleSend} disabled={addMutation.isPending}
                 className='text-blue-500 px-2 border border-blue-600 rounded-md duration-100 hover:bg-blue-900 hover:text-white'>Send</button>
            </div>  
        </div>
    </div>
  )
}

export default Comment
