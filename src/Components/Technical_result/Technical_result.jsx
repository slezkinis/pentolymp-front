import Styles from "./Technical_result.module.css";


export const Technical_result = () => {
  return (
    <div className={Styles.result_menu}>
        <div className={Styles.result_emoji}>⚠️</div>
        <h1 className={Styles.result_title}> Техническое завершение</h1>
        <div className={Styles.result_undertext}>Матч был завершён по техническим причинам</div>
        <div className={Styles.reason_message}>
            <div className={Styles.reason_head}>Это могло произойти из-за:</div>
            <div className={Styles.reason}>• Потери соединения с сервером</div>
            <div className={Styles.reason}>• Выхода одного из игроков</div>
            <div className={Styles.reason}>• Технической проблемы на сервере</div>
        </div>
        <div className={Styles.undertext}>Не волнуйтесь, это не повлияет на ваш рейтинг. Попробуйте начать новый матч.</div>
        <button className={Styles.exit_button}><a className={Styles.exit_link} href='/pvp'>Выйти в меню</a></button>
    </div>
  );
};
