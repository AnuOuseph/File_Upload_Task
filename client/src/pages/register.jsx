/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/userSlice';

function Register() {

  const history = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history("/");
    }
  }, [history]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()
  const {loading,error} = useSelector((state)=>state.user)

  async function submit(e) {
    e.preventDefault();
    dispatch(registerUser({username,password})).then((result)=>{
      if(result.payload){
        history("/", { state: { id: username } });
      }else{
        alert(error)
      }
     })
    }


  return (
    <div className="bg-white h-screen w-full flex justify-center items-center">
        <div className="border border-gray-500 p-5">
            <p className="text-2xl font-medium py-2 mx-5">Register</p>
            <p className="text-sm text-gray-700 py-1 mx-5">Please create a new account</p>
            <div className="my-2 mx-5">
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="px-4 py-1 border border-gray-500" type="text" placeholder="username" />
            </div>
            <div className="my-3 mx-5">
                <input value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-1 border border-gray-500" type="password" placeholder="password" />
            </div>
            <div className="my-3 mx-5">
                <button onClick={submit} className="px-2 border border-gray-500 bg-black text-white py-1 text-sm">Create</button>
            </div>
            <p className="my-2 mx-5 text-sm">Already a user? <span className="text-blue-500 text-md"><Link to="/login">Login</Link></span></p>
        </div>
    </div>
  )
}

export default Register
