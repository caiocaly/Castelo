	time = 1;


var quarto = {
	id: "quarto",
	baseDescription: "<p>Esse é apenas um cômodo genérico. Nada de especial.<p><p>fim</p>",

	describeables: [
		{
			key: "apenas",
			description: "Uau, é uma palavra",
			buttons: [
				{title: "Botão contextual",
				type: "goTo",
				target: "quarto"},

				{title:"Botão contextual 2",
				type: "goTo",
				target: "quarto"}
			]
		}
	],

	baseButtons: [
		{title: "Apenas um botão",
		type: "goTo",
		target: "quarto"}
		],

	additionalDescriptions: [
		{req: "time === 1",
		type: "add",
		content: "A terrible chill goes down your spine"}
		]


}