import React, { useContext, useState } from 'react'
import AllPost from './allPost'
import FollowPost from './followPost'
import Comment from '../components/Comment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import {useQuery} from '@tanstack/react-query'
import Axios from 'axios'
import { MyContext } from './MyContext'

const AllAndFollowing = () => {
    const [isAllClick, setIsAllClick] = useState(true)
    const [search, setSearch] = useState('')
    const [postId, setPostId] = useState(null)
    const {isDark} = useContext(MyContext)
    const style = {
      color: 'blue',
      fontSize: '25px'
    }

    // getting all posts
    const {data: allPostData, isLoading: allLoading} = useQuery({
      queryKey: ["allPosts"],
      enabled: isAllClick,
      queryFn: () => (
        Axios.get('http://localhost:5001/api/posts/getPosts', {
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
        }).then(res => res.data.result)
      )
    })

    // getting followed post
    const {data: allFollowData, isLoading: followLoading} = useQuery({
      queryKey: ['followedPost'],
      enabled: !isAllClick,
      queryFn: () => (
        Axios.get('http://localhost:5001/api/posts/getFollowedPosts', {
          headers: {
            "x-access-token": localStorage.getItem('token')
          }
        }).then(res => res.data.result)
      )
    })

    const handleComment = (id) => {
      setPostId(id)
    }

  return (
    <div style={isDark? {background: 'rgba(52, 52, 52, 50)'} : null}>
      {/* search */}
      <div className='backdrop-blur-sm fixed flex justify-center py-3 md:w-2/3 w-full px-4 z-20'>
        <button className='text-xl text-gray-500 mr-10 duration-200 hover:text-blue-700'
         style={isAllClick ? style : null} onClick={() => setIsAllClick(true)}>All</button>
        <button className='text-xl text-gray-500 mr-10 duration-200 hover:text-blue-700'
         style={isAllClick ? null : style} onClick={() => setIsAllClick(false)}>Following</button>
        <div className='flex items-center border-2 border-gray-300 rounded-3xl px-3 w-72'>
          <input placeholder='Search Name...' onChange={(e) => setSearch(e.target.value)} style={isDark ? {color: 'white'} : null}
           value={search} className='mx-2 outline-none w-full bg-transparent' required />
          <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-500 border-l-2 border-gray-300 pl-2 cursor-default'
           style={isDark ? {color: 'lightgray'} : null} />
        </div>
      </div>
        {/* posts */}
      <div className='pt-20 pb-10 flex flex-col items-center gap-12 px-10 lg:px-40 md:px-20 sm:px-28'
       style={isDark ? {background: 'rgba(52, 52, 52, 50)'} : null}>
        {isAllClick ? (
          allLoading ? <h1 className={isDark ? 'text-white text-2xl mt-40' : 'text-black text-2xl mt-40'}><b>Loading . . .</b></h1> : (
            allPostData.filter(p => (
              (search.toLowerCase() === '') ? p : (p.firstname.toLowerCase().includes(search) || p.lastname.toLowerCase().includes(search))
            )).map(post => post.id === postId ? (
              <Comment key={post.id} setPostId={setPostId} pid={post.id} />
            ) : (
              <AllPost key={post.id} allPost={post} handleComment={handleComment} />
            ))
          )
        ) : (
          followLoading ? <h1 className={isDark ? 'text-white text-2xl mt-40' : 'text-black text-2xl mt-40'}><b>Loading . . .</b></h1> : (
            allFollowData.length > 0 ? (
              allFollowData.filter(p => (
                (search.toLowerCase() === '') ? p : (p.firstname.toLowerCase().includes(search) || p.lastname.toLowerCase().includes(search))
              )).map(post => post.id === postId ? (
                  <Comment key={post.id} setPostId={setPostId} pid={post.id} />
                ) : (
                  <FollowPost key={post.id} followPost={post} handleComment={handleComment} />
                )
              )
            ) : (
              <h1 className={isDark ? 'text-2xl text-white mt-40' : 'text-2xl text-black mt-40'}><b>You have no following</b></h1>
            )
          )
        )}
      </div>
    </div>
  )
}

export default AllAndFollowing
