import { useState } from 'react'
import { OptionInput, SubmitButton } from '../components/Inputs.jsx'

const WavingHandEmojiSvg = ({ size }) => {
	const scale = parseInt(size) * 1.3
	return (
		<svg width={scale} height={scale} xmlns='http://www.w3.org/2000/svg'>
			<text
				x='50%'
				y='50%'
				font-size={size}
				text-anchor='middle'
				dominant-baseline='middle'
				font-family='Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif'
			>
				👋
			</text>
		</svg>
	)
}

const Authorization = ({ username = 'Username' }) => {
	const [groupValid, setGroupValid] = useState(false)

	return (
		<div className='h-screen w-screen flex justify-center items-center p-4'>
			<div className='flex flex-col gap-20 w-full -mt-[15vh]'>
				<div className='flex flex-col gap-1 text-[var(--black)] text-5xl font-semibold'>
					<p>Приветствую,</p>
					<div className='flex items-center'>
						<p>{username}!</p>
						<WavingHandEmojiSvg size={'48px'} />
					</div>
				</div>

				<div className='flex flex-col gap-1'>
					<p className='text-[var(--middle)] text-md pl-1'>
						Выберите свою группу
					</p>
					<OptionInput placeholder='номер группы' onValidate={setGroupValid} />
				</div>

				<SubmitButton
					title='Подтвердить'
					disabled={!groupValid}
					onClick={() => {}}
				/>
			</div>
		</div>
	)
}
export default Authorization
