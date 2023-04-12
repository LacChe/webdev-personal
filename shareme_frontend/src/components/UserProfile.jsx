import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google'

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import Masonry from 'react-masonry-css';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

const UserProfile = () => {

  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Created') // created | saved
  const [activeButton, setActiveButton] = useState('created')

  const navigate = useNavigate();
  const { userId } = useParams();

  const activeButtonStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
  const notActiveButtonStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query)
    .then((data) => {
      setUser(data[0])
    })
  }, [userId])

  useEffect(() => {
    if(text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinsQuery)
      .then((data) => {
        setPins(data)
      })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery)
      .then((data) => {
        setPins(data)
      })
    }
  }, [text, userId])

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  }

  if(!user) {
    return <Spinner message='Loading Profile' />
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
      className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img src={randomImage} alt='banner' className='w-full h-370 2xl:h-510 shadow-lg object-cover' />
            <img className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
              src={user.image}
              alt='user'
            />
            <h1 className='font-bold text-3xl text-center mt-3'>{user.userName}</h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId === user._id && (
                <div className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'>
                  <button
                    type='button'
                    className=' border-2 p-2 rounded-full cursor-pointer outline-none shadow-md'
                    onClick={() => {
                      googleLogout();
                      logout();
                    }}
                  >
                    <AiOutlineLogout color='red' fontSize={21} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className='text-center mb-7'>
            <button 
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveButton('created')
              }}
              className={`${activeButton === 'created' ? activeButtonStyles : notActiveButtonStyles}`}
            >
              Created
            </button>
            <button 
              type='button'
              onClick={(e) => {
                setText(e.target.textContent)
                setActiveButton('saved')
              }}
              className={`${activeButton === 'saved' ? activeButtonStyles : notActiveButtonStyles}`}
            >
              Saved
            </button>
          </div>
          {pins?.length ? (
            <div className='px-2'>
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Pins Found
            </div>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default UserProfile