import IState from "~/lib/finite-state-machine/state"
import StateMachine from "~/lib/finite-state-machine/state-machine"
import { AnimationKeys } from "~/types"
import RocketMouse from "../rocket-mouse.char"
import { RocketMouseStates } from "../types"

type Context = RocketMouse

class RunningState implements IState<Context> {
  name = RocketMouseStates.Running
  sm!: StateMachine
  ctx!: Context

  onUpdate () {
    this.ctx.jetpack.applyThrust()

    this.ctx.jetpack.enableJetpack(this.ctx.cursors.space?.isDown)

    if (!this.ctx.cursors.space?.isDown) this.ctx.body.setAcceleration(0, 0)

    if (this.ctx.body.blocked.down) {
      this.ctx.mouse.play(AnimationKeys.RocketMouseRun, true)
    } else if (this.ctx.body.velocity.y > 0) {
      this.ctx.mouse.play(AnimationKeys.RocketMouseFall, true)
    }
  }
}

export default RunningState
