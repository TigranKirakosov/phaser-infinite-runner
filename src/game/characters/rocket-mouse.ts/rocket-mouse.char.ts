import StateMachine from "~/lib/finite-state-machine/state-machine"
import RunningState from "./states/running.state"
import { AnimationKeys, TextureKeys } from "~/types"
import { RocketMouseStates } from "./types"
import LaserObstacle from "~/game/obstacles/laser/laser-obstacle"
import DeadState from "./states/dead.state"
import LifeComponent from "./components/life.component"
import JetpackComponent from "./components/jetpack.component"

class RocketMouse extends Phaser.GameObjects.Container {
  private stateMachine!: StateMachine
  private damagedAnimationTID: number = 0
  body!: Phaser.Physics.Arcade.Body
  mouse!: Phaser.GameObjects.Sprite
  life!: LifeComponent
  jetpack!: JetpackComponent
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.setupStateMachine()

    this.setupVisibleBody()
    this.setupPhysicsBody()
    this.setupPlayerControls()

    this.setupLifeComponent()
    this.setupJetpackComponent()
  }

	preUpdate (dt: number) {
		this.stateMachine.update(dt)
	}

  overlap (obj: Phaser.GameObjects.GameObject) {
    if (obj instanceof LaserObstacle) {
      this.takeDamage()
    }
  }

  isAlive () {
    return this.life.amount >= 0
  }

  private setupStateMachine () {
    this.stateMachine = new StateMachine(this, "RocketMouse")
    this.stateMachine
      .addState(new RunningState())
      .addState(new DeadState())
    this.stateMachine.setState(RocketMouseStates.Running)
  }

  private setupVisibleBody () {
    this.mouse = this.scene
      .add
      .sprite(0, 0, TextureKeys.RocketMouse)
      .setOrigin(.5, 1)
      .play(AnimationKeys.RocketMouseRun)

    this.add(this.mouse)
  }

  private setupLifeComponent () {
    this.life = new LifeComponent(3)
    this.life.onDecrease(() => {
      if (!this.isAlive()) {
        this.stateMachine.setState(RocketMouseStates.Dead)
        this.jetpack.enableJetpack(false)
      }
    })
  }

  private setupJetpackComponent () {
    this.jetpack = new JetpackComponent({
      attachTarget: this,
      scene: this.scene,
      onThrust: () => this.mouse.play(AnimationKeys.RocketMouseFly, true),
    })
  }

  private setupPhysicsBody () {
    this.scene.physics.add.existing(this)

    this.body.setSize(this.mouse.width - 30, this.mouse.height - 10)
    this.body.setOffset(this.mouse.width * -0.45, -this.mouse.height + 5)
  }

  private setupPlayerControls () {
    this.cursors = this.scene.input.keyboard.createCursorKeys()
  }

  private takeDamage () {
    if (this.life.isImmune() || !this.isAlive()) return
    this.playDamagedAnimation()
    this.life.decrease()
    this.life.setTempImmune()
  }

  private playDamagedAnimation () {
    clearInterval(this.damagedAnimationTID)
    let count = 0
    this.damagedAnimationTID = setInterval(() => {
      if (count >= 10) {
        clearInterval(this.damagedAnimationTID)
        return
      }
      this.mouse.visible = !this.mouse.visible
      count++
    }, 100)
  }
}

export default RocketMouse
