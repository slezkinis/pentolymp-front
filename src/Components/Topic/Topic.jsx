import Styles from "./Topic.module.css";


export const Topic = ({topic_name, topic_id, subject_id}) => {
  return (
    <a className={Styles.topic} href={`/tasks?subject_id=${subject_id}&topic_id=${topic_id}`}>
      <div>
          <div className={Styles.line_container}>
              <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" className={Styles.topic_logo} xmlns="http://www.w3.org/2000/svg">
                  <path d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z">
                  </path>
              </svg>
              <h2 className={Styles.topic_name}>{topic_name}</h2>
          </div>
          <div className={Styles.topic_underline}>Нажмите, чтобы посмотреть задачи</div>
      </div>
    </a>
  );
};
