import React  ,{  useState , useEffect } from 'react'
import { useParams } from 'react-router-dom'
import NotFound from "../assets/notfound.png"
import { client } from '../container/client'
import { feedQuery, searchQuery } from '../utils/data'
import MasonryLayout from "./MasonryLayout"
import Spinner from "./Spinner.jsx"
const Feed = () => {
    const [loading, setLoading] = useState(false)
    const [pins, setPins] = useState(null)
    const { categoryId } =useParams()
    useEffect(()=>{
        setLoading(true)
        if(categoryId) {
            const query = searchQuery(categoryId)
            client.fetch(query)
            .then((data => {
                setPins(data)
                setLoading(false)
            }))
            .catch(err => console.log(err.message))
        } else {
            client.fetch(feedQuery)
            .then(data => {
                setPins(data)
                setLoading(false)
            })
        }
    },[categoryId])
    if(loading) return <Spinner message="We are adding new ideas to your feed"/>
    if(!pins?.length) return (<div className="flex flex-col justify-center items-center">
        <img src={NotFound} alt="not-found" className="my-5 " style={{width:'100px',height:'100px'}} />
        <p className="text-xl text-black ">No Pins Found</p>
    </div>)
    return (
        <div>
            { pins  && <MasonryLayout pins={pins}/>}
        </div>
    )
}

export default Feed
