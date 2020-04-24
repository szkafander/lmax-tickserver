import React, { Component } from 'react';


class WSLogger extends Component {

    ws = new WebSocket('ws://localhost:65432/Echo');

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('connected')
        }

        this.ws.onclose = () => {
            console.log('disconnected')
        }

        this.ws.onmessage = msg => {
            let data = JSON.parse(msg.data);
            console.log(data);
        }
    }

    render() {
        return (
            <div style={{display: "none"}}>Websocket logger</div>
        )
    }

}

export default WSLogger;
