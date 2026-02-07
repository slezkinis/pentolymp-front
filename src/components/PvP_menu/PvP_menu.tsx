"use client"
import Styles from "./PvP_menu.module.css";
import { useState, useEffect } from "react";
import { Subject, getSubjects } from '../../api/tasks'
import useInfiniteSubjectsScroll from '../../hooks/useInfiniteSubjectsScroll'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePvp } from '../../context/PvpContext'
import { useAuth } from "../../context/AuthContext";
import { PvpQueueService, WebSocketManager } from '../../services/pvpServices'
import { PvP_queue } from "../PvP_queue/PvP_queue";


interface PvpQueueScreenProps {
  onMatchFound: (matchId: number) => void
} 

export default function PvP_menu({ onMatchFound }: PvpQueueScreenProps) {
  const { state, startQueue, cancelQueue } = usePvp()
  const { user, refreshUserProfile } = useAuth()
  const { data: subjects, hasMore, loadMore } = useInfiniteSubjectsScroll(getSubjects)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [queueService, setQueueService] = useState<PvpQueueService | null>(null)

  useEffect(() => {
    return () => {
      refreshUserProfile()
      if (queueService) {
        queueService.disconnect()
      }
    }
  }, [])


  const handleStartSearch = async () => {
    if (!selectedSubject) {
      console.error('Выберите предмет для соревнования')
      return
    }
    try {
      const wsManager = new WebSocketManager()
      const service = new PvpQueueService(wsManager)
      
      wsManager.setConnectionChangeHandler((status) => {
        console.log('Queue connection status:', status)
      })

      service.onQueueUpdate((data) => {
        console.log('Queue update:', data)
      })

      service.onMatchFound((data) => {
        console.log('Match found:', data)
        service.disconnect()
        onMatchFound(data.match_id)
      })

      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      await service.connect(token)
      service.findMatch(selectedSubject.id)
      
      setQueueService(service)
      startQueue(selectedSubject)
    } catch (error) {
      console.error('Failed to start queue search:', error)
    }
  }

  const handleCancelSearch = () => {
    if (queueService) {
      queueService.cancelSearch()
      queueService.disconnect()
      setQueueService(null)
    }
    cancelQueue()
  }

  if (state.queue.isActive) {
    return (
      <PvP_queue subject={state.queue.subject?.name} onCancelClicked={handleCancelSearch}/>
    )
  }
  
  return (
    <div className={Styles.pvp_menu}>
        <h1>PvP Соревнование</h1>
        <div style={{fontSize: '20px'}}>Выберите предмет и найдите соперника для увлекательного соревнования!</div>
        <div style={{alignSelf: 'flex-start', marginLeft: '4%', marginTop: '3%'}}>Выберите предмет:</div>
        <InfiniteScroll dataLength={subjects.length} next={loadMore} hasMore={hasMore} loader={<div>Загрузка...</div>}>
            <div className={Styles.subjects_container}>
                {subjects.map((subject: any) => (
                    <div onClick={() => setSelectedSubject(subject)} key={subject.id} className={`${Styles.pvp_subject} ${selectedSubject?.id === subject.id ? Styles.active_subject : Styles.disactive_subject}`}>
                      <p className={Styles.subject_name}>{subject.name}</p>
                    </div>
                ))}
            </div>
        </InfiniteScroll>
        <button onClick={handleStartSearch} className={Styles.find_button} disabled={!selectedSubject}>Найти противника</button>
        <div style={{opacity: '70%', fontSize: '16px', 'marginTop': '2%', paddingBottom: '2%'}}>Рейтинг: {user?.rating?.score}</div>
    </div>
  );
};
