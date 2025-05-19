import axios from 'axios'

const api = axios.create({
  baseURL: process.env.APP_UPLOAD_URL
})

export default api
