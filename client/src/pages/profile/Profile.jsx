import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadProfilePic } from '../../apiCalls/users';
import { hideLoader, showLoader } from '../../redux/loaderSlice';
import toast from 'react-hot-toast';
import { setUser } from '../../redux/usersSlice';

const Profile = () => {
    const {user} = useSelector(state => state.userReducer)
    const [image , setImage] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        if(user?.profilePic){
            setImage(user.profilePic)
        }
    } , [user])

     function getInitials(){
        let f = user?.firstname.toUpperCase()[0];
        let l = user?.lastname.toUpperCase()[0];
        return f + l;
    }

    function getFullname(){
        let fname = user?.firstname.at(0).toUpperCase() + user?.firstname.slice(1).toLowerCase();
        let lname = user?.lastname.at(0).toUpperCase() + user?.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }

    const onFileSelect = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader(file);

        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            setImage(reader.result);
        }
    }

    const updateProfilePic = async () => {
        
        try{
            dispatch(showLoader());
            const response = await uploadProfilePic(image);
            dispatch(hideLoader());

            if(response.success){
                toast.success(response.message);
                dispatch(setUser(response.data));
            }else{
                toast.error(response.message);
            }
        }catch(err){
            toast.error(err.message);
            dispatch(hideLoader());
        }
    }
    
  return (
    <div className="profile-page-container flex w-4/5 text-[#28282B] mx-auto my-[100px] p-5 rounded-lg shadow-md shadow-black/30">
        <div className="profile-pic-container w-1/3 flex justify-center">
             {image && <img src={image} 
                 alt="Profile Pic" 
                 className="user-profile-pic-upload w-[240px] h-[240px] rounded-full border-[5px] border-[#ddd] text-[#28282B] text-[120px] font-bold flex items-center justify-center" 
            />}
            {!image && <div className="user-default-profile-avatar w-[240px] h-[240px] rounded-full border-[5px] border-[#ddd] text-[#28282B] text-[120px] font-bold flex items-center justify-center">
                {getInitials()}
            </div>}
        </div>

        <div className="profile-info-container w-2/3 p-8">
            <div className="user-profile-name pb-2 mb-8 border-b border-[#cdcdcd]">
                <h1>{getFullname()}</h1>
            </div>
            <div className="mb-2">
                <b>Email: </b>{user?.email}
            </div>
            <div className="mb-2">
                <b>Account Created: </b>{moment(user?.createdAt).format('MMM DD, YYYY')}
            </div>
            <div className="select-profile-pic-container pt-8">
                <input type="file"
                onChange={onFileSelect}
                className="file:rounded-md file:px-4 file:h-10 file:cursor-pointer file:bg-[#28282B] file:text-white file:border file:border-black/20 file:shadow-sm file:mr-4 file:transition-colors
                   file:hover:bg-gray-100 file:hover:text-[#28282B]
                   file:active:bg-gray-200 file:active:text-[#28282B]"
                />
                <button className='upload-image-btn'
                onClick={updateProfilePic}
                >Upload</button>
            </div>
        </div>
    </div>
  )
}

export default Profile