let API = ''
let FILE_API = ''
if (import.meta.env.VITE_ENV === 'dev') {
	API = import.meta.env.VITE_API_URL
	FILE_API = import.meta.env.VITE_IMG_URL
} else if (import.meta.env.VITE_ENV === 'prod') {
	API = import.meta.env.VITE_API_URL_VDS
	FILE_API = import.meta.env.VITE_IMG_URL_VDS
} else {
	throw new Error('Ошибка при чтении переменной среды ENV')
}
export { API, FILE_API }

import axios from 'axios'
import { setGlobalError } from './context/Errors'
const api = axios.create({
	withCredentials: true,
})
api.interceptors.response.use(
	r => r,
	error => {
		// Silent refresh
		if (error.response?.status === 498) {
			return api(error.config)
		}

		// отправляем ошибку в error provider
		setGlobalError(error.response?.status || '500')

		return Promise.reject(error)
	}
)
export default api
