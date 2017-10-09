function start() {
	time = 1;
	loadRoom(quarto);
}

function loadRoom (room) {
	console.log("Loading " + room.id);

	var currentDescription = room.baseDescription;
	currentDescription = updateDescription(room, currentDescription);
	currentDescription = createClickables(room, currentDescription);

	write("descriptionArea", currentDescription);
	button.clear();
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
			var clickable = '<span class="inspect" onclick="describe('+ key + ')">' + key + '</span>';
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
		console.log("invalid button type")
		}

			document.getElementById("buttonArea").innerHTML +=
	`<button onclick="${action}">${buttonObject.title}</button>`;
	},

	clear: function () {
	console.log("  Clearing buttons")
	write("buttonArea","");
	}
}

function write(ElementId, content) {
	document.getElementById(ElementId).innerHTML = content;
}