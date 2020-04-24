/* InstrumentTracker
--------------------------------------
maintains Buffers of time, ask and bid 
attrs:
  - bidVal (Buffer)
  - askVal (Buffer)
  - time (Buffer)
  - bidRoc (Buffer)
  - askRoc (Buffer)

methods:
  - update(data)
    updates buffers
    smooths roc vals */
class InstrumentTracker {

    constructor(instrument, capacity) {
        this.instrument = instrument;
        this.capacity = capacity;
        this.time = new Buffer(capacity, "time");
        this.askVal = new Buffer(capacity, "askVal");
        this.bidVal = new Buffer(capacity, "bidVal");
        this.askRoc = new Buffer(capacity - 1, "askRoc");
        this.bidRoc = new Buffer(capacity - 1, "bidRoc");
    }

    update(data) {

        let { time, ask, bid } = data
        let dt = time - this.time.getLast();

        // update time
        this.time.update(time);

        // only update ROC if there are more than 2 values in history
        // 1 already in the Buffer and another coming in now
        if (this.askVal.length > 0) {
            this.askRoc.update( (ask - this.askVal.getLast()) );
        }
        if (this.bidVal.length > 0) {
            this.bidRoc.update( (bid - this.bidVal.getLast()) );
        }

        // push current price to ask and bid
        this.askVal.update(ask);
        this.bidVal.update(bid);

    }

    getMessage() {
        return JSON.stringify({
            time: this.time.value,
            instrument: this.instrument,
            bidVal: this.bidVal.value,
            askVal: this.askVal.value,
            bidRoc: this.bidRoc.movingAverage,
            askRoc: this.askRoc.movingAverage
        })
    }

}


/* Buffer
-------------------------------------------------------------------
holds a fixed-size Deque of values and updates their moving average
attrs:
  - values (Deque)
  - capacity

methods:
  - update(value)
  - getLast() */
class Buffer {

    constructor(capacity, name) {
        this.name = name;
        this.capacity = capacity;
        this.values = [];
        this.movingAverage = 0.0;
        this._dropping = 0.0;
    }

    update(new_value) {
        
        this.values.push(new_value);
        let n = this.length;
        
        // this.movingAverage only gets updated if buffer is full or overflowing
        if (n === this.capacity) {

            // if buffer is just full, change is the average of values
            this.movingAverage = this.values.reduce((sum, current) => { return sum + current }) / n;

        } else if (n === this.capacity + 1) {

            // if buffer is overflowing, change is the moving average with a window size of this.capacity
            this._dropping = this.values.shift();
            this.movingAverage += (new_value - this._dropping) / n;

        }

        console.log(this);

    }

    get length() {
        return this.values.length;
    }

    get value() {
        return this.getLast();
    }

    getLast() {
        let n = this.length;
        if (n > 0) {
            return this.values[n - 1];
        } else {
            return null;
        }
    }

    getFirst() {
        if (this.length > 0) {
            return this.values[0];
        } else {
            return null;
        }
    }

}

module.exports = InstrumentTracker;
