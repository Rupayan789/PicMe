import React from 'react'
import { useState } from 'react'
import { Routes , Route } from 'react-router-dom'
import { Navbar , Feed , CreatePin , PinDetails , Search  } from "../components"
const Pins = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('')
    return (
        <div className="px-2 md:px-5">
            <div className="bg-gray-50 rounded-lg shadow-lg">
                <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>
            </div>
            <div className="h-full">
                <Routes>
                    <Route path="/" element={<Feed/>}/>
                    <Route path="/category/:categoryId" element={<Feed/>}/>
                    <Route path="/pin-detail/:pinId" element={<PinDetails user={user}/>}/>
                    <Route path="/create-pin" element={<CreatePin user={user}/>}/>
                    <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user}/>}/>
                </Routes>
            </div>
        </div>
    )
}

export default Pins
