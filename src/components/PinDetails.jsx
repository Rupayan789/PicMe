import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { client, urlFor } from '../container/client'
import MasonryLayout from './MasonryLayout'
import { fetchUser, pinDetailMorePinQuery, pinDetailQuery } from "../utils/data"
import Spinner from './Spinner'
const PinDetails = () => {
    const [pins, setPins] = useState(null)
    const [pinDetail, setPinDetail] = useState(null)
    const [comment, setComment] = useState('')
    const [addingComment, setAddingComment] = useState(false)
    const { pinId } = useParams()
    const user = fetchUser()
    const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId)
        if (query) {
            client.fetch(query)
                .then((data) => {
                    
                    setPinDetail(data[0])
                
                    if (data[0]) {
                        query = pinDetailMorePinQuery(data[0])
                        client.fetch(query).then(res => setPins(res))
                    }
                })
        }
    }
    const addComment = (e) => {
  

        if (comment) {
            setAddingComment(true)
            client.patch(pinId)
                .setIfMissing({ comments: [] })
                .insert('after', 'comments[-1]', [{
                    comment: comment,
                    _key: uuidv4(),
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.googleId
                    }
                }])
                .commit()
                .then((data) => {
                   
                    fetchPinDetails()
                    setComment('')
                    setAddingComment(false)
                })
                
        }
    }


    useEffect(() => {

        fetchPinDetails()
    }, [pinId])

    if (!pinDetail) return <Spinner message="Loading pin..." />

    return (
        <>
        <div className="flex xl-flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
            <div className="flex justify-center items-center md:items-start md:flex-initial">
                <img src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="user-post"
                    className="rounded-t-3xl rounded-b-lg" />
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <a
                            className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 shadow-lg hover:shadow-xl"
                            href={`${pinDetail.image?.asset?.url}?dl=`}
                            download
                            onClick={(e) => e.stopPropagation()}>
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    <a href={pinDetail.destination} target="_blank" rel="noreferrer" className="shadow-lg hover:shadow-xl px-4 rounded-lg">
                        {pinDetail.destination}
                    </a>
                </div>
                <div>
                    <h1 className="text-4xl font-bold break-words mt-3">
                        {pinDetail.title}
                    </h1>
                    <p className="mt-3">
                        {pinDetail.about}
                    </p>
                </div>
                <Link to={`/user-profile/${pinDetail.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
                    <img src={pinDetail.postedBy?.image} alt="user" className="w-8 h-8 rounded-full object-cover" />
                    <p className="font-semibold captitalize">{pinDetail.postedBy?.userName}</p>
                </Link>
                <h2 className="mt-5 text-2xl">
                    Comments
                </h2>
                <div className="max-h-370 overflow-y-auto">
                    {pinDetail.comments?.map((comment, key) => (
                        <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={key}>
                            <img src={comment.postedBy.image} alt="user-profile" className="w-10 h-10 rounded-full cursor-pointer" />
                            <div className="flex flex-col">
                                <p className="font-bold">{comment.postedBy.userName}</p>
                                <p className="font-base">{comment.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap  mt-6 gap-3">
                    <Link to={`/user-profile/${pinDetail.postedBy._id}`}>
                        <img src={pinDetail.postedBy?.image} alt="user" className="w-10 h-10 rounded-full object-cover" />
                        {/* <p className="font-semibold captitalize">{pinDetail.postedBy?.userName}</p> */}
                    </Link>
                    <input type="text"
                        className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl onfocus:border-gray-300 shadow-md"
                        placeolder="Add a comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)} />
                    <button type="button" className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                        onClick={addComment}>
                        {addingComment ? 'Posting comment ...' : ' Post Comment'}
                    </button>
                </div>
            </div>
        </div>
        {
            pins?.length > 0 ?(
                <>
                <h2 className="text-center font-bold text-2xl mt-8 mb-4">More Like This</h2>
                <MasonryLayout pins={pins}/>
                </>
            ):
            <Spinner message="loading more pins.."/>
        }
        </>

    )
}


export default PinDetails
