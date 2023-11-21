const jsonURL = './scripts/classic_characters.json'
const request = new XMLHttpRequest()
request.open("get", jsonURL)
request.responseType = "json"
request.send()

let data;
let gameLoaded = false
let todayCharacter;

request.onload = () => {
    data = request.response
    if(data){
        gameLoaded = true
    }

    todayCharacter = data[data["today"]]
}

const attemptList = []

document.onkeyup = async function (e) {
    e.preventDefault()
    
    // if "enter" is pressed
    if (e.key === "Enter") {
        let attempt = document.getElementById("character_inp").value.toLowerCase()

        if(gameLoaded){
            if(!attemptList.includes(attempt)){
                await insertCharacter(data[attempt])
                attemptList.push(attempt)
            }
            
            document.getElementById("character_inp").value = ""
        }
    }
}

async function insertCharacter(character){
    const tries = document.getElementById("tries")

    tries.insertAdjacentHTML('beforeend', getCharacterDOM(character))
}

function getCharacterDOM(character){
    const { 
        URL, name, gender, 
        village, occupation, 
        clan, team, ranking,
        status, jinchuuriki
    } = character;

    const accuracy = {}

    if(gender == todayCharacter.gender){
        accuracy['gender'] = 'right'
    } else {
        accuracy['gender'] = ''
    }

    accuracy['village'] = checkGameArray('village', village)
    accuracy['occupation'] = checkGameArray('occupation', occupation)
    accuracy['clan'] = checkGameArray('clan', clan)
    accuracy['team'] = checkGameArray('team', team)

    if(jinchuuriki == todayCharacter.jinchuuriki){
        accuracy['jinchuuriki'] = 'right'
    } else {
        accuracy['jinchuuriki'] = ''
    }

    if(ranking == todayCharacter.ranking){
        accuracy['ranking'] = 'right'
    } else {
        accuracy['ranking'] = ''
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
            <div class="info ranking      ${accuracy['ranking']}"> ${(ranking)} </div>
            <div class="info status ${accuracy['status']}"> ${status} </div>
        </div>
    ` 
}

function checkGameArray(arrayName, char){
    if(typeof char != 'string' || typeof todayCharacter[arrayName] != 'string'){
        if(typeof char != 'string' && typeof todayCharacter[arrayName] != 'string'){
            // ambos array
            if(char == todayCharacter[arrayName]){
                return 'right'
            } else {
                char.forEach(i => {
                    if(todayCharacter[arrayName].includes(i)){
                        return 'half'
                    }
                })
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