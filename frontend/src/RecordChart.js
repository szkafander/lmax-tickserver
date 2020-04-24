import React, { Component } from 'react';
import LineChart from "./d3chart.js";


const width = 300;
const height = 300;


class RecordChart extends Component {

    chart = new LineChart(width, height);

    componentDidMount() {
        this._chart = this.chart.create(
            this._rootNode,
            this.props.value
        );
    }

    componentDidUpdate() {
        this.chart.update(
            this.props.value,
        );
    }

    componentWillUnmount() {
        chart.destroy(this._rootNode);
    }

    _setRef(componentNode) {
        this._rootNode = componentNode;
    }

    render() {
        return (
            <div className="recordchart-main" ref={this._setRef.bind(this)} />
        )
    }

}

export default RecordChart;
