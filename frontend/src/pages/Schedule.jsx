import {
	format,
	startOfWeek,
	addDays,
	isToday,
	isWeekend,
	isWithinInterval,
	startOfToday,
	isSameDay,
	set,
	addWeeks,
} from 'date-fns'
import { da, ru } from 'date-fns/locale'
import { use, useEffect, useMemo, useState } from 'react'
import api, { API } from '../API'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { setGlobalError } from '../context/Errors'

const ScheduleCard = ({
	lessonIndex,
	isCurrent,
	time_start,
	time_end,
	title,
	description,
}) => {
	return (
		<div
			key={lessonIndex}
			className={`bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex flex-col gap-2 ${
				isCurrent ? 'ring-4 ring-[var(--hero-epta)]' : ''
			}`}
		>
			<p className=' xl:text-sm text-xs text-[var(--black)]'>
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{time_start}
				</span>
				—
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{time_end}
				</span>
			</p>
			<p className='text-[var(--black)] font-bold text-lg'>{title}</p>
			<p className='text-[var(--middle)] font-light text-sm'>{description}</p>
		</div>
	)
}

const DayCard = ({ isSelected, day, weekDay, onClick }) => {
	return (
		<div
			onClick={onClick}
			className={`
				cursor-pointer rounded-xl shadow-[var(--shadow)] 
				flex items-center justify-center gap-3 text-[var(--black)] 
				font-medium w-full p-4 
				${isSelected ? 'bg-[var(--hero-epta)] text-white' : 'bg-[var(--white)]'}
			`}
		>
			<div className='flex flex-col items-center justify-center'>
				<p className='text-3xl'>{day}</p>
				<p className='text-lg'>{weekDay}</p>
			</div>
		</div>
	)
}

const Schedule = () => {
	const [scheduleData, setScheduleData] = useState({})
	const [allScheduleData, setAllScheduleData] = useState({})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [current_week, setCurrentWeek] = useState(0)

	// раньше приходило как пропс selectedOffset
	const [weekOffset, setWeekOffset] = useState(0)

	const today = startOfToday()

	// начало недели по текущему смещению
	const weekStart = startOfWeek(addWeeks(today, weekOffset), {
		weekStartsOn: 1,
	})

	// дни недели (6 дней)
	const weekDays = useMemo(
		() => Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)),
		[weekStart]
	)

	// выбранный день
	const [selectedDay, setSelectedDay] = useState(
		weekDays.find(d => isSameDay(d, today)) || weekDays[0]
	)

	const isCurrentLesson = (lessonDate, lessonTime) => {
		try {
			const [h, m] = lessonTime.split(':').map(Number)
			const lessonStart = new Date(lessonDate)
			lessonStart.setHours(h, m, 0, 0)

			const lessonEnd = new Date(lessonStart.getTime() + 90 * 60000)

			return isWithinInterval(new Date(), {
				start: lessonStart,
				end: lessonEnd,
			})
		} catch {
			return false
		}
	}

	const selectedDateString = format(selectedDay, 'yyyy-MM-dd')
	const selectedDaySchedule = scheduleData?.[selectedDateString] || []

	// связываем локальное смещение недели с бекендовским current_week
	useEffect(() => {
		setCurrentWeek(weekOffset)
	}, [weekOffset])

	const loadSchedule = async () => {
		setLoading(true)

		try {
			const res = await api.get(
				`${API}/schedule-lessons?week_offset=${current_week}`,
				{
					withCredentials: true,
					headers: {
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			const data = res.data
			setAllScheduleData(data)

			const normalized = {}
			Object.entries(data?.schedule).forEach(([date, lessons]) => {
				const shortDate = date.split('T')[0]

				normalized[shortDate] = lessons.map(lesson => ({
					time_start: lesson.time_start.slice(0, 5),
					time_end: lesson.time_end.slice(0, 5),
					title: `${lesson.subject} (${lesson.lesson_type})`,
					description: `${lesson.teacher_name}, ауд. ${lesson.auditory_name}`,
					raw: lesson,
				}))
			})

			setScheduleData(normalized)
			setLoading(false)
		} catch (e) {
			console.error(e)
			setGlobalError(e.response ? String(e.response.status) : '500')
			setLoading(false)
		}
	}

	useEffect(() => {
		loadSchedule()
	}, [current_week])

	const prev_active = allScheduleData?.has_prev
	const next_active = allScheduleData?.has_next
	const WeekNumber = allScheduleData?.current_week_number

	return (
		<div className='flex flex-col gap-2 p-4 h-screen'>
			{loading ? (
				<Loader />
			) : (
				<>
					{/* Шапка — переключение недель */}
					<div className='w-full flex justify-between items-center mb-3 text-[var(--black)]'>
						<ChevronLeft
							size={48}
							onClick={() => prev_active && setWeekOffset(prev => prev - 1)}
							className={`${!prev_active && 'opacity-50 cursor-not-allowed'}`}
						/>
						<p className='font-medium text-2xl mt-0.5'>Неделя {WeekNumber}</p>
						<ChevronRight
							size={48}
							onClick={() => next_active && setWeekOffset(prev => prev + 1)}
							className={`${!next_active && 'opacity-50 cursor-not-allowed'}`}
						/>
					</div>

					{/* Сетка дней */}
					<div className='grid grid-cols-6 gap-2'>
						{weekDays.map((day, index) => {
							const isCurrentDay = isToday(day)
							const isSelected = isSameDay(day, selectedDay)

							return (
								<div key={index} className='flex flex-col gap-4'>
									<DayCard
										isCurrentDay={isCurrentDay}
										isSelected={isSelected}
										onClick={() => setSelectedDay(day)}
										day={format(day, 'd')}
										month={format(day, 'MMMM', { locale: ru })}
										weekDay={format(day, 'EEEEEE', {
											locale: ru,
										}).toUpperCase()}
									/>
								</div>
							)
						})}

						{/* Уроки выбранного дня */}
						<div className='col-span-6 flex flex-col gap-3 mt-1'>
							{selectedDaySchedule.length > 0 ? (
								selectedDaySchedule.map((lesson, lessonIndex) => {
									const isCurrent = isCurrentLesson(
										selectedDay,
										lesson.time_start
									)

									return (
										<ScheduleCard
											key={lessonIndex}
											lessonIndex={lessonIndex}
											isCurrent={isCurrent}
											time_start={lesson.time_start}
											time_end={lesson.time_end}
											title={lesson.title}
											description={lesson.description}
										/>
									)
								})
							) : (
								<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex items-center justify-center min_h-[120px]'>
									<p className='text-[var(--middle)] text-center'>
										Нет занятий
									</p>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default Schedule
