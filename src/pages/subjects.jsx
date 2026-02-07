'use client'
import { Subject } from '../Components/Subject/Subject'
import Styles from './Subjects.module.css'
import { getSubjects } from '../api/tasks'
import useInfiniteSubjectsScroll from '../hooks/useInfiniteSubjectsScroll'
import InfiniteScroll from 'react-infinite-scroll-component'



const Subjects_page = () => {
    const { data: subjects, hasMore, loadMore } = useInfiniteSubjectsScroll(getSubjects)
    
    return (
        <>
            <main>
                <h1>Предметы</h1>
                <InfiniteScroll
                dataLength={subjects.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<div>Загрузка...</div>}
                >
                    <div className={Styles.subjects}>
                        {subjects.map(subject => (
                            <Subject key={subject.id} subject_name={subject.name} subject_id={subject.id}/>
                        ))}
                    </div>
                </InfiniteScroll>
                <p className={Styles.more_subjects}>Больше предметов нет</p>
            </main>
        </>
    );
}
export default Subjects_page