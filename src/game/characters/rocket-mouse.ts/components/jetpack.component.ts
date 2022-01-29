type Config = {
  attachTarget: Phaser.GameObjects.Container
  scene: Phaser.Scene
  onThrust(): void
}

class JetpackComponent {
  private onThrust: Function
  private enabled: boolean = false
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager
  private attachTarget: Phaser.GameObjects.Container
  private physicsBody: Phaser.Physics.Arcade.Body
  private flamesEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  constructor (config: Config) {
    this.onThrust = config.onThrust
    this.attachTarget = config.attachTarget
    this.physicsBody = config.attachTarget.body as Phaser.Physics.Arcade.Body

    this.particles = config.scene.add
      .particles("flames")
      .setY(-40)
      .setX(-47)

    this.flamesEmitter = this.particles
      .createEmitter({
        speed: .1,
        scale: { min: .35, max: .7 },
        blendMode: Phaser.BlendModes.ADD,
        on: false,
        gravityY: 2000,
        gravityX: 2000,
        lifespan: 120,
      })
      .startFollow(this.attachTarget)
  }

  applyThrust () {
    if (this.enabled) {
      this.physicsBody.setAcceleration(50, -1000)
      this.onThrust()
      this.flamesEmitter.start()
    } else {
      this.flamesEmitter.stop()
    }
  }

  enableJetpack (enabled: boolean) {
    this.enabled = enabled
  }
}

export default JetpackComponent
