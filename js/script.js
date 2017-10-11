function start() {
	time = 0;
	loadRoom(quarto);
	currentRoom;
}

function loadRoom (room) {
	currentRoom = room;
	console.log("Loading " + room.id);
	clear.all();

	build.description(room);
	button.construct(room.baseButtons, 'base');

	
	console.log(room.id + " loaded");
}

function createClickables (room, string) {
	console.log("  Creating clickables for " + room.id)

	//pega a string de texto q é alimentada e verifica nos clickables do cômodo fornecido]
	var updatedText = string; 

	// esse for itera pelas posições de describeables
	for (i=0; i < room.describeables.length; i++){
		var key = room.describeables[i].key; //armazena a key do describeable em key
		console.log("    Checking describeable for " + key);

		if (updatedText.indexOf(key) !== -1){ //checa se a key aparece no texto fornecido
			console.log("    " + key + " was found in the string")
			let value = key.replace("_", ""); //tira o indicador de describeable da key para a variável value
			let describeThis = `build.describe('${key}')`; //chave para chamado da função describe
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
	construct: function (buttonArray, targetDiv) {
		for (i=0; i< buttonArray.length; i++){
			this.add(buttonArray[i],targetDiv);
		}
	},

	add: function (buttonObject, targetDiv) {
		if (buttonObject.req) {
			if (eval(buttonObject.req)) {} else { return}
		};
		switch (buttonObject.type) { 
			case "goTo":
				var action = "loadRoom("+ buttonObject.target +")";
				break;
			case "text":
				break;
		}

		switch (targetDiv) {
			case "base":
			var div = "buttonArea";
			break;

			case "context":
			var div = "ctxButtonArea";
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
	operation.overwrite("buttonArea","");
	}
}

function addText(ElementId, content) {
	document.getElementById(ElementId).innerHTML += content;
}

var clear = {
	description: function() {operation.overwrite('descriptionArea', "")},
	complement: function() {operation.overwrite('complementArea', "")},
	action: function () {operation.overwrite('actionArea', "")},
	all: function () {
		this.description();
		this.complement();
		this.action();
		button.clear();
	}
}


function reset() {
	clear.all();
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

var build = {
	description: function (room) {
		var currentDescription = room.baseDescription;
		currentDescription = updateDescription(room, currentDescription);
		currentDescription = createClickables(room, currentDescription);
		operation.overwrite("descriptionArea", currentDescription);
	},
	describe: function (key) {
	for (i=0; i < quarto.describeables.length; i++){
		if (key === quarto.describeables[i].key) {
			let describeable = quarto.describeables[i];
			switch (typeof describeable) {
				case "string":
				var text = describeable.description;
				break;

				case "object" :
				for (i=0; i<describeable.description.length; i++) {
					if (eval(describeable.description[i].req) === true){
						var text = describeable.description[i].content;
					}
				}
				break;
			}

				document.getElementById('complementArea').innerHTML = text;
			}
	}
	}
}

var operation = {
	overwrite: function (ElementId, content) {
	document.getElementById(ElementId).innerHTML = content;
	},
	write: function (ElementId, content) {
	document.getElementById(ElementId).innerHTML += content;
	},
	replace: function (ElementId, substring, content) {
		let newContent = document.getElementById(ElementId).innerHTML;
		newContent = newContent.replace(substring, content);
		this.overwrite(ElementId, newContent);
	}
}	