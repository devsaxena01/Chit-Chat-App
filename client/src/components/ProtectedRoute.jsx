import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser , getAllUsers } from "./../apiCalls/users"
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { toast } from 'react-hot-toast';
import {setAllChats, setAllUsers, setUser} from '../redux/usersSlice'
import { getAllChats } from "../apiCalls/chat";

function ProtectedRoute({children}){
    const {user} = useSelector(state=> state.userReducer)
    const navigate = useNavigate();
    const dispatch = useDispatch()

const getloggedInUser = async () => {
        let response = null;
        try{
            dispatch(showLoader())
            response = await getLoggedUser();
            dispatch(hideLoader())

            if(response.success){
                dispatch(setUser(response.data));
            }
            // else{ // agar main ie else condition ko lgata hu to login krne ke baad ye mujhe home page pr nhi le jata hai aur agar nhi lgata hu to le jaata hai isme bug hai
            //    toast.error(response.message)         
            //     navigate('/login')
            // }
        }catch(error){
            dispatch(hideLoader())
            navigate('/login');
        }
    }

const getAllUsersFromDb = async () => {
        let response = null;
        try{
            dispatch(showLoader())
            response = await getAllUsers();
            dispatch(hideLoader())

            if(response.success){
                dispatch(setAllUsers(response.data));
            }
            // else{ // agar main ie else condition ko lgata hu to login krne ke baad ye mujhe home page pr nhi le jata hai aur agar nhi lgata hu to le jaata hai isme bug hai
            //    toast.error(response.message)         
            //     navigate('/login')
            // }
        }catch(error){
            dispatch(hideLoader())
            navigate('/login');
        }
    }
    
    const getCurrentUserChats = async () => {
        try{
            const response = await getAllChats();
            if(response.success){
                dispatch(setAllChats(response.data))
            }
        }catch(error){
            navigate('/login');
        }
    }

     useEffect(() => {
        if(localStorage.getItem('token')){
            getloggedInUser();
            getAllUsersFromDb();
            getCurrentUserChats()
        }else{
            navigate('/login');
        }
    } , []);

    return (
        <div>
            {/* <p>Name:{user?.firstname + ' ' + user?.lastname}</p> */}
            { children }
        </div>
    );
}

export default ProtectedRoute;