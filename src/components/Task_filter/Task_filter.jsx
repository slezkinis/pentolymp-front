import Styles from "./Task_filter.module.css";


export const Task_filter = ({searchParams, filters, onSetFilters, onSetSearchParams}) => {

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    onSetFilters(newFilters)

    const newParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v)
    })

    const subjectId = searchParams.get('subject_id')
    const topicId = searchParams.get('topic_id')
    if (subjectId) newParams.set('subject_id', subjectId)
    if (topicId) newParams.set('topic_id', topicId)
    onSetSearchParams(newParams)
  }

  const clearFilters = () => {
    onSetFilters({
      difficulty_level: '',
      name: '',
    })                                                               
    const newParams = new URLSearchParams()
    const subjectId = searchParams.get('subject_id')
    const topicId = searchParams.get('topic_id')
    if (subjectId) newParams.set('subject_id', subjectId)
    if (topicId) newParams.set('topic_id', topicId)
    onSetSearchParams(newParams)
  }

  return (
    <div className={Styles.filter}>
        <h2 style={{marginLeft: '2%', paddingTop: '1%'}}>Фильтры</h2>
        <div className={Styles.filter_container}>
            <select value={filters.difficulty_level || ''} onChange={(e) => handleFilterChange('difficulty_level', e.target.value)} className={Styles.filter_select}>
                <option value='' className={Styles.filter_option}>Все сложности</option>
                <option value='Easy' className={Styles.filter_option}>Легко</option>
                <option value='Medium' className={Styles.filter_option}>Средне</option>
                <option value='Hard' className={Styles.filter_option}>Трудно</option>
            </select>
            <input value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} className={Styles.filter_input} type='text' placeholder="Название задачи"/>
        </div>
        <button onClick={clearFilters} className={Styles.clear_button}>Очистить фильтры</button>
    </div>
  );
};
