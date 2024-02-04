/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userSlice';


function Login() {

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
    dispatch(loginUser({username,password})).then((result)=>{
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
        <p className="text-2xl font-medium py-2 mx-5">Login</p>
        <p className="text-sm text-gray-700 py-1 mx-5">Please enter your credentials to Login</p>
        <div className="my-2 mx-5">
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="px-4 py-1 border border-gray-500" type="text" placeholder="username" />
        </div>
        <div className="my-3 mx-5">
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-1 border border-gray-500" type="password" placeholder="password" />
        </div>
        <div className="my-3 mx-5">
            <button onClick={submit} className="px-2 py-1 text-sm border border-gray-500 bg-black text-white">Login</button>
        </div>
        <p className="my-2 mx-5 text-sm">Create new account? <span className="text-blue-500 text-md"><Link to="/register">Register</Link></span></p>
      </div>
    </div>
  )
}

export default Login
