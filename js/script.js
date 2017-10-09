function start() {
	time = 0;
	loadRoom(quarto);
}

function loadRoom (room) {
	console.log("Loading " + room.id);
	write("descriptionArea", room.baseDescription);
	button.construct(room.buttons);
}


var button = {
	construct: function (buttonArray) {
		this.clear();
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