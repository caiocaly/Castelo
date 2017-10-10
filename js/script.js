function start() {
	time = 0;
	loadRoom(quarto);
}

function loadRoom (room) {
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
	var updatedText = text;
	var descriptions = room.additionalDescriptions;
	if (descriptions) {
		for (i=0; i < descriptions.length; i++){
			if (eval(descriptions[i].req)) {
				switch (descriptions[i].type) {
					case "add":
					updatedText += "<p>" + descriptions[i].content + "</p>";
				}

			}
		}
	}
	return updatedText;
}

var button = {
	construct: function (buttonArray) {
		for (i=0; i< buttonArray.length; i++){
			this.add(buttonArray[i]);
		}
	},

	add: function (buttonObject) {
		switch (buttonObject.type) {
		case "goTo":
			var action = "loadRoom("+ buttonObject.target +")";
			break;
		default:
		console.log("'"+ buttonObject.type + "' is not a valid button type")
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
	loadRoom(quarto);
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
	}, 2000)

}

function clear() {
	write('descriptionArea', "");
	write('complementArea', "");
	button.clear();
}