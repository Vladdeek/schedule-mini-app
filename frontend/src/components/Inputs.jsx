import { ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export const OptionInput = ({
	Options = [],
	color = 'white',
	placeholder = '',
	onChange,
	onValidate, // <-- добавил
	labelKey = 'name',
	validate, // кастомная валидация
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(null)

	// дефолтная регулярка
	const flexibleRegex = /^\d+-\d+\.\d+$/

	// обновляем валидацию при изменении query
	useEffect(() => {
		let isValid = false

		if (query.trim() !== '') {
			if (validate) {
				isValid = validate(query)
			} else {
				isValid = flexibleRegex.test(query)
			}
		}

		// передаём наружу true/false
		onValidate?.(isValid)
	}, [query, validate])

	const filtered = useMemo(() => {
		return Options.filter(opt => {
			const text = typeof opt === 'object' ? opt[labelKey] : String(opt ?? '')
			return text.toLowerCase().includes(query.toLowerCase())
		})
	}, [query, Options, labelKey])

	useEffect(() => {
		if (selectedIndex !== null) onChange?.(Options[selectedIndex])
	}, [selectedIndex])

	return (
		<div className='relative select-none'>
			<div
				className={`${
					color === 'white'
						? 'bg-[var(--white)] text-[var(--black)]'
						: 'bg-[var(--black)] text-[var(--white)]'
				} flex justify-between rounded-lg shadow-[var(--shadow)] px-4 py-3 font-medium w-full
                focus-within:ring-2 focus-within:ring-[var(--hero-epta)] transition-all items-center
				`}
			>
				<input
					value={query}
					onChange={e => {
						const value = e.target.value
						const sanitized = value.replace(/[^0-9.-]/g, '')
						setQuery(sanitized)
					}}
					placeholder={placeholder}
					className='w-full bg-transparent outline-none'
					onFocus={() => setIsOpen(true)}
					onBlur={() => {
						setTimeout(() => setIsOpen(false), 150)
					}}
				/>
				<ChevronDown
					className={`transition-all rotate-0 ${isOpen && 'rotate-180'}`}
				/>
			</div>

			<p className='text-[var(--middle)] opacity-66 font-light text-xs pl-1 mt-1'>
				Введите в формате: 2211-0101.1
			</p>

			{isOpen && (
				<div
					className='absolute bg-[var(--white)] flex flex-col rounded-lg shadow-[var(--shadow)]
					max-h-50 overflow-y-scroll hide-scrollbar w-full top-13 z-10 text-[var(--black)]'
				>
					{filtered.length === 0 && (
						<p className='px-3 py-2 opacity-50'>Ничего нет</p>
					)}

					{filtered.map((item, index) => {
						const originalIndex = Options.indexOf(item)
						return (
							<p
								key={originalIndex}
								onMouseDown={() => {
									setSelectedIndex(originalIndex)
									setQuery(typeof item === 'object' ? item[labelKey] : item)
								}}
								className='px-3 py-2 transition-all hover:bg-[var(--light-middle)] cursor-pointer'
							>
								{typeof item === 'object' ? item[labelKey] : item}
							</p>
						)
					})}
				</div>
			)}
		</div>
	)
}

export const SubmitButton = ({ onClick, title, disabled = false }) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`${
				!disabled
					? 'active:scale-[97.5%] active:shadow-sm shadow-lg bg-[var(--hero-epta)] text-white hover:text-white  cursor-pointer'
					: 'text-[var(--light-middle)] bg-[var(--middle)] cursor-not-allowed'
			}  rounded-xl h-full flex gap-4 items-center justify-center transition-all py-3 w-full`}
		>
			{title && (
				<span className='font-medium truncate text-ellipsis'>{title}</span>
			)}
		</button>
	)
}
