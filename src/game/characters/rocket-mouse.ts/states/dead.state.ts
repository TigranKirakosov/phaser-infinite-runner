import IState from "~/lib/finite-state-machine/state"
import StateMachine from "~/lib/finite-state-machine/state-machine"
import { AnimationKeys } from "~/types"
import RocketMouse from "../rocket-mouse.char"
import { RocketMouseStates } from "../types"

type Context = RocketMouse

class DeadState implements IState<Context> {
  name = RocketMouseStates.Dead
  sm!: StateMachine
  ctx!: Context
  private stoppedSliding = false

  onEnter () {
    this.ctx.jetpack.enableJetpack(false)
    this.ctx.body.setAccelerationY(0)
    this.ctx.body.setVelocity(500, 0)
    this.ctx.mouse.play(AnimationKeys.RocketMouseDead, true)
  }

  onUpdate (_dt: number) {
    this.processSlide()
  }

  private processSlide () {
    if (this.stoppedSliding) return

    this.ctx.body.velocity.x *= .98
    if (this.ctx.body.velocity.x <= 5) {
      this.ctx.body.setVelocity(0, 0)
      this.stoppedSliding = true
    }
  }
}

export default DeadState
