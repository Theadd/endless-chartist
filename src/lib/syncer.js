
export default class Syncer {

  constructor ({ interval=1000, points=8, last=0 }) {
    this._attaches = new Set()
    this.interval = interval
    this.points = points
    this.last = last
    this._labels = new Map()
  }

  get points () {
    return this._points
  }

  set points (value) {
    this._points = Math.max(parseInt(value, 10), 2)
  }

  get interval () {
    return this._interval
  }

  set interval (value) {
    this._interval = parseInt(value, 10)
  }

  get last () {
    return this._last
  }

  set last (ts) {
    let _ts = parseInt(ts, 10),
      now = new Date().getTime()
    if (_ts + (this._shift || 0) > now) {
      // Border limit reached
      // TODO: Stick on auto refresh
      this.last = this._prevLast = this._shift || 0
      return
    }
    this._prevLast = _ts
    this._shift = _ts <= 0 ? _ts : this._shift || 0
    this._last = parseInt((_ts <= 0 ? now : _ts) / this.interval, 10) * this.interval + (_ts < 0 ? _ts : 0)
  }

  get labels () {
    return this._labels.get(this._points) || this._labels.set(this._points, Array.apply(0, new Array(this._points)).map((v, i) => this._points - 1 - i)).get(this._points)
  }

  sync () {
    this.last = this._prevLast > 0 ? this._prevLast : this._shift || 0
  }

  propagate () {
    this.sync()

    for (let chart of this._attaches) {
      chart.refresh(false)
    }
  }

  attach (chart) {
    this._attaches.add(chart)
  }

  detach (chart) {
    return this._attaches.has(chart) && this._attaches.delete(chart)
  }

  /**
   *
   * @param x
   * @param y
   * @param alterMode when true, zooms in or out instead of scrolling
   * @param propagate
   */
  perform (x=0, y=0, alterMode=false, propagate=true) {
    if (x || y) {
      if (x !== 0) {
        if (alterMode) {
          this.points = this.points + parseInt(x / 100, 10)
        } else {
          this.last = this.last + parseInt(this.interval * x / 100, 10)
        }
      }
      if (y !== 0) {
        if (alterMode) {
          // TODO: Vertical zooming
        } else {
          // TODO: Vertical scrolling
        }
      }
      if (propagate) {
        this.propagate()
      }
    }
  }

}
