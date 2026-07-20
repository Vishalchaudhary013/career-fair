import { createContext, useContext, useState } from "react"
import { loginUser, registerUser, sendOtpApi, verifyOtpUser } from "../services/authApi";


const AuthContext = createContext();
export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(false);

    const register = async(formdata)=>{
        try {
            setLoading(true)

            const data = await registerUser(formdata)

            return data
        } catch (error) {
            throw error;
        }finally{
            setLoading(false)
        }
    }

    const login = async(formdata)=>{
        try {
            setLoading(true)

            const data = await loginUser(formdata)
            setUser(data.user)
            setToken(data.token)
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))

            return data
        } catch (error) {
            throw error;
        }finally{
            setLoading(false)
        }
    }

    const sendOtp = async (data) => {
        try {
            setLoading(true);
            const res = await sendOtpApi(data);
            if (res.alreadyVerified && res.token && res.user) {
                setUser(res.user);
                setToken(res.token);
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));
            }
            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const verifyOtp = async(data) => {
        try {
            setLoading(true);
            const res = await verifyOtpUser(data);
            if (res.token && res.user) {
                setUser(res.user);
                setToken(res.token);
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));
            }
            return res;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const logout = ()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
    }

    return(
        <AuthContext.Provider
        value = {{
            user,
            token,
            loading,
            login,
            register,
            verifyOtp,
            sendOtp,
            logout,
            isAuthenticated : !! token,
        }} >
            {children}
        </AuthContext.Provider>
    )

}
export default AuthContext;