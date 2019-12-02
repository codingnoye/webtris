import {shuffle} from './lib.mjs'

class Bag {
    constructor () {
        this.blocks = this.makeBag()
    }
    makeBag = () => {
        return shuffle([0, 1, 2, 3, 4, 5, 6])
    }
    getBlock () {
        if (this.blocks.length == 0)
            this.blocks = this.makeBag()
        return this.blocks.pop()
    }
}
export {Bag}