const shapes = [
    [[-1, 0], [0, 0], [1, 0], [2, 0]], // I
    [[-1, -1], [-1, 0], [0, 0], [1, 0]], // J
    [[-1, 0], [0, 0], [1, 0], [1, -1]], // L
    [[0, 0], [1, 0], [0, 1], [1, 1]], // O
    [[0, -1], [1, -1], [-1, 0], [0, 0]], // S
    [[-1, 0], [0, 0], [1, 0], [0, -1]], // T
    [[-1, -1], [0, -1], [0, 0], [1, 0]] // Z
]

const axises = [
    [-0.5, -0.5],
    [0, 0],
    [0, 0],
    [-0.5, -0.5],
    [0, 0],
    [0, 0],
    [0, 0]
]

const weights = [
    [-0.5, 0],
    [0, 0.5],
    [0, 0.5],
    [-0.5, -0.5],
    [0, 0.5],
    [0, 0.5],
    [0, 0.5]
]

const colors = [
    "#5DF8FD",
    "#3468FA",
    "#FAA630",
    "#FBEF3C",
    "#73E831",
    "#833C80",
    "#F24423"
]

const kicks = [
    [
        [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        [[0, 0], [1, 0], [1, -1], [0, 2], [-1, 2]],
        [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
    ],
    [
        [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
    ]
]
const ikicks = [
    [
        [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
        [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
        [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
        [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]]
    ],
    [
        [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
        [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
        [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
        [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]]
    ]
]

class Block {
    constructor (type) {
        this.type = type
        this.state = 0
        this.shape = shapes[type]
        this.color = colors[type]
        if (type == 0)
            this.kick = ikicks
        else
            this.kick = kicks
    }
    rotate (clockwise = true) {
        this.shape = this.rotateTest(clockwise)
        this.state = (clockwise ? (this.state + 1) % 4 : (this.state + 3) % 4)
    }
    rotateTest (clockwise = true) {
        const newShape = []
        const axis = axises[this.type]
        for (let i=0; i<4; i++) {
            const tile = this.shape[i]
            let newTile = []
            if (clockwise) {
                newTile = [-1 * (tile[1]+axis[1]) - axis[0], tile[0] + axis[0] - axis[1]]
            } else {
                newTile = [tile[1] + axis[1] - axis[0], -1 * (tile[0] + axis[0]) - axis[1]]
            }
            newShape.push(newTile)
        }
        return newShape
    }
    drawBlock (ctx, x, y, blockSize) {
        for (let i=0; i<4; i++) {
            const weight = weights[this.type]
            const nowx = this.shape[i][0] + weight[0]
            const nowy = this.shape[i][1] + weight[1]
            ctx.beginPath()
            ctx.rect(x - blockSize/2 + nowx * blockSize + 2, y - blockSize/2 + nowy * blockSize + 2, blockSize - 4, blockSize - 4)
            ctx.fillStyle = colors[this.type]
            ctx.fill()
            ctx.closePath()
        }
    }
}

export {Block, colors}