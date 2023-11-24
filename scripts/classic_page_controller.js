const jsonURL = './scripts/classic_characters.json'
const request = new XMLHttpRequest()
request.open("get", jsonURL)
request.responseType = "json"
request.send()

var data;
let gameLoaded = false
let todayCharacter;

request.onload = () => {
    data = request.response
    if(data){
        gameLoaded = true
    }

    const keys = Object.keys(data)
    todayCharacter = data[Utils.choice(keys)]
    console.log(todayCharacter.name)

    setArr(keys)
}

const attemptList = []

document.onkeyup = async function (e) {
    e.preventDefault()

    // if "enter" is pressed
    if (e.key === "Enter") {
        let attempt = document.getElementById("character_inp").value.toLowerCase().replace(" ", "")

        if(gameLoaded){
            if(attempt == ""){
                return
            }

            if(!attemptList.includes(attempt)){
                if(Object.keys(data).includes(attempt)){
                    await insertCharacter(data[attempt])
                    attemptList.push(attempt)
                    
                    if (data[attempt] == todayCharacter) {
                        playerWins()
                    }
                } else {
                    const suggestionsList = getFilteredSuggestions()
                    if(attempt.length < suggestionsList[0].length){
                        await insertCharacter(data[suggestionsList[0]])
                        attemptList.push(suggestionsList[0])
                        updateSuggestionsBasedOnAttempts(attemptList)

                        if (data[suggestionsList[0]] == todayCharacter) {
                            playerWins()
                        }
                    }
                }
            }
            
            document.getElementById("character_inp").value = ""
            document.getElementById("character_inp").focus()
            document.getElementById("suggestions").classList.remove("active")
        }
    }
}

async function insertCharacter(character){
    const tries = document.getElementById("tries")

    tries.insertAdjacentHTML('afterbegin', getCharacterDOM(character))
}

function getCharacterDOM(character){
    const { 
        URL, name, gender, 
        village, occupation, 
        clan, team, ranking,
        status, jinchuuriki
    } = character;

    const accuracy = {}

    if(gender == todayCharacter['gender']){
        accuracy['gender'] = 'right'
    } else {
        accuracy['gender'] = ''
    }

    accuracy['village'] = compareCharacters('village', village)
    accuracy['occupation'] = compareCharacters('occupation', occupation)
    accuracy['clan'] = compareCharacters('clan', clan)
    accuracy['team'] = compareCharacters('team', team)
    accuracy['ranking'] = compareCharacters('ranking', ranking)

    if(jinchuuriki == todayCharacter.jinchuuriki){
        accuracy['jinchuuriki'] = 'right'
    } else {
        accuracy['jinchuuriki'] = ''
    }

    if(status == todayCharacter.status){
        accuracy['status'] = 'right'
    } else {
        accuracy['status'] = ''
    }

    return `
        <div class="character">
            <img src="${URL}" alt="${name}" />
            <div class="info gender ${accuracy['gender']}"> ${gender} </div>
            <div class="info village      ${accuracy['village']}"> ${(typeof village != 'string') ? village.join(" <br /> ") : village} </div>
            <div class="info occupation   ${accuracy['occupation']}"> ${(typeof occupation != 'string') ? occupation.join(" <br /> ") : occupation} </div>
            <div class="info clan         ${accuracy['clan']}"> ${(typeof clan != 'string') ? clan.join(" <br /> ") : clan} </div>
            <div class="info team         ${accuracy['team']}"> ${(typeof team != 'string') ? team.join(" <br /> ") : team} </div>
            <div class="info jinchuuriki  ${accuracy['jinchuuriki']}"> ${(jinchuuriki) ? "Jinchuuriki" : "Não jinchuuriki"} </div>
            <div class="info ranking      ${accuracy['ranking']}"> ${(typeof ranking != 'string') ? ranking.join(" <br /> ") : ranking} </div>
            <div class="info status ${accuracy['status']}"> ${status} </div>
        </div>
    ` 
}

function compareCharacters(arrayName, char){
    if(typeof char != 'string' || typeof todayCharacter[arrayName] != 'string'){
        if(typeof char != 'string' && typeof todayCharacter[arrayName] != 'string'){
            // ambos array
            if(JSON.stringify(char) == JSON.stringify(todayCharacter[arrayName])){
                return 'right'
            } else {
                if(char.some(el => todayCharacter[arrayName].includes(el))){
                    return 'half' 
                } else {
                    return ''
                }
            }
        } else {
            if(typeof char != 'string'){
                // char array
                if(char.includes(todayCharacter[arrayName])){
                    return 'half'
                } else {
                    return ''
                }
            } else {
                // todayCharacter array
                if(todayCharacter[arrayName].includes(char)){
                    return 'half'
                } else {
                    return ''
                }
            }
        }
    } else {
        if(char == todayCharacter[arrayName]){
            return 'right'
        } else {
            return ''
        }
    }
}

function playerWins(){
    // TODO: Create animation
    // TODO: Create visual feedback
    alert('You won!') // temporary
}

const Utils = {
    choice: function(array){
        return array[Math.floor(Math.random() * array.length)]
    }
}