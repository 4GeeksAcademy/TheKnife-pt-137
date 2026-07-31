

import { Link } from "react-router-dom"
import { useState } from "react"
import { useCook } from "../../hooks/useCook"

const CookLogin = () => {

    const { cookLogin } = useCook()
    const [cookLoginData, setCookLoginData] = useState({email: "", password: ""})

    return (
        <div className="cook_login mt-5 gap-3 d-flex flex-column justify-content-center align-items-center">
            <div className="email_box">
                <label className="me-2" htmlFor="email">Email</label>
                <input onChange={(e)=>setCookLoginData({...cookLoginData, email: e.target.value})} value={cookLoginData.email} type="text" name="email" id="email" />
            </div>
            <div className="password_box">
                <label className="me-2" htmlFor="password">Password</label>
                <input onChange={(e)=>setCookLoginData({...cookLoginData, password: e.target.value})} value={cookLoginData.password} type="password" name="password" id="password" />
            </div>
            <button className="btn btn-success" onClick={()=>cookLogin(cookLoginData)}>Login</button>
            <Link to="/cooks">Back to cooks</Link>
        </div>
    )
}

export default CookLogin