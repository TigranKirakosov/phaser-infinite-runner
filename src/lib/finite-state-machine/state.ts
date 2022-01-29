import StateMachine from "./state-machine"

interface IState<Context = any> {
  readonly name: string
  sm: StateMachine
  ctx: Context

  onEnter? (prevState?: string): void
  onExit? (nextState?: string): void
  onUpdate? (dt: number): void
}

export default IState
