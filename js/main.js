/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const m = {
	t: 20,
	r: 20,
	b: 100,
	l: 100
};

const w = 600;
const w2 = 600 - m.r - m.l;
const h = 400;
const h2 = h - m.t - m.b;

let svg = d3.select("#chart-area")
	.append("svg")
	.attr("height",h)
	.attr("width",w)

let g = svg.append("g")
	.attr("transform","translate("+m.l+","+m.t+")")

d3.json("data/data.json").then(function(data){
	
	// データ整形
	data.forEach(d => {
		d.countries = d.countries.filter(c => {
			let flg = Object.keys(c).filter(k => {
				return c[k] === null;
			});
			return flg.length === 0;
		})
	});



	let x = d3.scaleLog()
		.domain([300,150000])
		.range([0,w2])
	let y = d3.scaleLinear()
		.domain([0,90])
		.range([h2,0])
	let r = d3.scaleLinear()
		.range([5,25])


	function update(data){

		r
		.domain([
			d3.min(data,d => d.population) / 5 * Math.PI,
			d3.max(data,d => d.population) / 5 * Math.PI
		])

		let scat = g.selectAll("circle")
			.data(data)

		scat.exit().remove()

		scat
			.attr("cx",d => x(d.income))
			.attr("cy",d => y(d.life_exp))
			.attr("r",d => r(d.population))
			.attr("fill","blue")

		scat.enter().append("circle")
			.attr("cx",d => x(d.income))
			.attr("cy",d => y(d.life_exp))
			.attr("r",d => r(d.population))
			.attr("fill","blue")
	}

	let idx = 0;
	let len = data.length;

	d3.interval(()=>{

		let newData = data[idx % len].countries;
		let year = data[idx % len].year;
		update(newData)
		idx++;

	},100)





	
	
})