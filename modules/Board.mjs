import {colors, Block} from './Block.mjs'
import {Bag} from './Bag.mjs'
class Board {
    constructor () {
        this.width = 10;
        this.height = 22;
    }
    init () {
        this.bag = new Bag()
        this.hand = null
        this.handXY = []
        this.infinity = false
        this.infTimeout = null

        this.hold = null
        this.holdable = true

        this.next = new Block(this.bag.getBlock())
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
        this.hand = this.next
        if (this.placable(this.hand.shape, 4, 2)) {
            this.handXY = [4, 2]
        } else {
            this.hand = null
            this.end()
        }
        this.next = new Block(this.bag.getBlock())
    }
    holdBlock () {
        if (this.hold == null) {
            this.hold = new Block(this.hand.type)
            this.giveBlock()
        } else {
            const swap = this.hold
            this.hold = new Block(this.hand.type)
            this.hand = swap
            if (this.placable(this.hand.shape, 4, 2)) {
                this.handXY = [4, 2]
            } else {
                this.hand = null
                this.end()
            }
        }
        this.holdable = false
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
        } else if (!this.infinity) {
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
            this.infinite()
        }
    }
    infinite () {
        if (this.infTimeout) 
            clearInterval(this.infTimeout)
        this.infinity = true
        this.infTimeout = setTimeout(()=>{this.infinity = false}, this.game.gameTick)
    }
    rotate (clockwise) {
        const x = this.handXY[0]
        const y = this.handXY[1]
        const shape = this.hand.rotateTest(clockwise)
        const kick = this.hand.kick
        const state = this.hand.state
        let i = 0
        while (i<5) {
            const kx = kick[(clockwise?0:1)][state][i][0]
            const ky = kick[(clockwise?0:1)][state][i][1]
            if (this.placable(shape, x + kx, y + ky)) {
                this.handXY[0] = x + kx
                this.handXY[1] = y + ky
                this.hand.rotate(clockwise)
                break
            }
            i++
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
            } else {
                i++
            }
        }
        switch (removed) {
            case 1:
                this.game.getScore(100)
                break;
            case 2:
                this.game.getScore(300)
                break;
            case 3:
                this.game.getScore(500)
                break;
            case 3:
                this.game.getScore(1000)
                this.game.setToast("Tetris!!", 1500)
                break;
        }
        while (removed > 0) {
            const newarr = [[]]
            let j = 0
            while (j++<this.width) newarr[0].push(-1)
            this.blocks = newarr.concat(this.blocks)
            removed -= 1
        }
        this.holdable = true
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
        ctx.fillStyle = '#888'
        ctx.rect(0, 0, 480, 880)
        ctx.fill()
        ctx.closePath()
        for (let y=0; y<20; y++) {
            for (let x=0; x<10; x++) {
                ctx.beginPath()
                ctx.rect(40 + x * 40 + 2, 40 + y * 40 + 2, 40 - 4, 40 - 4)
                if (this.blocks[y][x] == -1) {
                    ctx.fillStyle = '#aaa'
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
                    ctx.fillStyle = '#aaa'
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
                    ctx.rect(this.game.blockSize + x * this.game.blockSize + 2, this.game.blockSize + (y-2) * this.game.blockSize + 2, this.game.blockSize - 4, this.game.blockSize - 4)
                    ctx.fillStyle = colors[this.hand.type]
                    ctx.fill()
                    ctx.closePath()
                }
            }
        }  
    }
}

export {Board}