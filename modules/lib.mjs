const random = (...args) => {
    if (args.length == 1) {
        const max = args[0]
        return Math.floor(Math.random() * max)
    } else {
        const min = args[0]
        const max = args[1]
        return Math.floor(Math.random() * (max - min)) + min
    }
}

const choose = (iter) => {
    return iter[random(iter.length)]
}

export {random, choose}