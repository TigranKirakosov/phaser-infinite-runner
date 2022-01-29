import { ILogger } from "~/lib/types"
import IState from "./state"

class StateMachine<Context = any> {
  protected static idCount = 0
  private id = (++StateMachine.idCount).toString()
  private states = new Map<string, IState>()
  private currentState?: IState
  private context?: Context
  private isChangingState = false
  private changeStateQueue: string[]
  private logger: ILogger

  get currentStateName () { return this.currentState?.name }

  constructor (context?: Context, id?: string, logger?: ILogger) {
    this.id = id ?? this.id
    this.context = context
    this.logger = logger ?? globalThis.console
    this.changeStateQueue = []
  }

  addState (state: IState) {
    state.sm = this
    state.ctx = this.context
    this.states.set(state.name, state)
    return this
  }

  setState (name: string) {
    if (!this.states.has(name)) {
      return this.logger?.warn(
        `The state "${name}" is not implemented`
      )
    }
    if (this.isCurrentState(name)) return
    if (this.isChangingState) {
      this.changeStateQueue.push(name)
      return
    }

    this.isChangingState = true

    this.logger?.log(
      `[StateMachine (${this.id})] change from ${this.currentState?.name ?? "none"} to ${name}`
    )
    
    this.currentState?.onExit && this.currentState.onExit(name)

    const prevState = this.currentState?.name
    this.currentState = this.states.get(name)!

    this.currentState?.onEnter && this.currentState.onEnter(prevState)
    
    this.isChangingState = false
  }

  update (dt: number) {
    if (this.changeStateQueue.length > 0) {
      this.setState(this.changeStateQueue.shift()!)
      return
    }
  
    this.currentState?.onUpdate && this.currentState.onUpdate(dt)
  }

  isCurrentState (name: string) {
    return this.currentState?.name && this.currentState.name === name
  }
}

export default StateMachine
