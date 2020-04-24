import React, { Component } from 'react';
import RecordSquare from './RecordSquare.js';
import RecordChart from './RecordChart.js';

const address = "ws://localhost:65432/Echo";
const digits = 2;


class Record extends Component {

    websocket = new WebSocket(address);

    constructor(props) {
        super(props);

        // dynamically init state
        let listening = {};
        props.listening.forEach(instrument => {
            listening[instrument] = {
                instrument: instrument,
                time: 0.0,
                askVal: 0.0,
                askRoc: 0.0,
                bidVal: 0.0,
                bidRoc: 0.0
            };
        });
        this.state = listening;

    }

    // parses a message string and updates prices of the proper instrument in state
    dispatchMessage(message) {
        let data = JSON.parse(message.data);
        console.log(data);
        this.setState({ [data.instrument]: data });
    }

    // instantiates a parametrized Square component
    // function def needed to pass to this.props.listening.map
    createSquare(key, instrument, digits) {
        return (
            <RecordSquare 
                key={key} 
                instrument={instrument} 
                time={this.state[instrument].time} 
                askVal={this.state[instrument].askVal} 
                bidVal={this.state[instrument].bidVal} 
                askRoc={this.state[instrument].askRoc} 
                bidRoc={this.state[instrument].bidRoc} 
                digits={digits}>
            </RecordSquare>
        )
    }

    // init and set up websocket connection
    componentDidMount() {
        this.websocket.onopen = () => {
            console.log('Record connected.')
        }

        this.websocket.onclose = () => {
            console.log('Record disconnected.')
        }

        this.websocket.onmessage = message => {
            this.dispatchMessage(message)
        }
    }

    render() {
        return (

            <div className="record-main">
                
                Record, listening to {this.props.listening.join(", ")}

                {/* create squares from instrument list */}
                <div className="square-container">
                    {this.props.listening.map((instrument, key) => this.createSquare(key, instrument, digits))}
                </div>

                <div className="graph-container">
                    <RecordChart value={this.state.EURUSD.askRoc}></RecordChart>
                </div>
                
            </div>
        )
    }

}

export default Record;
