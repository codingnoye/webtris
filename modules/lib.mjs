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

const shuffle = (iter) => {
    let i = iter.length
    while (i-- > 0) {
        const newind = random(i)
        const swap = iter[i]
        iter[i] = iter[newind]
        iter[newind] = swap
    }
    return iter
}

export {random, choose, shuffle}