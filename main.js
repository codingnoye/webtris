const canvas = document.getElementById('game')
const ctx = canvas.getContext("2d")
import {Game} from './modules/Game.js'

const game = new Game(ctx)
game.gameStart() 