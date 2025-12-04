import { X } from 'lucide-react'
import { Children } from 'react'
import { createContext, use, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// ErrorService.js
let _setError = null

export const setGlobalError = msg => {
	if (_setError) _setError(msg)
}

export const registerErrorHandler = fn => {
	_setError = fn
}

const ErrorContext = createContext(null)

export const useError = () => {
	return useContext(ErrorContext)
}

export const ErrorProvider = ({ children }) => {
	const [error, setError] = useState(null)
	const [showError, setShowError] = useState(false)

	console.log('Current error state:', error)

	const location = useLocation()
	const navigate = useNavigate()

	const ErrorsDescription = {
		400: 'Некорректный запрос. Проверьте правильность введённых данных.',
		401: 'Unauthorized. Пожалуйста, войдите в систему.',
		403: 'Доступ запрещён. У вас нет прав для доступа к этому ресурсу.',
		404: 'Ресурс не найден. Проверьте правильность введённого адреса.',
		409: 'Конфликт. Данные уже существуют или нарушены ограничения.',
		422: 'Неверный формат входных данных. Проверьте корректность передаваемых параметров.',
		429: 'Слишком много запросов. Попробуйте позже.',
		497: 'Не выбран правильный ответ. Пожалуйста, выберите правильный ответ и попробуйте снова.',
		500: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
		502: 'Плохой шлюз. Сервер получил некорректный ответ от другого сервера.',
		503: 'Сервис временно недоступен. Попробуйте позже.',
		504: 'Превышено время ожидания ответа от сервера.',
	}

	useEffect(() => {
		if (error) {
			setError(null)
			return () => clearTimeout(timer)
		}
	}, [false])

	useEffect(() => {
		registerErrorHandler(setError)
	}, [])

	return (
		<ErrorContext.Provider value={{ error, setError }}>
			<div className='relative'>
				<>
					{children}

					{error && (
						<div
							className={`absolute left-1/2 transform -translate-x-1/2 bg-[var(--red-status-bg)] p-2 rounded-xl shadow-[var(--shadow)] transition-all duration-300 z-1000 ${
								showError ? 'opacity-100 top-5' : 'opacity-0 -top-50'
							}`}
						>
							<div className='relative flex flex-col gap-2'>
								<X
									onClick={() => {
										setShowError(false)
										setError(null)
									}}
									size={20}
									className='absolute right-0 top-0 cursor-pointer text-[var(--red-status-text)]'
								/>
								<p className='text-center font-medium text-[var(--red-status-text)] rounded-lg text-base'>
									Ошибка {error}
								</p>
								<p className='bg-[var(--hard-lvl-bg)] text-[var(--red-status-text)] rounded-lg text-sm p-2 w-75 text-center'>
									{ErrorsDescription[error]}
								</p>
							</div>
						</div>
					)}
				</>
			</div>
		</ErrorContext.Provider>
	)
}
