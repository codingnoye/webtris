import {Board} from './Board.mjs'
import {colors} from './Block.mjs'
const levelTick = [500, 350, 250, 200, 150, 100, 50, 30, 20, 10, 5, 3, 2, 1]
class Game {
    constructor (ctx) {
        this.blockSize = 40
        this.gameTick = 500
        this.board = new Board()
        this.ctx = ctx
        document.onkeydown = (e) => {
            const key = e.key
            this.onkeydown(key)
        }
        this.board.game = this
        this.score = 0
        this.level = 1
        this.status = 0 // 0 is ready, 1 is in-game, 2 is pause, 3 is end, 4 is pending
        this.toast = null
        this.toastLoop = null
    }
    gameStart () {
        console.log('gs')
        this.board.init()
        this.board.draw(this.ctx)
        this.score = 0
        this.level = 1
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
                    this.drawUI()
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(()=>{this.loop()}, this.gameTick)
                    break
                case 'k':
                    this.board.rotate(false)
                    break
                case 'l':
                    this.board.rotate(true)
                    break
                case 'j':
                    if (this.board.holdable) {
                        this.board.holdBlock()
                        this.drawUI()
                        clearTimeout(this.timeout)
                        this.timeout = setTimeout(()=>{this.loop()}, this.gameTick)
                    }
                    break
                case 'w':
                    this.board.drop()
                    this.drawUI()
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
            this.drawUI()
            this.timeout = setTimeout(()=>{this.loop()}, this.gameTick)
        }
    }
    drawBlock (ctx, x, y, block) {
        console.log(x, y, block)
        if (block != null) {
            for (let i=0; i<4; i++) {
                const nowx = block.shape[i][0]
                const nowy = block.shape[i][1]
                ctx.beginPath()
                ctx.rect(x + nowx * this.blockSize + 2, y + nowy * this.blockSize + 2, this.blockSize - 4, this.blockSize - 4)
                ctx.fillStyle = colors[block.type]
                ctx.fill()
                ctx.closePath()
            }
        }  
    }
    drawUI () {
        const ctx = this.ctx
        ctx.textAlign = "center"

        ctx.beginPath()
        ctx.rect(480, 0, 300, 880)
        ctx.fillStyle = "#444"
        ctx.fill()
        ctx.closePath()

        ctx.fillStyle = "#fff"
        ctx.font = "bold 25px Arial"
        ctx.fillText('Next', 630, 40)

        ctx.beginPath()
        ctx.rect(540, 60, 180, 180)
        ctx.fillStyle = "#666"
        ctx.fill()
        ctx.closePath()

        if (this.board.next)
            this.board.next.drawBlock(ctx, 630, 150, this.blockSize)

        ctx.fillStyle = "#fff"
        ctx.font = "bold 25px Arial"
        ctx.fillText('Hold', 630, 290)
        
        ctx.beginPath()
        ctx.rect(540, 310, 180, 180)
        ctx.fillStyle = "#666"
        ctx.fill()
        ctx.closePath()

        if (this.board.hold)
            this.board.hold.drawBlock(ctx, 630, 400, this.blockSize)

        ctx.fillStyle = "#fff"
        ctx.font = "bold 25px Arial"
        ctx.fillText('Score', 630, 540)
        ctx.font = "20px Arial"
        ctx.fillText(this.score, 630, 570)
        ctx.font = "bold 25px Arial"
        ctx.fillText('Level', 630, 620)
        ctx.font = "20px Arial"
        ctx.fillText(this.level, 630, 650)

        if (this.toast) {
            ctx.font = "bold 25px Arial"
            ctx.fillText(this.toast, 630, 700)
        }
    }
    getScore (score) {
        this.score += score
        this.level = 1 + Math.floor(this.score/1000)
        this.gameTick = levelTick[this.level-1]
    }
    setToast (msg, time) {
        if (this.toastLoop)
            clearInterval(this.toastLoop)
        this.toast = msg
        this.toastLoop = setInterval(()=>{this.toast = null}, time)
    }
}

export {Game}