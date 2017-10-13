function start() {
	loadRoom(quarto);
}

function reload (){
	loadRoom(ROOM);
	build.describe(CONTEXT);
}

function loadRoom (room) {
	ROOM = room;
	console.log("Loading " + room.id);
	clear.all();
	build.description(room);
	button.construct(room.baseButtons, 'base');
	console.log(room.id + " loaded");
}

function createClickables (room, string) {
	console.log("  Creating clickables for " + room.id);
	var updatedText = string; 
	// esse for itera pelas posições de describeables
	for (i=0; i < room.describeables.length; i++){
		var key = room.describeables[i].key; //armazena a key do describeable em key
		console.log("    Checking describeable for " + key);

		if (updatedText.indexOf(key) !== -1){ //checa se a key aparece no texto fornecido
			console.log("    " + key + " was found in the string")
			let value = key.replace("_", ""); //tira o indicador de describeable da key para a valueariável value
			let describeThis = `build.describe('${key}')`; //chave para chamado da função describe
			var clickable = `<span class="inspect" onclick="${describeThis}">${value}</span>`;
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
		let buttonClass, action;
		let caseCheck = function (validType){
			x = buttonObject.type.indexOf(validType);
			return (x !== -1)
		}

		if (buttonObject.req) {
			if (eval(buttonObject.req)) {} else {return}
		};
 
		switch (targetDiv) { //where to render the button
			case "base":
			targetDiv = "buttonArea";
			break;

			case "context":
			targetDiv = "ctxButtonArea";
			break;

			default:
			console.log("button target div not valid");
		}

		switch (true) { //what is the buttons function
			case caseCheck("text") === true:
			action = "operation.overwrite('actionArea', '" + buttonObject.content  + "')";
			break;

			case caseCheck("goTo") === true:
			action = "loadRoom(" + buttonObject.target + ")";
			break;

			default:
			console.log("invalid button type");
		}
		
		buttonObject.class ? buttonClass = buttonObject.class : buttonClass = "standart";


		document.getElementById("buttonArea").innerHTML +=
		`<button class="${buttonClass}" onclick="${action}">${buttonObject.title}</button>`;
	},

	clear: function () {
	console.log("  Clearing buttons")
	operation.overwrite("buttonArea","");
	}
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
		operation.write('complementArea', system.sleep[i]);
		i++;
		if (i==system.sleep.length) {
			clearInterval(register);
			TIME++;
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
	describe: function (objectKey) {
		loadRoom(ROOM);
		clear.action();
	console.log(`called describe function for ${objectKey} key`)
	const roomDescribeables = quarto.describeables;
	for (i=0; i < roomDescribeables.length; i++){
		if (objectKey === roomDescribeables[i].key) {
			let describeable = roomDescribeables[i].description;
			switch (typeof describeable) {
				case "string":
				var text = describeable;
				break;

				case "object" :
				for (i=0; i<describeable.length; i++) {
					if (eval(describeable[i].req) === true){
						var text = describeable[i].content;
					}
				}
				break;
			}

			document.getElementById('complementArea').innerHTML = text;
			CONTEXT = objectKey;
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

function updateVariable (x){
	TIME = x;	
}