let SharedFilms = {
  film0: null,
  film1: null,
  finalCredits() {
    let credits = this.film0.filter(function(val) {
      return SharedFilms.film1.indexOf(val) != -1;
    });
    return credits
  }
}


let CreditsStore =  {
  cast: [],
  crew: [],
  mergedCredits() {
       let credits = []
       console.log('CreditsStore contains:' + 'cast:' + this.cast + 'crew:' + this.crew)

       if(this.crew.length < 1 && this.cast.length > 0) {
       //console.log('crew null cast not null')
         for(i=0; i<this.cast.length; i++){
           credits.push(this.cast[i].title)
         }
       }
       if(this.cast.length < 1 && this.crew.length > 0){
       //console.log('cast null crew not null')
         for(i=0; i<this.crew.length; i++){
           credits.push(this.crew[i].title)
         }
       }
       if(this.cast.length > 0 && this.crew.length > 0){
       //console.log('both not null')
         let castTitles = []
         let crewTitles = []
         for(i=0; i<this.cast.length; i++){
           castTitles.push(this.cast[i].title)
         }
         for(i=0; i<this.crew.length; i++){
           crewTitles.push(this.crew[i].title)
         }
         let array = castTitles.concat(crewTitles)
       //console.log('array in CreditsStore', array)
         credits = array.concat()
       //console.log('credits after concat in credisStore', credits)
         for(i=0; i<credits.length; ++i){
           for(j=i+1; j<credits.length; ++j){
             if(credits[i] === credits[j]) {
               credits.splice(j--, 1)
             //console.log('credits after slpice creditsstore', credits  )
             }
           }
         }
       }
     return credits
     }
}

function displayResults(numResults) {
  for(i=0; i<numResults.length; i++){
    $('.results').append(`<div class="result-item-container"></div>`)
  }
  let itemContainers = $('.results').children()
  itemContainers.each(function(index, item){
    let film = "film" + index
    $(item).html(`<img src='http://image.tmdb.org/t/p/w185/${FilmInfo[film].posterPath}' height="278px">
    <div class="film-info"><span class="block-span title">${FilmInfo[film].title}</span>
    <span class="block-span tag">${FilmInfo[film].tagline}</span>
    <span class="block-span overview">${FilmInfo[film].overview}</span>
    <span class="block-span date">${FilmInfo[film].releaseDate}</span>
    </div>`)
  })
}

let FilmInfo = new Object()

async function getFilmInfo(ids) {
  console.log('getFilmInfo ids', ids)
  const url = 'https://api.themoviedb.org/3/movie/'
  let results = SharedFilms.finalCredits()

  try {
    for(i=0; i<results.length; i++){
      const response = await axios.get(url.concat(ids[i], '?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US'))
      let film = "film" + i
      console.log('film in getfilminfo', film)
      console.log(`reponse data check: "overview": ${response.data.overview}
                         "posterPa51ath": ${response.data.poster_path}
                        "releaseDate": ${response.data.release_date}
                            "tagline": ${response.data.tagline}
                              "title": ${response.data.title}`)

      FilmInfo[film] = {"overview": response.data.overview,
                         "posterPath": response.data.poster_path,
                        "releaseDate": response.data.release_date,
                            "tagline": response.data.tagline,
                              "title": response.data.title }

    }

  } catch (error) {
      console.error(error)
  }

  displayResults(ids)
}

function CreditObj(title, id){
  this.title = title
  this.id = id
}


async function getCredits(ids) {
  console.log('getcredits running ids is', ids)
  const url = 'https://api.themoviedb.org/3/person/'

  const responses = []
  const titles = []
  try {
    console.log('try block of getcredits')
    console.log('ids length', ids.length)
    console.log('ids', ids)
    for(a=0; a<ids.length; a++){
      console.log('running for loop')
      //console.log('Object.assign(dest, source) is', a)
      //console.log('ids length', ids.length)
      CreditsStore.cast = []
      CreditsStore.crew = []
      const response = await axios.get(url.concat(ids[a], '/movie_credits?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US'))
      let castItem = response.data.cast
      let crewItem = response.data.crew

      console.log('debug getCredits response', response)

      if(castItem.length > 0) {
        console.log('running for cast item if')
        for(j=0; j<castItem.length; j++){
          CreditsStore.cast.push(new CreditObj(castItem[j].title, castItem[j].id))
        }
      }

      if(crewItem.length > 0) {
        console.log('runnning crew item if')
        for(x=0; x<crewItem.length; x++){
          CreditsStore.crew.push(new CreditObj(crewItem[x].title, crewItem[x].id))
        }

      }
      let film = 'film' + a
      SharedFilms[film] = CreditsStore.mergedCredits()
      console.log('shared films', SharedFilms)
      console.log('credits store merged function', CreditsStore.mergedCredits())
    }

  } catch (error) {
      console.error(error)
  }

  getFilmIds()

}

function getFilmIds() {
  let finalCredits = SharedFilms.finalCredits()
  console.log('getFilmId finalCredits', finalCredits)
  let ids =[]
  console.log('getFilmIds CreditsStore cast length', CreditsStore.cast.length)
  if(CreditsStore.cast.length > 0){
    for(i=0; i<CreditsStore.cast.length; i++){
      for(j=0; j<finalCredits.length; j++){
        if(CreditsStore.cast[i].title === finalCredits[j]){
          let id = CreditsStore.cast[i].id
          if(ids.includes(id) === false){
            ids.push(id)
            console.log('getFilmIds ids cast', ids)

          }
        }
      }
    }
  }

  if(CreditsStore.crew.length > 0){
    console.log('getFilmIds CreditsStore crew length', CreditsStore.crew.length)

    for(i=0; i<CreditsStore.crew.length; i++){
      for(j=0; j<finalCredits.length; j++){
        if(CreditsStore.crew[i].title === finalCredits[j]){
          let id = CreditsStore.crew[i].id
          if(ids.includes(id) === false){
            ids.push(id)
            console.log('getFilmIds ids crew', ids)

          }
        }
      }
    }
  }
  console.log('getFilmIds final ids', ids)
  getFilmInfo(ids)
}

async function getActorIds(terms) {
  let url = `https://api.themoviedb.org/3/search/person?api_key=3e9d342e0f8308faebfe8db3fffc50e7&language=en-US&page=1&include_adult=false&query=`

  const responses = []

  try {
    for(i=0; i<terms.length; i++){
      const response = await axios.get(url.concat(terms[i]))
      if(response.data.results.length < 1) {
        alert('Search returned no results')
      }
      console.log('debug getActorIds response', response)
      responses.push(response.data.results[0].id)
    }
  } catch (error) {
    console.error(error)
  }
  console.log('responses is', responses)
  return responses
}


function getActors() {
  $('.search').on('click', function(e){
    $('.results').empty()
    let actors
    actors = $('.input').val().split(',')
    console.log('actors length in getactors', actors.length)
    console.log('actors in getactors', actors)
    console.log('actors[1] length', actors[1].length)
    if(actors.length != 2) {
      alert('You must search for only 2 names')
    } else if (actors.length === 2 && actors[0].length === 0 || actors[1].length === 0) {
      alert('you must search for only 2 names')
    } else {
        getActorIds(actors).then(function(result){
          getCredits(result)
        })
      }
    })

  }



$(getActors)
