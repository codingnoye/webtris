import {random, choose} from './lib.mjs'
import {colors, Block} from './Block.mjs'
class Board {
    constructor () {
        this.width = 10;
        this.height = 22;
    }
    init () {
        this.hold = null
        this.hand = null
        this.handXY = []
        this.blocks = []
        for (let y=0; y<22; y++) {
            const line = []
            for (let x=0; x<10; x++) {
                line.push(-1)
            }
            this.blocks.push(line)
        }
        this.giveBlock()
    }
    end () {
        this.game.gameEnd()
    }
    giveBlock () {
        this.hand = new Block(random(7))
        if (this.placable(this.hand.shape, 4, 2)) {
            this.handXY = [4, 2]
        } else {
            this.hand = null
            this.end()
        }
    }
    placable (shape, x, y) {
        for (let i=0; i<4; i++) {
            const nowx = x + shape[i][0]
            const nowy = y + shape[i][1]
            if ((nowx<0) || (nowx>=this.width) || (nowy>=this.height)) {
                return false
            } else if (this.blocks[nowy][nowx] != -1) {
                return false
            }
        }
        return true
    }
    nextTick () {
        const x = this.handXY[0]
        const y = this.handXY[1]
        if (this.placable(this.hand.shape, x, y+1)) {
            this.handXY[1] = y+1
        } else {
            this.place()
        }
    }
    drop () {
        while (this.placable(this.hand.shape, this.handXY[0], this.handXY[1]+1)) {
            this.handXY[1] += 1
        }
        this.place()
    }
    move (isLeft) {
        const x = this.handXY[0] + (isLeft?-1:1)
        const y = this.handXY[1]
        if (this.placable(this.hand.shape, x, y)) {
            this.handXY[0] = x
            this.handXY[1] = y
        }
    }
    rotate (clockwise) {
        const x = this.handXY[0]
        const y = this.handXY[1]
        const shape = this.hand.rotateTest(clockwise)
        if (this.placable(shape, x, y)) {
            this.handXY[0] = x
            this.handXY[1] = y
            this.hand.rotate(clockwise)
        }
    }
    place () {
        const shape = this.hand.shape
        const type = this.hand.type
        const x = this.handXY[0]
        const y = this.handXY[1]
        for (let i=0; i<4; i++) {
            const nowx = x + shape[i][0]
            const nowy = y + shape[i][1]
            this.blocks[nowy][nowx] = type
        }
        let i = 0
        let removed = 0
        while (i<this.blocks.length) {
            if (this.check(i)) {
                this.blocks.splice(i, 1)
                removed += 1
                this.game.score += 1
            } else {
                i++
            }
        }
        while (removed > 0) {
            const newarr = [[]]
            let j = 0
            while (j++<this.width) newarr[0].push(-1)
            console.log(newarr)
            this.blocks = newarr.concat(this.blocks)
            removed -= 1
        }
        this.giveBlock()
    }
    check (y) {
        for (let x=0; x<this.width; x++) {
            if (this.blocks[y][x] == -1) {
                return false
            }
        }
        return true
    }
    draw (ctx) {
        ctx.beginPath()
        ctx.fillStyle = '#aaa'
        ctx.rect(0, 0, 480, 880)
        ctx.fill()
        ctx.closePath()
        for (let y=0; y<20; y++) {
            for (let x=0; x<10; x++) {
                ctx.beginPath()
                ctx.rect(40 + x * 40 + 2, 40 + y * 40 + 2, 40 - 4, 40 - 4)
                if (this.blocks[y][x] == -1) {
                    ctx.fillStyle = '#ccc'
                } else {
                    ctx.fillStyle = colors[this.blocks[y][x]]
                }
                ctx.fill()
                ctx.closePath()
            }
        }
        for (let y=2; y<22; y++) {
            for (let x=0; x<10; x++) {
                ctx.beginPath()
                ctx.rect(40 + x * 40 + 2, 40 + (y-2) * 40 + 2, 40 - 4, 40 - 4)
                if (this.blocks[y][x] == -1) {
                    ctx.fillStyle = '#ccc'
                } else {
                    ctx.fillStyle = colors[this.blocks[y][x]]
                }
                ctx.fill()
                ctx.closePath()
            }
        }
        if (this.hand != null) {
            for (let i=0; i<4; i++) {
                const x = this.handXY[0] + this.hand.shape[i][0]
                const y = this.handXY[1] + this.hand.shape[i][1]
                if (x<this.width && y<this.height && y>=2 && x>=0) {
                    ctx.beginPath()
                    ctx.rect(40 + x * 40 + 2, 40 + (y-2) * 40 + 2, 40 - 4, 40 - 4)
                    ctx.fillStyle = colors[this.hand.type]
                    ctx.fill()
                    ctx.closePath()
                }
            }
        }  
    }
}

export {Board}