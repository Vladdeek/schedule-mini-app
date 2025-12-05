import { ChevronLeft } from 'lucide-react'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'

const LoaderPage = () => {
	const navigate = useNavigate()
	return (
		<div className='flex w-screen h-screen justify-center items-center relative'>
			<ChevronLeft
				onClick={() => {
					navigate(-1)
				}}
				className='absolute left-2 top-2 rounded-xl p-1 pr-1.5 bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)] cursor-pointer hover:bg-[var(--light-gray)] active:scale-95'
				size={36}
			/>
			<Loader />
		</div>
	)
}
export default LoaderPage
