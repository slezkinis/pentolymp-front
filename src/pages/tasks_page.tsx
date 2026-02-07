'use client'
import { Task_filter } from '../components/Task_filter/Task_filter'
import { Task_icon } from '../components/Task_icon/Task_icon'
import Styles from './Tasks.module.css'
import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom'
import { DifficultyLevel } from '../api/tasks'
import { getTasks } from '../api/tasks'
import useInfiniteTasksScroll from '../hooks/useInfiniteTasksScroll'
import InfiniteScroll from 'react-infinite-scroll-component'


const Tasks_page = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const topic_id = searchParams.get('topic_id')
    const subject_id = searchParams.get('subject_id')
    const [filters, setFilters] = useState({
        difficulty_level: (searchParams.get('difficulty_level') || '') as DifficultyLevel | '',
        name: searchParams.get('name') || '',
    }) 
    let { data: tasks, hasMore, loadMore, reset } = useInfiniteTasksScroll(searchParams, filters, getTasks)
    
    useEffect(() => {
        reset()
    }, [filters, searchParams]);

    const handleSearchParams = (data: any) => {
        setSearchParams(data)   
    }

    const handleFilters = (data: any) => {
        setFilters(data)
    }
    
    
    return (
        <>
            <main>
                <h1>Задачи</h1>
                {subject_id
                ? <a href={`/subjects/${subject_id}/topics`} className={Styles.back_to_subjects}>← Назад к темам</a>
                : <a href={`/`} className={Styles.back_to_subjects}>← Назад к предметам</a>
                }
                <Task_filter searchParams={searchParams} onSetSearchParams={handleSearchParams} filters={filters} onSetFilters={handleFilters}/>
                <InfiniteScroll
                    dataLength={tasks.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<div style={{textAlign: 'center'}}>Загрузка...</div>}
                >
                    <div className={Styles.tasks}>
                        {tasks.map(task => (
                            <Task_icon subject_id={subject_id} topic_id={topic_id} key={task.id} task_name={task.name} task_id={task.id} task_level={task.difficulty_level === 'Easy' ? 'Легко' : task.difficulty_level === 'Medium' ? 'Средне' : 'Трудно'} task_status={`${task.is_solved ? 'Решена' : 'Не решена'}`}/>
                        ))}
                    </div>
                </InfiniteScroll>
                <p className={Styles.more_tasks}>Больше задач нет</p>
            </main>
        </>
    );
}

export default Tasks_page