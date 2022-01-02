import React from 'react'
import { Link, NavLink ,useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'
import { AiOutlineLogout } from 'react-icons/ai'
import { RiHomeFill } from "react-icons/ri"
import logo from "../assets/logo.jpeg"
import { categories } from '../utils/data'
const Sidebar = ({ user, closeToggle }) => {
    const navigate = useNavigate()
    const handleCloseSidebar = () => {
        if (closeToggle) closeToggle(false)
    }
    const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black text-gray hover:text-black transition-all ease-in-out captitalize'
    const isNotActiveStyle = 'flex items-center px-5 gap-3  text-gray transition-all ease-in-out captitalize'
    const logoutFunc = () => {
        localStorage.clear()
        navigate("/login")
    }
    return (
        <div className="flex flex-col justify-between bg-white h-full overflow-y-auto  min-w-210 hide-scrollbar">
            <div className="flex flex-col relative">
                <Link
                    to="/"
                    className="flex px-5 gap-3 my-6 pt-1 w-190 items-center"
                    onClick={handleCloseSidebar}
                >
                    <img src={logo} alt="logo" className="w-full" />
                </Link>
                <div className="flex flex-col gap-5">
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill fontSize={16}/>
                        Home
                    </NavLink>
                    <h3 className="mt-2 px-5 text-base 2xl:text-xl ">Discover Categories</h3>
                    {
                        categories.slice(0, categories.length - 1).map((category) => (
                            <NavLink
                                to={`/category/${category.name}`}
                                key={category.name}
                                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                                onClick={handleCloseSidebar}
                            >
                                <img src={category.image} alt="category" className="w-8 h-8 rounded-full shadow-sm"/>
                                {category.name}
                            </NavLink>
                        ))
                    }
                </div>

            </div>
            {
                user && (
                    // <Link 
                    // to={`/user-profile/${user._id}`}
                    // className="flex bg-secondaryOverlay fixed my-5 mb-3 gap-3 p-2 rounded-md shadow-lg mx-3 items-center"
                    // onClick={handleCloseSidebar}
                    // >
                    //     <img src={user.image} alt="user-profile-image" className="w-10 h-10 rounded-full"/>
                    //     <p>{user.userName}</p>
                    // </Link>
                    <GoogleLogout
                    clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                    render={(renderProps)=>(
                      <div className="flex justify-center items-center bg-secondaryOverlay hover:bg-iconColorLight transition-all ease-in-out duration-150 pt-2 shadow-lg sticky w-full left-0 bottom-0">

                          <button
                            type="button"
                            className="p-2 flex justify-between items-center cursor-pointer outline-none shadow-md"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            >
                            <span className="text-xl text-dark mr-4">Logout</span>
                            <AiOutlineLogout color="red" fontSize={21} className="m-1"/>
                          </button>
                      </div>
                      
                    )}
                    onLogoutSuccess={logoutFunc}
                    cookiePolicy={"single_host_origin"}
                  />
                )
            }
        </div>
    )
}

export default Sidebar
