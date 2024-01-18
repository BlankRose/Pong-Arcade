import { useState } from "react"
import apiHandle, { withAuth } from '../API_Access';
import store from '../../store/index'
import userSlice from "../../store/user";
import { useNavigate } from "react-router-dom";



const LogoutButton = ({onLogout}) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  



  const submitLogout = async () => {
    setIsLoading(true)

        apiHandle.post('/auth/logout', {}, withAuth())
		    .then(res => {
				store.dispatch(userSlice.actions.setOffline())
        setIsLoading(false)
        localStorage.removeItem('token');
        onLogout();
        navigate('/');
       
		})
		.catch(err => {
			console.warn(err.response);
        
		});

    }
   
  return (
    <button  onClick={submitLogout} disabled={isLoading}>
      <div>Logout</div>
    </button>
  )
}

export default LogoutButton
