import { Task } from '../context/PvpContext'

export interface WebSocketMessage {
  type: string
  [key: string]: any
}

export class WebSocketManager {
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: Map<string, (data: any) => void> = new Map()
  private onConnectionChange?: (status: 'disconnected' | 'connecting' | 'connected') => void

  constructor() {
    this.setupMessageHandlers()
  }

  private setupMessageHandlers() {
    this.messageHandlers.set('added_to_queue', this.handleAddedToQueue.bind(this))
    this.messageHandlers.set('match_found', this.handleMatchFound.bind(this))
    this.messageHandlers.set('match_state', this.handleMatchState.bind(this))
    this.messageHandlers.set('current_task', this.handleCurrentTask.bind(this))
    this.messageHandlers.set('own_answer_result', this.handleOwnAnswerResult.bind(this))
    this.messageHandlers.set('opponent_answer', this.handleOpponentAnswer.bind(this))
    this.messageHandlers.set('match_finished', this.handleMatchFinished.bind(this))
    this.messageHandlers.set('error', this.handleError.bind(this))
  }

  connect(url: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      this.onConnectionChange?.('connecting')
      
      const wsUrl = `${url}?token=${token}`
      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.onConnectionChange?.('connected')
        resolve()
      }

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          const handler = this.messageHandlers.get(message.type)
          if (handler) {
            handler(message)
          } else {
            console.log('Unhandled message type:', message.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.socket.onclose = () => {
        console.log('WebSocket disconnected')
        this.onConnectionChange?.('disconnected')
        this.attemptReconnect(url, token)
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.onConnectionChange?.('disconnected')
        reject(error)
      }
    })
  }

  private attemptReconnect(url: string, token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect(url, token).catch(console.error)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  send(message: WebSocketMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  setMessageHandler(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler)
  }

  setConnectionChangeHandler(handler: (status: 'disconnected' | 'connecting' | 'connected') => void) {
    this.onConnectionChange = handler
  }

  private handleAddedToQueue(data: any) {
    console.log('Added to queue:', data)
  }

  private handleMatchFound(data: any) {
    console.log('Match found:', data)
  }

  private handleMatchState(data: any) {
    console.log('Match state:', data)
  }

  private handleCurrentTask(data: any) {
    console.log('Current task:', data)
  }

  private handleOwnAnswerResult(data: any) {
    console.log('Own answer result:', data)
  }

  private handleOpponentAnswer(data: any) {
    console.log('Opponent answer:', data)
  }

  private handleMatchFinished(data: any) {
    console.log('Match finished:', data)
  }

  private handleError(data: any) {
    console.error('WebSocket error:', data)
  }
}

export class PvpQueueService {
  private wsManager: WebSocketManager
  private queueUpdateCallback?: (data: any) => void
  private matchFoundCallback?: (data: any) => void

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager
    this.setupHandlers()
  }

  private setupHandlers() {
    this.wsManager.setMessageHandler('added_to_queue', (data) => {
      this.queueUpdateCallback?.(data)
    })

    this.wsManager.setMessageHandler('match_found', (data) => {
      this.matchFoundCallback?.(data)
    })
  }

  async connect(token: string) {
    try {
      await this.wsManager.connect('ws://127.0.0.1:8000/pvp/queue/', token)
    } catch (error) {
      console.error('Failed to connect to queue:', error)
      throw error
    }
  }

  findMatch(subjectId: number) {
    this.wsManager.send({
      type: 'find_match',
      subject_id: subjectId,
    })
  }

  cancelSearch() {
    this.wsManager.send({
      type: 'cancel_search',
    })
  }

  disconnect() {
    this.wsManager.disconnect()
  }

  onQueueUpdate(callback: (data: any) => void) {
    this.queueUpdateCallback = callback
  }

  onMatchFound(callback: (data: any) => void) {
    this.matchFoundCallback = callback
  }
}

export class PvpMatchService {
  private wsManager: WebSocketManager
  private taskUpdateCallback?: (task: Task) => void
  private answerResultCallback?: (data: any) => void
  private opponentAnswerCallback?: (data: any) => void
  private matchFinishedCallback?: (data: any) => void

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager
    this.setupHandlers()
  }

  private setupHandlers() {
    this.wsManager.setMessageHandler('match_state', (data) => {
      console.log('Match state updated:', data)
    })

    this.wsManager.setMessageHandler('current_task', (data) => {
      this.taskUpdateCallback?.(data.task)
    })

    this.wsManager.setMessageHandler('own_answer_result', (data) => {
      this.answerResultCallback?.(data.data)
    })

    this.wsManager.setMessageHandler('opponent_answer', (data) => {
      this.opponentAnswerCallback?.(data.data)
    })

    this.wsManager.setMessageHandler('match_finished', (data) => {
      this.matchFinishedCallback?.(data)
    })
  }

  async connect(matchId: number, token: string) {
    try {
      await this.wsManager.connect(`ws://127.0.0.1:8000/pvp/match/${matchId}/`, token)
      this.wsManager.send({ type: 'ready' })
    } catch (error) {
      console.error('Failed to connect to match:', error)
      throw error
    }
  }

  getTask() {
    this.wsManager.send({
      type: 'get_task',
    })
  }

  submitAnswer(answer: string) {
    this.wsManager.send({
      type: 'submit_answer',
      answer: answer,
    })
  }

  send(message: any) {
    this.wsManager.send(message)
  }

  disconnect() {
    this.wsManager.disconnect()
  }

  onTaskUpdate(callback: (task: Task) => void) {
    this.taskUpdateCallback = callback
  }

  onAnswerResult(callback: (data: any) => void) {
    this.answerResultCallback = callback
  }

  onOpponentAnswer(callback: (data: any) => void) {
    this.opponentAnswerCallback = callback
  }

  onMatchFinished(callback: (data: any) => void) {
    this.matchFinishedCallback = callback
  }
}