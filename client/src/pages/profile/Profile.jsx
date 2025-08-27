import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadProfilePic } from '../../apiCalls/users';
import { hideLoader, showLoader } from '../../redux/loaderSlice';
import toast from 'react-hot-toast';
import { setUser } from '../../redux/usersSlice';
import { Upload } from "lucide-react"; // icon

const Profile = () => {
  const { user } = useSelector(state => state.userReducer)
  const [image, setImage] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic)
    }
  }, [user])

  function getInitials() {
    let f = user?.firstname?.toUpperCase()[0] || "";
    let l = user?.lastname?.toUpperCase()[0] || "";
    return f + l;
  }

  function getFullname() {
    if (!user) return "";
    let fname = user?.firstname?.at(0).toUpperCase() + user?.firstname?.slice(1).toLowerCase();
    let lname = user?.lastname?.at(0).toUpperCase() + user?.lastname?.slice(1).toLowerCase();
    return fname + ' ' + lname;
  }

  const onFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setImage(reader.result);
    }
  }

  const updateProfilePic = async () => {
    try {
      dispatch(showLoader());
      const response = await uploadProfilePic(image);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        dispatch(setUser(response.data));
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      dispatch(hideLoader());
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 transition-colors">
        
        {/* Profile Picture */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          {image ? (
            <img
              src={image}
              alt="Profile Pic"
              className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-gray-300 dark:border-gray-700 shadow-md object-cover"
            />
          ) : (
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-6xl font-bold flex items-center justify-center bg-gray-100 dark:bg-gray-800 shadow-md">
              {getInitials()}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2 mb-6">
            {getFullname()}
          </h1>

          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p><b>Email :</b> {user?.email}</p>
            <p><b>Account Created :</b> {moment(user?.createdAt).format('MMM DD, YYYY')}</p>
          </div>

          {/* Upload Section */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <input
              type="file"
              onChange={onFileSelect}
              className="file:rounded-md file:px-4 file:h-10 file:cursor-pointer file:bg-gradient-to-r file:from-indigo-600 file:to-purple-600 file:text-white file:border file:border-black/20 file:shadow-sm file:mr-4 file:transition-colors file:hover:bg-gray-100 file:hover:text-[#28282B] file:active:bg-gray-200 file:active:text-[#28282B]"
            />
            <button
              onClick={updateProfilePic}
              className="w-full sm:w-auto px-5 py-2 rounded-lg 
               bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 
               text-white font-medium shadow-md shadow-black/30 
               hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 
               transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
            >
              <Upload size={18} /> Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;