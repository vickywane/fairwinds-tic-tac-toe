const guessNumber = () => Math.floor(Math.random() * 9)

const GAME_WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

export const findUniqueRandomNumber = (exisitingArr) => {
    let rand = guessNumber();

    for (let i = 0; i < exisitingArr.length; i++) {
        if (exisitingArr[rand]) {
            rand = guessNumber()
        } else {
            return rand
        }
    }
}

export const getWinner = (existingArray) => {
    for (let i = 0; i <= 7; i++) {
        const winCombination = GAME_WINNING_COMBINATIONS[i];

        let a = existingArray[winCombination[0]];
        let b = existingArray[winCombination[1]];
        let c = existingArray[winCombination[2]];

        if (a === b && b === c) {
            return { winningPlayer: a, matchingTiles: [winCombination[0], winCombination[1], winCombination[2]] }
        }
    }
}