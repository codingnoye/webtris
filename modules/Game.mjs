import {Board} from './Board.mjs'

class Game {
    constructor (ctx) {
        this.gameTick = 500
        this.board = new Board()
        this.ctx = ctx
        document.onkeydown = (e) => {
            const key = e.key
            this.onkeydown(key)
        }
        this.board.game = this
        this.score = 0
        this.status = 0 // 0 is ready, 1 is in-game, 2 is pause, 3 is end, 4 is pending
    }
    gameStart () {
        console.log('gs')
        this.board.init()
        this.board.draw(this.ctx)
        this.status = 1
        this.loop()
    }
    gameEnd () {
        setTimeout(() => {
            this.showMessage("Game Over!", "Press any key to restart!")
            this.status = 3
        }, this.gameTick)
        clearTimeout(this.timeout)
        this.status = 4
    }
    showMessage (msg, submsg) {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.rect(0, 0, 480, 880)
        ctx.fillStyle = "#00000033"
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.rect(0, 350, 480, 200)
        ctx.fillStyle = "#00000088"
        ctx.fill()
        ctx.closePath()

        ctx.fillStyle = "#fff"
        ctx.textAlign = "center"
        ctx.font = "bold 50px Arial"
        ctx.fillText(msg, 240, 430)
        ctx.font = "25px Arial"
        ctx.fillText(submsg, 240, 490)
    }
    onkeydown (key) {
        if (this.status == 1) {
            switch (key) {
                case 'a':
                    this.board.move(true)
                    break
                case 'd':
                    this.board.move(false)
                    break
                case 's':
                    this.board.nextTick()
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(()=>{this.loop()}, this.gameTick)
                    break
                case 'k':
                    this.board.rotate(false)
                    break
                case 'l':
                    this.board.rotate(true)
                    break
                case ' ':
                    this.board.drop()
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(()=>{this.loop()}, this.gameTick)
                    break
            }
            this.board.draw(this.ctx)
        } else if (this.status == 3) {
            this.gameStart()
        }
    }
    loop () {
        if (this.status == 1) {
            this.board.nextTick()
            this.board.draw(this.ctx)
            this.timeout = setTimeout(()=>{this.loop()}, this.gameTick)
        }
    }
}

export {Game}