import { Topic } from '../Components/Topic/Topic'
import Styles from './Topics.module.css'
import { useParams } from 'react-router-dom'
import { getTopics } from '../api/tasks'
import useInfiniteTopicsScroll from '../hooks/useInfiniteTopicsScroll'
import InfiniteScroll from 'react-infinite-scroll-component'


const Topics_page = () => {
    const { subjectId } = useParams<{ subjectId: string }>()
    if (!subjectId) {
        console.error('Wrong id argument')
    }
    const { data: topics, hasMore, loadMore } = useInfiniteTopicsScroll(parseInt(subjectId!), getTopics)
    
    return (
        <>   
            <main>
                <h1>Темы</h1>
                <a href='/' className={Styles.back_to_subjects}>← Назад к предметам</a>
                <InfiniteScroll
                dataLength={topics.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<div>Загрузка...</div>}
                >
                    <div className={Styles.topics}>
                        {topics.map(topic => (
                            <Topic subject_id={subjectId} topic_id={topic.id} key={topic.id} topic_name={topic.name}/>
                        ))}
                    </div>
                </InfiniteScroll>
                <p className={Styles.more_topics}>Больше тем нет</p>
            </main>
        </>
    );
}
export default Topics_page
