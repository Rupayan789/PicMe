import React, { useState, useEffect } from 'react'
import MasonryLayout from './MasonryLayout'
import { client } from '../container/client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'
const Search = ({ searchTerm, setSearchTerm }) => {
    const [pins, setPins] = useState(null)
    const [loading, setLoading] = useState(false)


    useEffect(()=>{
        if(searchTerm.length > 0) {
            setLoading(true)
            const query = searchQuery(searchTerm.toLowerCase())
            
            client.fetch(query).then(data => {
                
                setPins(data)
                setLoading(false)
            })
            .catch(err => { setLoading(false);})
        }
        else {
            setLoading(true)
            const query = feedQuery
            client.fetch(query).then(data => {
                setPins(data)
                setLoading(false)
            })
            .catch(err => { setLoading(false);})
        }
    },[searchTerm])
    return (
        <div>
            {    loading && <Spinner message="Searching for pins" /> }
            {    pins?.length !== 0 && <MasonryLayout  pins={pins} /> }
            {    pins?.length === 0 && searchTerm !== '' && !loading && (<div className="mt-10 text-center text-xl">No Pins Found</div>)}
        </div>
    )
}

export default Search
