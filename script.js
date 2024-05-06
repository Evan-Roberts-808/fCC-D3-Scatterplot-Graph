import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5/+esm";

let cycleData;
const width = 800;
const height = 600;
const padding = 40;
let xScale
let yScale

const container = document.getElementById('visual-container')
const tooltip = d3.select('#tooltip')
let svg = d3.select(container)
            .append('svg')
            .attr('class', 'visual')

svg.append("text")
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width / 2}, ${padding})`)
    .text("Doping in Professional Bicycle Racing")

svg.append('g')
    .attr('id', 'legend')

const legend = d3.select('#legend')
    
legend.append('g')
    .attr('transform', 'translate(600, 250)')
    .attr('id', 'legend-label')
    .append('text')
    .text('Riders With Allegations')

legend.append('rect')
.attr('transform', 'translate(775, 240)')
.attr('fill', 'blue')
.attr('width', '15')
.attr('height', '15')

legend.append('g')
    .attr('transform', 'translate(580, 300)')
    .attr('id', 'legend-label')
    .append('text')
    .text('Riders Without Allegations')

legend.append('rect')
.attr('transform', 'translate(775, 290)')
.attr('fill', 'orange')
.attr('width', '15')
.attr('height', '15')

    
const drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

const generateScales = () => {
    xScale = d3.scaleLinear()
                .range([padding, width - padding ])
                .domain([d3.min(cycleData, d => d['Year']) - 1, d3.max(cycleData, d => d['Year']) + 1])

    yScale = d3.scaleTime()
                .range([padding ,height - padding])
                .domain([d3.min(cycleData,d => new Date(d['Seconds'] * 1000)), d3.max(cycleData, d => new Date(d['Seconds'] * 1000))])
}

const drawPoints = () => {
    svg.selectAll('circle')
        .data(cycleData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '5')
        .attr('data-xvalue', d => d['Year'])
        .attr('data-yvalue', d => new Date(d['Seconds'] * 1000))
        .attr('cx', d => xScale(d['Year']))
        .attr('cy', d => yScale(new Date(d['Seconds'] * 1000)))
        .attr('fill', d => d['Doping'] != '' ? 'Blue' : 'Orange')
        .on('mouseover', (d) => {
            tooltip.transition()
                    .style('visibility', 'visible')
            if(d['Doping'] != '')
                {
                    tooltip.text(d['Year'] + ' - ' + d['Name'] + ' - ' + d['Time'] + ' - ' + d['Doping'])
                } else {
                    tooltip.text(d['Year'] + ' - ' + d['Name'] + ' - ' + d['Time'] + ' - ' + 'No Allegations')
                }
            tooltip.attr('data-year', d['Year'])
        })
        .on('mouseout', d => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        })
}

const generateAxis = () => {
    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height - padding) + ')')

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

let req = new XMLHttpRequest()
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
req.open('GET', url, true)
req.onload = () => {
    cycleData = JSON.parse(req.responseText)
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxis()
}
req.send()