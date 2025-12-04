import { createRoot } from 'react-dom/client'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
} from 'react-router-dom'
import './index.css'
import './themes.css'
import Schedule from './pages/Schedule'
import Authorization from './pages/Authorization'
import { ErrorProvider } from './context/Errors'

const App = () => {
	return (
		<Routes>
			<Route path='/auth' element={<Authorization />} />
			<Route path='/schedule' element={<Schedule />} />
		</Routes>
	)
}

createRoot(document.getElementById('root')).render(
	<Router>
		<ErrorProvider>
			<App />
		</ErrorProvider>
	</Router>
)
