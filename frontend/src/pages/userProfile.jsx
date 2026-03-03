import axios from 'axios';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logout } from "../redux/userSlice";



export const UserProfile = ()=>{

    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(true);
    const [image, setImage] = useState('');
    const {username,id,email,token} = useSelector((state)=>state.user);
    const [file,setFile] = useState(null);
    const dispatch = useDispatch();

    useEffect(()=>{
        const getUser = async()=>{
            try {
                
                const response = await axios.get(`https://localhost:3000/admin/user/${id}`,{
                    Headers:{
                        Authorization: `Bearer ${token}`
                    },
                });

                setImage(response.data.user.profileImage);

            } catch (error) {
                console.log('failed to fetch users => ',error);
                if(error.response.data==403){
                    dispatch(logout());
                }
                alert('failed to fetch user details');
                
            }
        };

        getUser();
    },[id, refresh]);

    const handleUpload = async(e)=> {
        e.preventDefault();
        if(!file){
            alert('Select a file');
            return;
        }
        try {
            const formData = new formData();
            formData.append('image',file);
            await axios.post(
                `http://localhost:3000/profile/upload/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Profile updated');
            setRefresh(!refresh);
        } catch (error) {
            console.log('Upload failed',error);
            if(error.response?.status == 403){
                dispatch(logout());
                navigate('/login');
            }
            alert('Upload failed');
        }

    }



   
  return (
    <>
      <form
        onSubmit={handleUpload}
        className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Upload Profile Picture</h2>

        <div className="text-gray-700">
          <p><span className="font-semibold">Username:</span> {username}</p>
          <p><span className="font-semibold">Email:</span> {email}</p>
        </div>

      
        {image && (
          <div className="flex justify-center">
            <img
              src={`http://localhost:3000/uploads/${image}`}
              alt='image'
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium text-gray-700">Choose a profile picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300"
        >
          Upload Profile
        </button>
      </form>
    </>
  );
};
