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

const t = d3.transition().duration(750);

let svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", w)
  .attr("height",h);

let g = svg.append("g")
  .attr("transform","translate("+ m.l +","+ m.t +")");

let xLabel = g.append("text")
  .attr("x",width / 2)
  .attr("y",height + 50)
  .attr("text-anchor","middle")
  .attr("font-size","20px")
  .text("Month")

let yLabel = g.append("text")
  .attr("x",-(height / 2))
  .attr("y",-60)
  .attr("transform","rotate(-90)")
  .attr("text-anchor","middle")
  .attr("font-size","20px")
  .text("Revenue")


d3.json("./data/revenues.json").then(data =>{
  
  data.forEach( e => {
    e.revenue = + e.revenue;
    e.profit = + e.profit;
  });
  let x = d3.scaleBand()
    .range([0,width])
    .paddingInner(.3)
    .paddingOuter(.3)

  let y = d3.scaleLinear()
    .range([height,0])

  let xAxis = g.append("g")
    .attr("class","top axis")
    .attr("transform","translate(0,"+ height +")")

  let yAxis = g.append("g")
    .attr("class","top axis")
    
  let rects = g.selectAll("rect")

  let flag = true;

  d3.interval(()=>{
    update();
    flag = !flag;
  },1000)

  function update(){

    const which = flag ? "revenue" : "profit";

    x.domain(data.map(e => e.month))
    y.domain([0,d3.max(data,d=>d[which])])

    xAxis
      .transition(t)
      .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("text-anchor","middle")
  
    yAxis
      .transition(t)
      .call(
        d3.axisLeft(y)
        .tickFormat(d => "$" + d)
      )

    let rects = g.selectAll("rect")
      .data(data)

    rects.exit()
      .attr("fill","red")
      .transition(t)
      .attr("y",y(0))
      .attr("height",0)
      .remove()

  rects
    .transition(t)
    .attr("x",d => x(d.month))
    .attr("width",x.bandwidth)
    .attr("y",d => y(d[which]))
    .attr("height",d => (height - y(d[which])))

  rects.enter().append("rect")
    .attr("x",d => x(d.month))
    .attr("width",x.bandwidth)
    .attr("fill","grey")
    .attr("y",y(0))
    .attr("height",0)
    .transition(t)
    .attr("y",d => y(d[which]))
    .attr("height",d => (height - y(d[which])))
    

  // rects.update().append("rect")
  //   .attr("x",d => x(d.month))
  //   .attr("width",x.bandwidth)
  //   .attr("y",d => y(d[which]))
  //   .attr("height",d => (height - y(d[which])))
  //   .attr("fill","grey")
    
  yLabel.text(which.charAt(0).toUpperCase() + which.slice(1))

  }




});