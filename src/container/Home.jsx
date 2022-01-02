import React, { useEffect, useRef, useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar, UserProfile } from '../components'
import { client } from './client'
import logo from "../assets/logo.jpeg"
import Pins from './Pins'
import { fetchUser, userQuery } from '../utils/data'
const Home = () => {
    const [toggleSidebar, setToggleSidebar] = useState(false)
    const [user, setUser] = useState(null)
    const scrollRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

  

    const userInfo = fetchUser()
    useEffect(() => {

        if (!userInfo) {
            navigate("/login")
            return () => {
                console.log("UseEffect finished")
            }
        }
        else {
            const query = userQuery(userInfo?.googleId)

            client.fetch(query)
                .then(data => {
                    setUser(data[0])
                })
        }

    }, [])

    useEffect(() => {
        if(userInfo)
        scrollRef.current.scrollTo(0, 0)
    }, [])
    if(userInfo)
    return (
        <div className="flex bg-homeOverlay md:flex-row flex-col h-screen transition-height duration-75 ease-out">
            <div className="hidden md:flex h-screen overflow-y-auto flex-initial">
                <Sidebar user={user && user} />
            </div>
            <div className="flex md:hidden flex-row">
                <div className="flex flex-row justify-between items-center p-2 w-full shadow-md">
                    <HiMenu fontSize={40} className="cursor-pointer"
                        onClick={() => setToggleSidebar(true)} />
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-28" />
                    </Link>
                    <Link to={`user-profile/${user?._id}`}>
                        <img src={user?.image} alt="logo" className="w-28" />
                    </Link>
                </div>
                {
                    toggleSidebar && (
                        <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                            <div className="absolute w-full flex justify-end items-center p-2">
                                <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
                            </div>
                            <Sidebar user={user && user} closeToggle={setToggleSidebar} />

                        </div>
                    )
                }
            </div>
            <div className="pb-2 flex-1 h-full overflow-y-auto hide-scrollbar" ref={scrollRef}>
                <Routes>
                    <Route path="user-profile/:userId" element={<UserProfile user={user && user} />} />
                    <Route path="/*" element={<Pins user={user && user} />} />
                </Routes>
            </div>
        </div>

    )
    else
    return <></>
}

export default Home
