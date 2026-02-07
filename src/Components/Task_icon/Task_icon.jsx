import Styles from "./Task_icon.module.css";


export const Task_icon = ({subject_id, task_name, task_level, task_status, task_id, topic_id}) => {
  return (
    <a className={Styles.task} href={`/task/${task_id}${!subject_id && !topic_id? '' : '?'}${topic_id ? `topic_id=${topic_id}` : ``}${!subject_id || !topic_id? '' : '&'}${subject_id ? `subject_id=${subject_id}` : ``}`}>
      <div>
          <div className={Styles.line_container}>
              <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" className={Styles.task_logo} xmlns="http://www.w3.org/2000/svg">
                  <path d="M139.61 35.5a12 12 0 0 0-17 0L58.93 98.81l-22.7-22.12a12 12 0 0 0-17 0L3.53 92.41a12 12 0 0 0 0 17l47.59 47.4a12.78 12.78 0 0 0 17.61 0l15.59-15.62L156.52 69a12.09 12.09 0 0 0 .09-17zm0 159.19a12 12 0 0 0-17 0l-63.68 63.72-22.7-22.1a12 12 0 0 0-17 0L3.53 252a12 12 0 0 0 0 17L51 316.5a12.77 12.77 0 0 0 17.6 0l15.7-15.69 72.2-72.22a12 12 0 0 0 .09-16.9zM64 368c-26.49 0-48.59 21.5-48.59 48S37.53 464 64 464a48 48 0 0 0 0-96zm432 16H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H208a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h288a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z">
                  </path>
              </svg>
              <h2 className={Styles.task_name}>{task_name}</h2>
          </div>
          <div className={Styles.text_line_container}>
            <div className={Styles.task_underline}>{task_level}</div>
            <div className={Styles.task_underline}>{task_status}</div>
          </div>
      </div>
    </a>
  );
};
