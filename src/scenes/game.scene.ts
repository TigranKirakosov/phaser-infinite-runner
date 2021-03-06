import Phaser from "phaser"
import LaserObstacle from "~/game/obstacles/laser/laser-obstacle"
import RocketMouse from "../game/characters/rocket-mouse.ts/rocket-mouse.char"
import { SceneKeys, TextureKeys } from "../types"

class GameScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite
  private mouseHole!: Phaser.GameObjects.Image

  private laserObstacle!: LaserObstacle

  private windows: Phaser.GameObjects.Image[] = []
  private bookcases: Phaser.GameObjects.Image[] = []

  private window1!: Phaser.GameObjects.Image
  private window2!: Phaser.GameObjects.Image
  private bookcase1!: Phaser.GameObjects.Image
  private bookcase2!: Phaser.GameObjects.Image

  constructor () {
    super(SceneKeys.Game)
  }

  create () {    
    const width = this.scale.width
    const height = this.scale.height

    this.background = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Background)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    this.mouseHole = this.add.image(
      Phaser.Math.Between(900, 1500), // x value
      501, // y value
      TextureKeys.MouseHole
    )

    this.window1 = this.add.image(
      Phaser.Math.Between(900, 1300),
      200,
      TextureKeys.Window1
    )

    this.window2 = this.add.image(
      Phaser.Math.Between(1600, 2000),
      200,
      TextureKeys.Window2
    )

    this.windows = [this.window1, this.window2]

    const mouse = new RocketMouse(this, width * 0.5, height - 30)
    this.add.existing(mouse)

    const body = mouse.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setVelocityX(350)

    this.cameras.main.startFollow(mouse, false, 1, 1, -500)
    this.cameras.main.setBounds(
      0, 0,
      Number.MAX_SAFE_INTEGER, height
    )

    this.bookcase1 = this.add.image(
      Phaser.Math.Between(2200, 2700),
      580,
      TextureKeys.Bookcase1
    )

    this.bookcase2 = this.add.image(
      Phaser.Math.Between(2900, 3400),
      580,
      TextureKeys.Bookcase2
    )

    this.bookcases = [this.bookcase1, this.bookcase2]

    this.laserObstacle = new LaserObstacle(this, 900, 100)
    this.add.existing(this.laserObstacle)

    this.physics.world.setBounds(
      0, 0,
      Number.MAX_SAFE_INTEGER, height - 30
    )

    this.physics.add.overlap(
      this.laserObstacle,
      mouse,
      this.handleOverlapLaser,
      undefined,
      this
    )
  }

  update (t: number, dt: number) {
    this.background.setTilePosition(this.cameras.main.scrollX)
    this.wrapMouseHole()
    this.wrapWindows()
    this.wrapBookcases()
    this.wrapLaserObstacle()
  }

  private wrapMouseHole () {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    if (this.mouseHole.x + this.mouseHole.width < scrollX) {
      this.mouseHole.x = Phaser.Math.Between(
        rightEdge + 100,
        rightEdge + 1000
      )
    }
  }

  private wrapWindows () {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    // multiply by 2 to add some more padding
    let width = this.window1.width * 2
    if (this.window1.x + width < scrollX) {
      this.window1.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 800
      )

      const overlap = this.bookcases.find(
        bc => Math.abs(this.window1.x - bc.x) <= this.window1.width
      )
      
      this.window1.visible = !overlap
    }

    width = this.window2.width

    if (this.window2.x + width < scrollX) {
      this.window2.x = Phaser.Math.Between(
        this.window1.x + width,
        this.window1.x + width + 800
      )

      const overlap = this.bookcases.find(
        bc => Math.abs(this.window2.x - bc.x) <= this.window2.width
      )
      
      this.window2.visible = !overlap
    }
  }

  private wrapBookcases () {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width

    // multiply by 2 to add some more padding
    let width = this.bookcase1.width * 2
    if (this.bookcase1.x + width < scrollX) {
      this.bookcase1.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 800
      )

      const overlap = this.windows.find(
        bc => Math.abs(this.bookcase1.x - bc.x) <= this.bookcase1.width
      )

      this.bookcase1.visible = !overlap
    }

    width = this.bookcase2.width

    if (this.bookcase2.x + width < scrollX) {
      this.bookcase2.x = Phaser.Math.Between(
        this.bookcase1.x + width,
        this.bookcase1.x + width + 800
      )

      const overlap = this.windows.find(
        bc => Math.abs(this.bookcase2.x - bc.x) <= this.bookcase2.width
      )

      this.bookcase2.visible = !overlap
    }
  }

  private wrapLaserObstacle () {
    const scrollX = this.cameras.main.scrollX
    const rightEdge = scrollX + this.scale.width
    const body = this.laserObstacle.body as Phaser.Physics.Arcade.StaticBody
    const width = body.width

    if (this.laserObstacle.x + width < scrollX) {
      this.laserObstacle.x = Phaser.Math.Between(
        rightEdge + width,
        rightEdge + width + 1000
      )
    
      this.laserObstacle.y = Phaser.Math.Between(0, 200)
      body.position.x = this.laserObstacle.x + body.offset.x
      body.position.y = this.laserObstacle.y
    }
  }

  private handleOverlapLaser (
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject,
  ) {
    (obj2 as RocketMouse).overlap(obj1)
  }
}

export default GameScene
