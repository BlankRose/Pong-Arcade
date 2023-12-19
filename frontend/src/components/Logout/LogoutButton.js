import { useState } from "react"
import apiHandle, { withAuth } from '../API_Access';
import store from '../../store/index'
import userSlice from "../../store/user";

const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const submitLogout = async () => {
    setIsLoading(true)

        apiHandle.post('/auth/logout', {}, withAuth())
		.then(res => {
            console.log("confirm log in")
				store.dispatch(userSlice.actions.setOffline())
                setIsLoading(false)
                localStorage.removeItem('token');
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
