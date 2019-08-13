let GENRESTORE = {
  pickRandomGenre() {
    let randIndex = randomNum(0, 20)
    return this.genres[randIndex].name
  },
  getSelectedGenreId(genre){
    let index = this.genres.findIndex(x => x.name === genre)
    return this.genres[index].id
  }
}

let ARRAYS = {
  array1: [0, 2, 1, 3],
  array2: [0, 3, 2, 1],
  array3: [1, 0, 2, 3],
  array4: [1, 3, 2, 0],
  array5: [3, 1, 0, 2],
  array6: [2, 0, 1, 3],
  array7: [3, 0, 1, 2],
  array8: [2, 1, 3, 0],
  array9: [0, 2, 1, 3],
  array10: [1, 3, 0, 2],
  getRandomOrder() {
    let array = 'array' + randomNum(1, 11)
    return ARRAYS[array]
  }
}

let PAGE_RANGE = {
  twentyeight: 589,
  twelve: 335,
  sixteen: 428,
  thirtyfive: 1000,
  eighty: 399,
  ninetynine: 1000,
  eightteen: 1000,
  tensevenfiveone: 331,
  fourteen: 214,
  thirtysix: 130,
  twentyseven: 621,
  tenfourzerotwo: 400,
  ninesixfoureight: 246,
  tensevenfournine: 570,
  eightseveneight: 305,
  tensevensevenzero: 199,
  fiftythree: 673,
  tensevenfivetwo: 116,
  thirtyseven: 212
}

let GENREID_TOTEXT = {
  twentyeight: 28,
  twelve: 12,
  sixteen: 16,
  thirtyfive: 35,
  eighty: 80,
  ninetynine:  99,
  eightteen: 18,
  tensevenfiveone: 10751,
  fourteen: 14,
  thirtysix: 36,
  twentyseven: 27,
  tenfourzerotwo: 10402,
  ninesixfoureight: 9648,
  tensevenfournine: 10749,
  eightseveneight: 878,
  tensevensevenzero: 10770,
  fiftythree: 53,
  tensevenfivetwo: 10752,
  thirtyseven: 37
}

let currentScore
let posterNum
let genreId
let choices
let maxChoice
let correct
let answer_choices_array
let array



let ANSWER_CHOICES = {
  choice0: null,
  choice1: null,
  choice2: null,
  choice3: null,
  pickRandomChoice() {
    //console.log('maxChoice in pick rand coice', maxChoice)
    let randIndex = randomNum(0, maxChoice)
    //console.log('object debug randIndex', randIndex)
    let choice = choices[randIndex]
    //console.log('object degbug chocie', choice)
    choices.splice(randIndex, 1)
    let returnedChoice = ANSWER_CHOICES[choice]
    delete ANSWER_CHOICES[choice]
    maxChoice--
    return returnedChoice
  }
}

let SCORE = {
  one: 5,
  two: 3,
  three: 2
}

let MESSAGES = [
  {
    high: {
      easy: 'Good job, but everyone has seen these movies. Play again and consider making it a little harder!',
      challenging: 'You strike me as the kind of person who waits to see big movies to avoid crowds',
      hard: 'Maybe you are a legit movie buff, maybe you just have great eyesight.',
      difficult: 'There is more to life than movies. Maybe go outside?'
    }
  },

  {
    mid: {
      easy: 'Not bad but you can certainly do better!',
      challenging: 'Not bad for a first year film student',
      hard: 'You like movies, dont you Squidward. (Spongebob voice)',
      difficult: 'You were good kid real good, but as long as Im around youll always be second best see'
    }

  },

  {
    low: {
      easy: 'Do you even watch movies?',
      challenging: 'The book was better anyway right?',
      hard: 'Dont beat yourself up sport.',
      difficult: 'I mean has anyone seen these movies?'
    }
  }
]

function decreaseScore() {
  if(time >= 10){
    score = SCORE.one
  } else if (time >= 5 && time < 10){
      score = SCORE.two
  } else {
      score = SCORE.three
  }
  currentScore-= score
  $('.score').html(`${currentScore}`)
}

function upDateScore() {
  if(time >= 10){
    score = SCORE.one
  } else if (time >= 5 && time < 10){
      score = SCORE.two
  } else {
      score = SCORE.three
  }
  currentScore+= score
  $('.score').html(`${currentScore}`)
}

function handleAnswerSelect() {
  $('form').on('submit', function(event){

    event.preventDefault()
    let selected = $('input:checked').val()
    console.log('selected is', selected)
    if(selected === STORE[questionNum].correct) {
      upDateScore()

      //alert('correct!')
    } else {
      decreaseScore()
      //alert('correct')
    }

    questionNum++

    clearInterval(x)
    displayQuestion()
  })


}

let time
let x
function countDown() {

  time = 15
  //console.log('time at top of countdown is', time)
  $('.time').html(`${time}`)
  let blurAmount = 7.5
  $('.poster').css('filter', `blur(${blurAmount}px)` )

  x = setInterval(function(){
    time--
    if(time>0){
      //console.log('time in interval', time)
      $('.time').html(`${time}`)
      blurAmount = blurAmount - .5
      $('.poster').css('filter', `blur(${blurAmount}px)`)
    } else {
        showTimesUp()
        setTimeout(hideTimesUp, 2000)
        questionNum++
        clearInterval(x)
    }
  }, 1000)

}

function showTimesUp() {
  $('.times-up').show()
  $('.enter-button').prop('disabled', true)
}

function hideTimesUp(){
  $('.times-up').hide()
  $('.enter-button').prop('disabled', false)
  getMoviesById(genreId, selectedDiff)
}

function randomNum(min, max){
    let minNum = Math.ceil(min)
    let maxNum = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function QuestionObject(pic, choices, correct) {
  this.posterUrl = pic
  this.choices = choices
  this.correct = correct
}

let questionNum = 0

function displayQuestion() {
  posterNum++
  checkPosterNum()
  if(posterNum < 11 ) {
    $('form')[0].reset()
    $('.game-content').show()
    $('.poster-num').html(posterNum)
    countDown()
    let choiceElements = ["#choice00", "#choice11", "#choice22", "#choice33"]
    let choiceClassElements = ["#choice0", "#choice1", "#choice2", "#choice3"]
    let choice
    let choice_C_E

    let randomOrderArray = ARRAYS.getRandomOrder()

    if(questionNum < STORE.length) {

      for(j=3; j>=0; j--){
        let randIndex = randomNum(0, j)
        console.log('debug for randIndex is', randIndex)
        choice = choiceElements[randIndex]
        choice_C_E = choiceClassElements[randIndex]
        console.log('debug for choice is', choice)
        choiceElements.splice(randIndex, 1)
        choiceClassElements.splice(randIndex, 1)
        console.log('debug for choiceElements', choiceElements)
        $(`input${choice_C_E}`).attr('value', `${STORE[questionNum].choices[randomOrderArray[j]]}`)
        $(`label${choice}`).html(`${STORE[questionNum].choices[randomOrderArray[j]]}`)
        $('.poster').css('background-image', `url( ${STORE[questionNum].posterUrl} )`)
      }
    } else {
        showScore()
    }
  } else {
      clearInterval(x)
  }

}

function showScore() {
  $('.game-results').show()
  $('.game-content').hide()

  if(currentScore > 30) {

    switch(selectedDiff) {
      case "Easy":
      $('.game-results').html(`${MESSAGES[0].high.easy}`)
      break;

      case "Challenging":
      $('.game-results').html(`${MESSAGES[0].high.challenging}`)
      break;

      case "Hard":
      $('.game-results').html(`${MESSAGES[0].high.hard}`)
      break;

      case "Difficult":
      $('.game-results').html(`${MESSAGES[0].high.difficult}`)
      break;

      default:
      $('.game-results').html(`${MESSAGES[0].high.easy}`)

    }

  } else if (currentScore < 30 && currentScore > 15) {

    switch(selectedDiff) {
      case "Easy":
      $('.game-results').html(`${MESSAGES[1].mid.easy}`)
      break;

      case "Challenging":
      $('.game-results').html(`${MESSAGES[1].mid.challenging}`)
      break;

      case "Hard":
      $('.game-results').html(`${MESSAGES[1].mid.hard}`)
      break;

      case "Difficult":
      $('.game-results').html(`${MESSAGES[1].mid.difficult}`)
      break;

      default:
      $('.game-results').html(`${MESSAGES[0].mid.easy}`)


    }

  } else if (currentScore < 15 ) {
    switch(selectedDiff) {
      case "Easy":
      $('.game-results').html(`${MESSAGES[2].low.easy}`)
      break;

      case "Challenging":
      $('.game-results').html(`${MESSAGES[2].low.challenging}`)
      break;

      case "Hard":
      $('.game-results').html(`${MESSAGES[2].low.hard}`)
      break;

      case "Difficult":
      $('.game-results').html(`${MESSAGES[2].low.difficult}`)
      break;

      default:
      $('.game-results').html(`${MESSAGES[0].low.easy}`)
    }

  }
  $('.genre-select-container').show()
}

function generateStore(responsesArray) {
  console.log('responesarray', responsesArray)
  let array = []

  while(i<4) {
      //console.log('debug i',  i)
      let arrayNum = Math.floor(Math.random() * (4-1) + 1)
      //console.log('debug arrayNum', arrayNum)
      if(!array.includes(arrayNum)){
          array.push(arrayNum)
          //console.log('debug array', array)
          i++
      }
    }


  let randIndex = randomNum(0, 5)

  for(i=0; i<responsesArray.length; i++){
    let choices = []
    let correct = responsesArray[i].data.results[randIndex].title
    choices.push(correct)
    let response = responsesArray[i]
    console.log(`responsesArray${i}`, responsesArray[i] )
    let picPath = response.data.results[randIndex].poster_path
    let pic = `http://image.tmdb.org/t/p/w300/${picPath}`
    console.log('i should run once')
    for(j=1; j<4; j++){
      console.log('i should run 3 times')
      let randIndex = randomNum(6, 15)
      let response = responsesArray[j]
      let choice = response.data.results[randIndex].title
      choices.push(choice)
    }
    let question = new QuestionObject()
    question.posterUrl = pic
    question.choices = choices
    question.correct = correct
    STORE.push(question)
  }
  console.log('store contains', STORE)
  displayQuestion()
}

let randomChoices = []

async function getGenres(){
  try {
    let response = await axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US')
    GENRESTORE.genres = response.data.genres
  } catch(error) {
      console.error(error)
  }
  populateGenreSelect()
}

async function getMoviesById(genreId, selectedDiff){
  let percentage
  //console.log('getmoviesbyid running', getMoviesById)
  switch(selectedDiff) {
    case "Easy":
    percentage = .05
    break;

    case "Challenging":
    percentage = .30
    break;

    case "Hard":
    percentage = .55
    break;

    case "Difficult":
    percentage = 1
    break;

    default:
    percentage = .05
    break;
  }
  let key = Object.keys(GENREID_TOTEXT).find(key => GENREID_TOTEXT[key] === genreId)
  //console.log('debug getMoviesById key', key)
  let range = Math.round(PAGE_RANGE[key] * percentage)
  //console.log('debug getMoviesById  range', range)
  let randPage = Math.round(Math.random() * (range - 1) + 1)
  //console.log(' debug getMoviesById randPage', randPage);
  let responsesArray  = []
  try {

    for(i=0; i<10; i++){
      let response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${randPage + i}&region=US&with_genres=${genreId}`)
      responsesArray.push(response)
    }

    //console.log('debug getMoviesById response', response)
    generateStore(responsesArray)

  } catch (error) {
      console.error(error)
  }

}

let selectedDiff

function getSelectedGenre() {


  $('#genre-select').change(function(){
    let selectedGenre = $(this).children("option:selected").val()

    if(selectedGenre === "Random"){
      let genre = GENRESTORE.pickRandomGenre()
      console.log('random genre', genre)
      genreId = GENRESTORE.getSelectedGenreId(genre)
    } else {
        genreId = GENRESTORE.getSelectedGenreId(selectedGenre)
    }
  })

  $('#difficulty-select').change(function(){
    selectedDiff = $(this).children("option:selected").val()
  })

  $('.submit-genre').on('click', function(e){
    e.stopPropagation()
    $('.genre-select-container').hide()
    $('.stats').show()
    $('.game-results').hide()
    currentScore = 0
    console.log('currentScore', currentScore)
    posterNum = 0
    $('.score').html(`${currentScore}`)
    //console.log('genre button click')
    getMoviesById(genreId, selectedDiff)
  })
}

function populateGenreSelect() {
  //console.log('popselected running')
  let genreCount = GENRESTORE.genres.length
  //console.log('genreCount', genreCount)
  for(i=0; i<genreCount; i++){
    $('#genre-select').append(`<option value="${GENRESTORE.genres[i].name}">${GENRESTORE.genres[i].name}</option>`)
  }
  getSelectedGenre()
}

function startGame() {
  //console.log('start game')
  getGenres()
}

function showInstructions() {
  $('.game-over').hide()
  $('.stats').hide()
  $('.times-up').hide()
  $('.game-content').hide()
  $('.genre-select-container').hide()
  $('.game-results').hide()
  $('.start-game').on('click', function(e){
    e.stopPropagation()

    $('.genre-select-container').show()
    $('.instructions').hide()
    startGame()
  })
  handleAnswerSelect()
  checkPosterNum()

}

function checkPosterNum() {
  if (posterNum > 10) {
    $('.game-over').show()
    setTimeout(hideGameOver, 3000)
  }
}

function hideGameOver() {
  $('.game-over').hide()
  showScore()
}

$(showInstructions)
