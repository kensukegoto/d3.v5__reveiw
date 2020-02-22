/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/


const m = {
  t: 20,
  l: 100,
  r: 20,
  b: 60
};
const w = 600;
const h = 400;
const width = w - m.r - m.l;
const height = h - m.t - m.b;


let svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", w)
  .attr("height",h);

let g = svg.append("g")
  .attr("transform","translate("+ m.l +","+ m.t +")");

g.append("text")
  .attr("x",width / 2)
  .attr("y",height + 50)
  .attr("text-anchor","middle")
  .attr("font-size","20px")
  .text("Month")

g.append("text")
  .attr("x",-(height / 2))
  .attr("y",-60)
  .attr("transform","rotate(-90)")
  .attr("text-anchor","middle")
  .attr("font-size","20px")
  .text("Revenue")


d3.json("./data/revenues.json").then(data =>{
  
  data.forEach( e => {
    e.revenue = + e.revenue;
    e.revenue = + e.revenue;
  });

  let x = d3.scaleBand()
    .domain(data.map(e => e.month))
    .range([0,width])
    .paddingInner(.3)
    .paddingOuter(.3)

  let y = d3.scaleLinear()
    .domain([0,d3.max(data,d=>d.revenue)])
    .range([height,0])


  let xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class","top axis")
    .attr("transform","translate(0,"+ height +")")
    .call(xAxisCall)
      .selectAll("text")
      .attr("text-anchor","middle")

  let yAxisCall = d3.axisLeft(y)
    .tickFormat(d => "$" + d)
    
  g.append("g")
    .attr("class","top axis")
    .call(yAxisCall)

  let rects = g.selectAll("rect")
    .data(data)

  rects.enter().append("rect")
    .attr("x",d => x(d.month))
    .attr("width",x.bandwidth)
    .attr("y",d => y(d.revenue))
    .attr("height",d => (height - y(d.revenue)))
    .attr("fill","grey")




});