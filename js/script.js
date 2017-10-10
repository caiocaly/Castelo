function start() {
	time = 0;
	loadRoom(quarto);
	currentRoom, currentRoomId;
}

function loadRoom (room) {
	currentRoom = room;
	console.log("Loading " + room.id);
	clear()

	var currentDescription = room.baseDescription;
	currentDescription = updateDescription(room, currentDescription);
	currentDescription = createClickables(room, currentDescription);
	write("descriptionArea", currentDescription);
	button.construct(room.baseButtons);
	console.log(room.id + " loaded");
}

function createClickables (room, text) {
	console.log("  Creating clickables for " + room.id)
	var updatedText = text;

	for (i=0; i < room.describeables.length; i++){
		var key = room.describeables[i].key;
		console.log("    Checking describeable for " + key);

		if (updatedText.indexOf(key) !== -1){
			console.log("    " + key + " was found in the string")
			let value = key.replace("_", "");
			let describeThis = `describe('${key}')`;
			var clickable = `<span class="inspect" onclick="${describeThis}"> ${value} </span>`;
			updatedText = updatedText.replace(key, clickable);
		} else { console.log ("    " + key + "not found in the string")}
	}
	return updatedText;
}

function updateDescription (room, text) {
	console.log("Updating description");
	var updatedText = text;
	var states = room.states;
	for (i=0; i < states.length; i++){
		console.log("  Evaluating state " + i + ": " + states[i].req)
		if (eval(states[i].req)) {
			console.log("  state " + i + " is true")
			var operations = states[i].operations;
			for (j=0; j < operations.length; j++){
				switch (operations[j].type) {
					case "add":
						console.log("    executing operation " + j + " (add)")
						updatedText += "<p>" + operations[j].content + "</p>";
						break;
					case "replace":
						console.log("    operation " + j + " (replace)")
						updatedText = updatedText.replace(operations[j].content[0], operations[j].content[1]);
						break;
					default:
						console.log("     operation [" + j + "]'s type is not valid")
				}
			}
		} else { console.log ("  state " + i + " is false")}
	}
	console.log("Description update is complete");
	return updatedText;
}

var button = {
	construct: function (buttonArray) {
		for (i=0; i< buttonArray.length; i++){
			this.add(buttonArray[i]);
		}
	},

	add: function (buttonObject) {
		if (buttonObject.req) {
			if (eval(buttonObject.req)) {} else { return}
		};
		switch (buttonObject.type) { 
		case "goTo":
			var action = "loadRoom("+ buttonObject.target +")";
			break;
		}

		let buttonClass;
		buttonObject.class ? buttonClass = buttonObject.class : 
		buttonClass = "standart"

			document.getElementById("buttonArea").innerHTML +=
	`<button class="${buttonClass}" onclick="${action}">${buttonObject.title}</button>`;
	},

	clear: function () {
	console.log("  Clearing buttons")
	write("buttonArea","");
	}
}

function describe(x) {
	loadRoom(currentRoom);
	for (i=0; i < quarto.describeables.length; i++){
		if (x === quarto.describeables[i].key) {
				document.getElementById('complementArea').innerHTML = quarto.describeables[i].description;
				button.construct(quarto.describeables[i].buttons);
			}
	}
}

function write(ElementId, content) {
	document.getElementById(ElementId).innerHTML = content;
}

function addText(ElementId, content) {
	document.getElementById(ElementId).innerHTML += content;
}

function reset() {
	clear();
	i = 0;
	register = setInterval(function(){
		addText('complementArea', system.sleep[i]);
		i++;
		if (i==system.sleep.length) {
			clearInterval(register);
			time++;
			loadRoom(quarto);
		};
	}, 1000)

}

function clear() {
	write('descriptionArea', "");
	write('complementArea', "");
	write('actionArea', "");
	button.clear();
}