import Styles from "./Match_status.module.css";


export const Match_status = ({title, t1, t2, t3, t4, t5, t6, t7, t8}) => {
  return (
    <div className={Styles.match_status}>
        <h3 style={{marginLeft: '3%', paddingTop: '3%'}}>{title}</h3>
        <div className={Styles.line_container}>
            <div className={Styles.match_left_text}>{t1}</div>
            <div className={Styles.match_right_text}>{t2}</div>
        </div>
        <div className={Styles.line_container}>
            <div className={Styles.match_left_text}>{t3}</div>
            <div className={Styles.match_right_text}>{t4}</div>
        </div>
        <div className={Styles.line_container}>
            <div className={Styles.match_left_text}>{t5}</div>
            <div className={Styles.match_right_text}>{t6}</div>
        </div>
        <div className={Styles.line_container} style={{marginTop: '5%'}}>
            <div className={Styles.match_left_text}>{t7}</div>
            <div className={Styles.match_right_text}>{t8}</div>
        </div>
    </div>
  );
};
