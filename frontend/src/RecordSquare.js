import React, { Component } from 'react';


function timestampToDate(timestamp) {
    let date = new Date(timestamp * 1000);
    return date.getHours() + ":" + ("0" + date.getMinutes()).substr(-2) + ":" + ("0" + date.getSeconds()).substr(-2) + "." + ("00" + date.getMilliseconds()).substr(-3);
}

class RecordSquare extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="recordsquare-main">
                <div className="recordsquare-name">
                    {this.props.instrument}
                </div>
                <div className="recordsquare-time">
                    {timestampToDate(this.props.time)}
                </div>
                <div className="recordsquare-bid">
                    ask: {this.props.bidVal.toFixed(this.props.digits)} ({this.props.bidRoc.toFixed(this.props.digits)})
                </div>
                <div className="recordsquare-ask">
                    bid: {this.props.askVal.toFixed(this.props.digits)} ({this.props.askRoc.toFixed(this.props.digits)})
                </div>
            </div>
        )
    }

}

export default RecordSquare;
