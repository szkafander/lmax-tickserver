import * as d3 from 'd3';


// holds a running buffer of passed values and displays them in a time series
// pass data format: {time: , value: }
class LineChart {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.svg = null;
        this.buffer = [];
    }

    create(rootNode) {
        this.svg = d3.select(rootNode).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
        
    }

    update(value) {
        value *= 100;
        let y, h, c;
        if (value > 0.0) {
            y = 100 - value;
            h = value;
            c = "green";
        } else {
            y = 100;
            h = - value;
            c = "red";
        }
        this.svg.selectAll("rect")
            .transition()
            .duration(80)
            .attr("height", h)
            .attr("y", y)
            .attr("fill", c)
    }

    destroy(rootNode) {
        return null;
    } 

}

export default LineChart;
