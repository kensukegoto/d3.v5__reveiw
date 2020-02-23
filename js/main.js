/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

let interval = null;
let idx = 0;

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

const tip = d3.tip().attr("class","d3-tip")
	.html(d => {

		let text = "<strong>Country:</strong> <span style='color:red;'>"+d.country+"</span><br>";
		text += "<strong>Countinent:</strong> <span style='color:red;text-transfrom:capitalize;'>"+d.continent+"</span><br>";
		text += "<strong>Life Expectancy:</strong> <span style='color:red;'>"+d3.format(".2f")(d.life_exp)+"</span><br>";
		text += "<strong>GDP Per Capital:</strong> <span style='color:red;'>"+d3.format("$,.0f")(d.income)+"</span><br>";
		text += "<strong>Population:</strong> <span style='color:red;'>"+d3.format(",.0f")(d.population)+"</span>";
		return text;
	})
	
g.call(tip)

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
		.domain([130,150000])
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
		.domain(["africa","americas","asia","europe"])

	const xAxis = g.append("g")
		.attr("transform","translate(0,"+h2+")")
		.call(
			d3.axisBottom(x)
				.tickValues([400,4000,40000])
				.tickFormat(d => d)
		
		)

	const yAxis = g.append("g")
		.call(d3.axisLeft(y))

	const continent = ["africa","americas","europe","asia"];
	const legend = g.append("g")
			.attr("transform","translate("+ (w2 - 10) +","+ (h2 - 125) +")")
	continent.forEach((e,i)=>{
		let row = legend.append("g")
			.attr("transform","translate(0,"+ (i * 20) +")")
		row.append("rect")
			.attr("height",10)
			.attr("width",10)
			.attr("fill",c(e))
		row.append("text")
			.attr("x",-10)
			.attr("y",10)
			.attr("text-anchor","end")
			.style("text-transform","capitalize")
			.text(e)
	})



	function update(data){

		const continent = $("#continent-select").val();
		data = data.filter(d =>{
			if(continent === "all") return true;
			else return d.continent === continent;
		})

		// エリアセレクトした場合はdurationを0にするとアニメーション無しに出来る
		const t = d3.transition()
			.duration(100);

		let scat = g.selectAll("circle")
			.data(data,d => d.country)

		scat.exit().remove()

		scat.enter().append("circle")
			.attr("fill",d => c(d.continent))
			.on("mouseover",tip.show)
			.on("mouseout",tip.hide)
			.merge(scat)
			.transition(t)
			.attr("cx",d => x(d.income))
			.attr("cy",d => y(d.life_exp))
			.attr("r",d => Math.sqrt(r(d.population)/Math.PI))
			
	}


	function step(){
		idx++;
		$("#date-slider").slider("value",idx)
		$("#year").text(data[idx].year)
		let len = data.length;
		let newData = data[idx % len].countries;
		let year = data[idx % len].year;
		update(newData)
	}

	update(data[0].countries);

	$("#play-button")
		.on("click",function(){
			if($(this).text() === "Play"){
				$(this).text("Pause");
				interval = setInterval(step,100);
			}else{
				$(this).text("Play");
				clearInterval(interval);
			}
			
		})
	$("#reset-button")
		.on("click",function(){
			idx = 0;
			$("#date-slider").slider("value",idx)
			$("#year").text(data[idx].year)
			let len = data.length;
			let newData = data[idx % len].countries;
			update(newData)
		})

	$("#continent-select")
		.on("change",function(){
			let len = data.length;
			let newData = data[idx % len].countries;
			update(newData)
		})

	$("#date-slider").slider({
		min: 0,
		max: data.length - 1,
		step: 1,
		slide: (event,ui) => {
			idx = ui.value;
			$("#year").text(data[idx].year)
			let len = data.length;
			let newData = data[idx % len].countries;
			update(newData)
		}
	})

})