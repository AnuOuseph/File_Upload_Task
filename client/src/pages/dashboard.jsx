/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Instance } from '../App';
import { useDispatch } from 'react-redux';
import { setRefetch } from '../redux/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan,faSignOutAlt, faArrowDown, } from '@fortawesome/free-solid-svg-icons'


function Dashboard() {
    const {user} = useSelector((state)=>state.user)
    const { actions } = useSelector((store) => store.user)
    const [file, setFile] = useState(null)
    const [files, setFiles] = useState([]);
    const [mess, setMess] = useState(null)
    const [err, setErr] =useState("")
    const dispatch = useDispatch()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDownloadModal, setDownloadModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null);
    const [ code, setCode] = useState("")

    useEffect(() => {
        const fetchData = async () => {
          try {
            const request = await Instance.get(`/file/${user?.data?._id}`);
            setFiles(request?.data?.files)
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, [user?.data?._id, actions]);

      const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        };
        
      const handleUpload = async () => {
        try {
            if(file){
                const response = await Instance.post("/file/upload", {file: file?.name, id: user?.data?._id})
                setMess("")
                setFile(null)
                toast.success("Successfully Uploaded");
                dispatch(setRefetch())
            }else{
                setMess("File not selected!")
            }

        } catch (error) {
          console.error('Error during upload:', error);
        }
      };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedItem(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async (file) => {
        try {
            const res = await Instance.delete(`/file/${user?.data?._id}/${file}`);
            setShowDeleteModal(false);
            toast.success("Successfully deleted");
            dispatch(setRefetch())
            setSelectedItem(null);
        } catch (err) {
            console.log(err)
        }
    };

    const openDownloadModal = (item) => {
        setSelectedItem(item);
        setDownloadModal(true);
    };

    const closeDownloadModal = () => {
        setSelectedItem(null);
        setDownloadModal(false);
        setErr("")
    };

    const handleDownload = async (file) => {
        console.log(file)
        try {
            const response = await Instance.get(`/file/download/${user?.data?._id}/${code}/${file}`, {
                responseType: 'arraybuffer', 
              });
            console.log(response)
            setCode("")
            setDownloadModal(false);
            setSelectedItem(null);
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file;  
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setErr("Invalid unique code. Access denied.")
              } else {
                console.error('Error downloading file:', error);
              }
        }
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
      };

  return (
    <div className="bg-white h-screen w-full flex justify-center items-center">
         <ToastContainer />
        <div className="bg-white mx-2 my-8 py-0 w-[50%]"> 
            <div className="flex justify-between">
                <div>
                  <p className="text-md uppercase text-gray-700 font-medium px-4 py-4">Files</p>
                </div>
                <div className='flex items-center'>
                    <p className="text-md uppercase text-gray-700 font-medium px-4 py-4">{user?.data?.username}</p>
                    <button onClick={handleLogout} className='px-1'> <FontAwesomeIcon icon={faSignOutAlt} size="sm" className='px-1' /></button>
                </div>
            </div>
            <hr className='my-2' />
            <div className="px-2 py-2 ">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                            File
                            </th>
                            <th scope="col" className="px-6 py-3">
                            delete
                            </th>
                            <th scope="col" className="px-6 py-3">
                            download
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {files?.map((item)=>(      
                                <tr key={item} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">{item}</td>
                                    <td className="px-6 py-4"> <button onClick={() => openDeleteModal(item)} className='px-1'><FontAwesomeIcon icon={faTrashCan} size="sm" className='px-1' color='red' /></button></td>
                                    <td className="px-6 py-4"> <button onClick={() => openDownloadModal(item)} className='px-1'><FontAwesomeIcon icon={faArrowDown} size="sm" className='px-1' color='blue' /></button></td>
                                    
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='flex justify-center my-4 mx-2 py-2 border'>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload} className='px-2 border border-gray-500 '>Upload</button>
            </div>
            {
                mess && <p className='flex justify-center text-red-400'>{mess}</p>
            }
        </div>
        {showDeleteModal && (
            <div className="modal-overlay fixed w-full h-screen top-0 left-0 right-0 bottom-0 flex justify-center items-center" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
                <div className="modal-content bg-white w-[40%] shadow-md rounded">
                    <span className="close px-5 py-5 text-xl font-bold cursor-pointer" onClick={closeDeleteModal}>
                        &times;
                    </span>
                    <p className='text-xl font-medium text-center'>Delete Lead</p>
                    <div className='py-5 flex justify-center items-center'>
                        <div className='mx-5 my-2'>
                            <p className='text-md font-medium'>Delete! Are you sure ?</p>
                        </div> 
                        <div className='w-1/4 mx-5 my-2'>
                            <button onClick={() => handleDelete(selectedItem)} className="text-white py-2 px-6 rounded bg-red-400" >Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {showDownloadModal && (
            <div className="modal-overlay fixed w-full h-screen top-0 left-0 right-0 bottom-0 flex justify-center items-center" style={{backgroundColor: "rgba(0,0,0,0.4)"}}>
                <div className="modal-content bg-white w-[40%] shadow-md rounded">
                    <span className="close px-5 py-5 text-xl font-bold cursor-pointer" onClick={closeDownloadModal}>
                        &times;
                    </span>
                    <p className='text-xl font-medium text-center'>Enter Unique Code:</p>
                    <div className='py-5 flex justify-center items-center'>
                        <div className='mx-5 my-2'>
                            <input value={code} onChange={(e) => setCode(e.target.value)} type="text" className='border px-4 py-1 border-gray-500' placeholder='unique code' />
                        </div> 
                        <div className='w-1/4 mx-5 my-2'>
                            <button onClick={() => handleDownload(selectedItem)} className="text-white py-2 px-6 rounded bg-blue-400" >Download</button>
                        </div>
                    </div>
                    <div className='flex justify-center text-red-400'>
                        {err && <p>{err}</p>}
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Dashboard
