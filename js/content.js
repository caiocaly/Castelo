/*
button types:
	> goTo: chama função loadRoom no comodo especificado em target

state operations:
	> add: adiciona um texto ao final da descrição base
	> replace: subsitui um pedaço da descrição base por outro
*/

var time;

var system = {
	sleep: ["<p>You feel so tired...<p>", "<p>So... Tired<p>", "....tired.", "<p>.. ..... ..</p>", ""]};

var quarto = {
	id: "quarto",
	baseDescription: 
		`<p>Seu quarto. Você não lembra de ter ido dormir, mas acaba de acordar 
		com o canto dos pássaros e o sol entrando pela _janela.</p>
		<p>Você se percebe sentado em sua _cama macia, a cabeça um 
		pouco avoada, como se tivesse dormido demais.</p>
		<p>O cômodo é grande e redondo, afinal, fica numa das torres reais. 
		Tudo parece estar no lugar... Sua _penteadeira, sempre organizada, é o charme
		do cômodo. </p>`,

	describeables: [
		{key: "_janela",
			description: "<p>Você sempre amou a janela enorme do quarto e a brisa que entra de manhã... \
			Mas...? Elas sempre tiveram esas barras de metal? </p>\
			<p>Pensando bem... Sim, sempre estiveram aí, claro.</p>",
			
		},

		{key: "_cama",
			description: `<p>Sua cama. É bem macia. Tão macia que as 
			vezes o sono parece te envolver num mundo à parte do real...`,
		},

		{key: "_penteadeira",
			description: `<p>Seu móvel preferido. Era da sua mãe...</p> 
			<p>Você já escreveu tanta coisa aqui nessa mesinha... 
			Tem algo de dramático em escrever olhando para um espelho</p>`,
			
		}
	],

	baseButtons: [
		{title: "Apenas um botão",
		type: "goTo",
		target: "quarto"},

		{req: "time != 0",
		title: "Apenas outro botão",
		type: "operations",
		results: [{type: "add", content:"Teste"}]

		}
	],

	states: [
		{req: "time === 1",
		operations: [
			{type: "add",
			content: "A terrible chill goes down your spine"},

			{type: "replace",
			content: ["Seu quarto.", "Você acorda no seu quarto."]}
		]}
	]
}