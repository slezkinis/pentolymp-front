import Task_details from '../components/Task/Task'
import Styles from './Task.module.css'
import { useSearchParams } from 'react-router-dom'


const Task_page = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const topic_id = searchParams.get('topic_id')
    const subject_id = searchParams.get('subject_id')
    return (
        <>
            <main>
                {topic_id 
                    ? (subject_id
                        ? <a href={`/tasks?topic_id=${topic_id}&subject_id=${subject_id}`} className={Styles.back_to_subjects}>← Назад к задачам</a>
                        : <a href={`/tasks?topic_id=${topic_id}`} className={Styles.back_to_subjects}>← Назад к задачам</a>
                    ) 
                    : <a href='/tasks' className={Styles.back_to_subjects}>← Назад к задачам</a>
                }
                <Task_details/>
            </main>
        </>
    );
}
export default Task_page