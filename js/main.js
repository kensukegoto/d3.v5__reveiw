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

const w = 800;
const w2 = w - m.r - m.l;
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
	data = data.map(function(year){
		
		const countries = year.countries.filter(function(country){
				var dataExists = (country.income && country.life_exp);
				return dataExists
		}).map(function(country){
				country.income = +country.income;
				country.life_exp = +country.life_exp;
				return country;       
		})

		const range = d3.extent(countries,d => d.population);
		return {
			countries,
			min:range[0],
			max:range[1],
			year: +year.year,
		}
	});


	let x = d3.scaleLog()
		.domain([300,150000])
		.range([0,w2])
	let y = d3.scaleLinear()
		.domain([0,90])
		.range([h2,0])
	let r = d3.scaleLinear()
		.domain([
			d3.min(data,d => d.min),
			d3.max(data,d => d.max)
		])
		.range([Math.pow(5,2) * Math.PI, Math.pow(50,2) * Math.PI]) // 直径： 最小 10px,最大100px


	let c = d3.scaleOrdinal(d3.schemePastel1)
		// .domain(["africa","americas","asia","europe"])

	const xAxis = g.append("g")
		.attr("transform","translate(0,"+h2+")")
		.call(
			d3.axisBottom(x)
				.tickValues([400,4000,40000])
				.tickFormat(d => d)
		
		)

	const yAxis = g.append("g")
		.call(d3.axisLeft(y))



	function update(data){

		const t = d3.transition()
			.duration(100);

		// r
		// .domain([
		// 	d3.min(data,d => d.population) / 5 * Math.PI,
		// 	d3.max(data,d => d.population) / 5 * Math.PI
		// ])

		let scat = g.selectAll("circle")
			.data(data,d => d.country)

		scat.exit().remove()

		scat.enter().append("circle")
			.merge(scat)
			.transition(t)
			.attr("cx",d => x(d.income))
			.attr("cy",d => y(d.life_exp))
			.attr("r",d => Math.sqrt(r(d.population)/Math.PI))
			.attr("fill",d => c(d.continent))
	}

	let idx = 0;
	let len = data.length;

	d3.interval(()=>{

		idx++;
		let newData = data[idx % len].countries;
		let year = data[idx % len].year;
		update(newData)

	},100)

	update(data[idx % len].countries);

})