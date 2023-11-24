var originalArr = null;
var arr = null;
var filteredSuggestions = null;

function setArr(list){
	originalArr = list.sort()
	arr = originalArr
}

function getFilteredSuggestions(){
	return filteredSuggestions
}

function suggestNames() {
	const input = document.getElementById("character_inp").value.toLowerCase();
	
	const filteredNames = arr.filter(function (name) {
		return name.toLowerCase().startsWith(input) && name !== input;
	});

	updateSuggestions(filteredNames);
	if(filteredNames.length > 0){
		filteredSuggestions = filteredNames
	} else {
		filteredSuggestions = null
	}
}

function updateSuggestions(suggestions) {
	const suggestionsList = document.getElementById("suggestions");
	suggestionsList.innerHTML = "";

	suggestions.forEach(function (suggestion) {
		const listItem = document.createElement("li");
		listItem.textContent = suggestion;
		listItem.onclick = function () {
			document.getElementById("character_inp").value = suggestion;
			// This removes the suggestion from the list 
			arr = arr.filter(function (name) {
				return name !== suggestion;
			});
			suggestionsList.innerHTML = "";
		};
		suggestionsList.appendChild(listItem);
	});
}

function updateSuggestionsBasedOnAttempts(attemptList){
	attemptList.forEach(item => {
		arr = originalArr.filter(suggestion => suggestion !== item)
	})

	document.getElementById("suggestions").innerHTML = ""
	attemptList.forEach(item => {
		const li = document.createElement("li")
		li.textContent = item

		document.getElementById("suggestions").appendChild(li)
	})
}

document.getElementById("character_inp")
	.addEventListener("input", suggestNames);

document.getElementById("character_inp")
	.addEventListener("focusout", event => {
		if(event.target.classList.contains('active')){
			event.target.classList.remove('active')
		}
	})

document.addEventListener("keyup", () => {
	const input = document.getElementById("character_inp");
	const suggestions = document.getElementById("suggestions");

	if(input.value != ""){
		if(!suggestions.classList.contains('active')){
			suggestions.classList.add('active')
		}
	} else {
		if(suggestions.classList.contains('active')){
			suggestions.classList.remove('active')
		}
	}
});