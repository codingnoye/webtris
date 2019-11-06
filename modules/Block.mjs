const shapes = [
    [[-1, 0], [0, 0], [1, 0], [2, 0]], // I
    [[-1, 0], [0, 0], [1, 0], [1, 1]], // J
    [[-1, 0], [0, 0], [1, 0], [1, -1]], // L
    [[0, 0], [1, 0], [0, 1], [1, 1]], // O
    [[0, 0], [1, 0], [-1, 1], [0, 1]], // S
    [[-1, 0], [0, 0], [1, 0], [0, 1]], // T
    [[-1, 0], [0, 0], [0, 1], [1, 1]] // Z
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

class Block {
    constructor (type) {
        this.type = type
        this.shape = shapes[type]
        this.color = colors[type]
    }
    rotate (clockwise = true) {
        const newShape = []
        for (let i=0; i<4; i++) {
            const tile = this.shape[i]
            let newTile = []
            if (clockwise) {
                newTile = [-1 * tile[1], tile[0]]
            } else {
                newTile = [tile[1], -1 * tile[0]]
            }
            newShape.push(newTile)
        }
        this.shape = newShape
    }
    rotateTest (clockwise = true) {
        const newShape = []
        for (let i=0; i<4; i++) {
            const tile = this.shape[i]
            let newTile = []
            if (clockwise) {
                newTile = [-1 * tile[1], tile[0]]
            } else {
                newTile = [tile[1], -1 * tile[0]]
            }
            newShape.push(newTile)
        }
        return newShape
    }
}

export {Block, colors}