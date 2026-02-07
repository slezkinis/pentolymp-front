"use client"
import Styles from "./PvP_queue.module.css";
import { useState } from "react";


export const PvP_queue = ({subject, onCancelClicked}) => {
  function cancelSearch() {
    onCancelClicked()
  }
  
  return (
    <div className={Styles.pvp_menu}>
        <h1>Поиск противника</h1>
        <div style={{fontSize: '20px'}}>Предмет: {subject}</div>
        <div className={Styles.rounded_spin}></div>
        <div className={Styles.search_text}>Ищем соперника...</div>
        <button className={Styles.cancel_button} onClick={cancelSearch}>Отменить поиск</button>
    </div>
  );
};
