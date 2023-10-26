import { createContext, useEffect, useState } from "react"
import Axios from 'axios'
import Swal from "sweetalert2"

export const MyContext = createContext()

export const MyContextProvider = (props) => {
    // THIS IS FOR USER AUTH FROM MAIN PAGE
    const [userLog, setUserLog] = useState({username: '', password: ''})
    const [userReg, setUserReg] = useState({fname: '', lname: '', username: '', password: '', confirmPass: ''})
    const [isLog, setIsLog] = useState(false)
    const [isReg, setIsReg] = useState(false)
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || null)
    const [isLogged, setIsLogged] = useState(false)
    // THIS IS FROM DASHBOARD PAGE
    const [isShow, setIsShow] = useState(true)
    const [isAllAndFollowing, setIsAllAndFollowing] = useState(true)
    const [isCatCreatePost, setIsCatCreatePost] = useState(false)
    const [isCatManageProfile, setIsCatManageProfile] = useState(false)
    const [isCatMyPost, setIsCatMyPost] = useState(false)
    const [isCatSaved, setIsCatSaved] = useState(false)
        // all and following
    const [isSave, setIsSave] = useState(false)
    const [isComment, setIsComment] = useState(false)
    const [isTextOpen, setIsTextOpen] = useState(false)
        // for dark mode
    const [isDark, setIsDark] = useState(false)


    // THIS IS FOR MAIN PAGE AUTH
    const isRegister = () => {
        setIsReg(true)
        setIsLog(false)
        setUserLog({username: '', password: ''})
    }
    const isLogin = () => {
        setIsReg(false)
        setIsLog(true)
        setUserReg({fname: '', lname: '', usename: '', password: '', confirmPass: ''})
    }
    const handleCancel = () => {
        setIsLog(false)
        setIsReg(false)
        setUserLog({username: '', password: ''})
        setUserReg({fname: '', lname: '', usename: '', password: '', confirmPass: ''})
    }
    const handleRegister = () => {
        if (userReg.password === userReg.confirmPass) {
            Axios.post('http://localhost:5001/api/auth/register', {
                fname: userReg.fname, lname: userReg.lname, username: userReg.username, password: userReg.password
            }).then((res) => {
                if (res.data.error) {
                    Swal.fire('Error', res.data.error, 'error')
                } else {
                    setUserInfo(res.data.result)
                    alert(res.data.message)
                    localStorage.setItem("token", res.data.token)
                    setUserReg({fname: '', lname: '', username: '', password: '', confirmPass: ''})
                    setIsLogged(true)
                }
            }).catch(err => console.log(err))
        } else {
            Swal.fire('Error', 'Password not match!', 'error')
        }
    }
    const handleLogin = () => {
        Axios.post('http://localhost:5001/api/auth/login', {username: userLog.username, password: userLog.password})
        .then(res => {
            if (res.data.error) {
                Swal.fire('Error', res.data.error, 'error')
            } else {
                setUserInfo(res.data.result)
                localStorage.setItem("token", res.data.token)
                setUserLog({username: '', password: ''})
                setIsLogged(true)
            }  
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo))
    }, [userInfo])

    // THIS IS FOR DASHBOARD PAGE 
    const createPost = () => {
        setIsAllAndFollowing(false)
        setIsCatSaved(false)
        setIsCatMyPost(false)
        setIsCatManageProfile(false)
        setIsCatCreatePost(true)
    }
    const manageProfile = () => {
        setIsAllAndFollowing(false)
        setIsCatSaved(false)
        setIsCatMyPost(false)
        setIsCatCreatePost(false)
        setIsCatManageProfile(true)
    }
    const myPost = () => {
        setIsAllAndFollowing(false)
        setIsCatSaved(false)
        setIsCatManageProfile(false)
        setIsCatCreatePost(false)
        setIsCatMyPost(true)
    }
    const saved = () => {
        setIsAllAndFollowing(false)
        setIsCatMyPost(false)
        setIsCatManageProfile(false)
        setIsCatCreatePost(false)
        setIsCatSaved(true)
    }
    const handleBack = () => {
        setIsAllAndFollowing(true)
        setIsCatSaved(false)
        setIsCatMyPost(false)
        setIsCatManageProfile(false)
        setIsCatCreatePost(false)
    }
    const dropCreatePost = () => {
        setIsAllAndFollowing(false)
        setIsCatSaved(false)
        setIsCatMyPost(false)
        setIsCatManageProfile(false)
        setIsCatCreatePost(true)
        setIsShow(true)
    }
    const dropManageProfile = () => {
        setIsAllAndFollowing(false)
        setIsCatSaved(false)
        setIsCatMyPost(false)
        setIsCatCreatePost(false)
        setIsCatManageProfile(true)
        setIsShow(true)
    }
    const dropMyPost = () => {
        setIsAllAndFollowing(false)
        setIsCatSaved(false)
        setIsCatManageProfile(false)
        setIsCatCreatePost(false)
        setIsCatMyPost(true)
        setIsShow(true)
    }
    const dropSaved = () => {
        setIsAllAndFollowing(false)
        setIsCatMyPost(false)
        setIsCatManageProfile(false)
        setIsCatCreatePost(false)
        setIsCatSaved(true)
        setIsShow(true)
    }
        // from description post
    const parStyle = {
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        display: '-webkit-box'
    }
        // for dark mode
    const handleDark = () => {
        setIsDark(prev => !prev)
    }

  return (
    <MyContext.Provider value={{
        // THIS IS FOR USER AUTH
        userLog, setUserLog, isLog, isReg, isRegister, isLogin, userReg, setUserReg, handleCancel, userInfo, setUserInfo, setIsLogged, isLogged,
        handleLogin, handleRegister,
        // THIS IS FOR DASHBOARD
        isAllAndFollowing, isCatCreatePost, isCatManageProfile, isCatMyPost, isCatSaved, createPost, manageProfile, myPost, saved,
        isShow, setIsShow, dropCreatePost, dropManageProfile, dropMyPost, dropSaved, handleBack, setIsAllAndFollowing, setIsCatCreatePost,
        setIsCatManageProfile, setIsCatMyPost, setIsCatSaved, setIsAllAndFollowing,
            // from post
        parStyle, isSave, isComment, setIsComment, isTextOpen, setIsTextOpen,
        // FOR DARK MODE
        isDark, handleDark
    }}>
        {props.children}
    </MyContext.Provider>
  )
}
