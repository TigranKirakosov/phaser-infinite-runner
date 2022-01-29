import Phaser from "phaser"
import GameScene from "./scenes/game.scene"
import Preloader from "./scenes/preloader"

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1425,
	height: 640,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 400 },
      // debug: true
		}
	},
	scene: [Preloader, GameScene]
}

const game = new Phaser.Game(config)

export default game
