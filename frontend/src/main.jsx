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
import LoaderPage from './pages/LoaderPage'

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Authorization />} />
			<Route path='/schedule' element={<Schedule />} />
			<Route path='/loader' element={<LoaderPage />} />
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
