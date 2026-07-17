import  axios  from "axios";

const api = axios.create({
    baseURL : import.meta.env.PROD ? "https://career-fair-loyh.onrender.com/api" : "http://localhost:5000/api",
    headers : {
        "Content-Type" : "application/json"
    }
})

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token")

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const apiUrl = import.meta.env.PROD ? 'https://career-fair-loyh.onrender.com/api' : 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');

  let subfolder = '';
  if (path.startsWith('fairBanner-')) subfolder = 'banner/';
  else if (path.startsWith('fairLogo-')) subfolder = 'logo/';

  // Remove leading slash and 'uploads/' if it exists in the path
  const cleanPath = path.replace(/^\/?(uploads\/)?/, '');

  return `${baseUrl}/uploads/${subfolder}${cleanPath}`;
};

export default api;