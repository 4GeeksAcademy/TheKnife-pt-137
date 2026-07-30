import { Link } from "react-router-dom"
import { useChef } from "../../hooks/useChef"
import { useState } from "react"

const ChefLogin = () => {

    const { chefLogin } = useChef()
    const [chefLoginData, setChefLoginData] = useState({email: "", password: ""})

    return (
        <div className="chef_login mt-5 gap-3 d-flex flex-column justify-content-center align-items-center">
            <div className="email_box">
                <label className="me-2" htmlFor="email">Email</label>
                <input onChange={(e)=>setChefLoginData({...chefLoginData, email: e.target.value})} value={chefLoginData.email} type="text" name="email" id="email" />
            </div>
            <div className="password_box">
                <label className="me-2" htmlFor="password">Password</label>
                <input onChange={(e)=>setChefLoginData({...chefLoginData, password: e.target.value})} value={chefLoginData.password} type="password" name="password" id="password" />
            </div>
            <button className="btn btn-success" onClick={()=>chefLogin(chefLoginData)}>Login</button>
            <Link to="/chefs">Back to chefs</Link>
        </div>
    )
}

export default ChefLogin