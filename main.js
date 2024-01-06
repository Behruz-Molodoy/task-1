let instance = null

class Sentence {
  _sentence = ''
  _activeLetterIndex = 0

  constructor() {
    if (!instance) {
      return (instance = this)
    }
    return this
  }

  compareLetter(letter) {
    const isEqual = !Boolean(
      this._sentence[this._activeLetterIndex].localeCompare(letter)
    )

    return isEqual
  }

  get sentence() {
    return this._sentence
  }

  get activeLetterIndex() {
    return this._activeLetterIndex
  }

  set activeLetterIndex(index) {
    if (index <= this._activeLetterIndex) {
      return this._activeLetterIndex
    }
    return (this._activeLetterIndex = index)
  }

  async getNewRandomSentence() {
    const res = await fetch('https://api.quotable.io/random').then((response) =>
      response.json()
    )
    const randomSentence = res.content
    return (this._sentence = randomSentence)
  }
}

// -----------------------------------------------------------------

class GameStatus {
  constructor(nextStatus) {
    this._nextStatus = nextStatus
  }

  next() {
    return new this._nextStatus()
  }
}

class Start extends GameStatus {
  constructor() {
    super(Finish)
  }
}

class Finish extends GameStatus {
  constructor() {
    super(Finish)
    this.finish()
  }

  finish() {
    const $flag = document.querySelector('.finish-flag')
    $flag.style.display = 'block'
  }
}

class Game {
  constructor() {
    this.state = new Start()
  }

  nextState() {
    this.state.next()
  }
}

// --------------------------------------------

const $sentenceBlock = document.querySelector('.sentence')
const $car = document.querySelector('.car')
const $finishFlag = document.querySelector('.finish-flag')

const sentence = new Sentence()
const game = new Game()

sentence
  .getNewRandomSentence()
  .then((res) => ($sentenceBlock.textContent = res))

document.addEventListener('keypress', (e) => {
  if (sentence.activeLetterIndex === sentence.sentence.length - 1) {
    game.nextState()
  } else if (sentence.compareLetter(e.key)) {
    highlightLetter(++sentence.activeLetterIndex)
    moveCar()
  }
})

function moveCar() {
  $car.style.top = `calc(82.6vh - ${percentageCalculation(
    sentence.activeLetterIndex,
    sentence.sentence.length - 1
  )}%)`
}

function highlightLetter(activeLetterIndex) {
  const sentenceText = $sentenceBlock.textContent.trim()
  if (sentenceText.length >= activeLetterIndex) {
    const tenthLetter = sentenceText[activeLetterIndex]
    $sentenceBlock.innerHTML =
      sentenceText.slice(0, activeLetterIndex) +
      `<mark>${tenthLetter}</mark>` +
      sentenceText.slice(activeLetterIndex + 1)
  }
}

function percentageCalculation(a, b) {
  return (a * 100) / b
}
