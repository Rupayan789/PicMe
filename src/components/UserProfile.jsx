import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from "react-icons/ai"
import { useParams, useNavigate } from "react-router-dom"
import { GoogleLogout } from "react-google-login"
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/data"
import { client } from "../container/client"
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import NotFound from "../assets/notfound.png"

const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,technology"

const UserProfile = () => {
    const [user, setUser] = useState(null)
    const [pins, setPins] = useState(null)
    const [text, setText] = useState('Created')
    const [activeBtn, setActiveBtn] = useState('created')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { userId } = useParams();
    const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none'
    const notActiveBtnStyles = 'bg-primary  text-black font-bold p-2 rounded-full w-20 outline-none'

    useEffect(() => {
        const query = userQuery(userId)
        client.fetch(query)
            .then(data => {
                setUser(data[0])

            })
    }, [userId])

    useEffect(() => {
        setLoading(true)
        if (text === 'Created') {
            const createdPinsQuery = userCreatedPinsQuery(userId)
            client.fetch(createdPinsQuery)
                .then(data => {
                    setPins(data)
                    setLoading(false)
                })
        }
        else {
            const savedPinsQuery = userSavedPinsQuery(userId)
            client.fetch(savedPinsQuery)
                .then(data => {
                    setPins(data)
                    setLoading(false)
                })
        }
    }, [text, userId])

    const logoutFunc = () => {
        localStorage.clear()
        navigate("/login")
    }

    if (!user) return (<Spinner message="loading profile..." />)

    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col justify-center items-center">
                        <img src={randomImage} alt="banner-pic" className="w-full h-370 2xl:h-510 object-cover" />
                        <img src={user.image} className="rounded-full w-28 h-28 -mt-12 shadow-xl object-cover" alt="user-pic" />
                        <h1 className="font-bold text-3xl text-center m-3">{user.userName}</h1>
                        <div className="fixed top-2 z-1 right-2 p-2 z-10">
                            {userId === user._id &&
                                <GoogleLogout
                                    clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                                    render={(renderProps) => (
                                        <button
                                            type="button"
                                            className="bg-white p-2 flex justify-between items-center rounded-full cursor-pointer outline-none shadow-md"
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                        >
                                            <AiOutlineLogout color="red" fontSize={21} className="m-1" />
                                        </button>
                                    )}
                                    onLogoutSuccess={logoutFunc}
                                    cookiePolicy={"single_host_origin"}
                                />
                            }

                        </div>
                    </div>
                    <div className="text-center mb-7">
                        <button type="button" className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                            onClick={e => {
                                setText(e.target.textContent)
                                setActiveBtn('created')
                            }}>
                            Created
                        </button>
                        <button type="button" className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                            onClick={e => {
                                setText(e.target.textContent)
                                setActiveBtn('saved')
                            }}>
                            Saved
                        </button>
                    </div>

                    {
                        loading ?
                            <Spinner message="Loading Pins ..." />
                            :
                            pins?.length ? <div className="px-2"> <MasonryLayout pins={pins} /> </div> :
                                <div className="flex flex-col justify-center items-center">
                                    <img src={NotFound} alt="not-found" className="my-5 " style={{ width: '100px', height: '100px' }} />
                                    <p className="text-xl text-black ">No Pins Found</p>
                                </div>
                    }


                </div>
            </div>
        </div>
    )
}

export default UserProfile
