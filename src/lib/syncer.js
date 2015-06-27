
export default class Syncer {

  constructor ({ interval=1000, points=8, last=0 }) {
    this.interval = interval
    this.points = points
    this.last = last
    this._labels = new Map()
  }

  get points () {
    return this._points
  }

  set points (value) {
    this._points = parseInt(value, 10)
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
    let _ts = parseInt(ts, 10)
    this._prevLast = _ts
    this._shift = _ts <= 0 ? _ts : this._shift || 0
    this._last = parseInt((_ts <= 0 ? new Date().getTime() : _ts) / this.interval, 10) * this.interval + (_ts < 0 ? _ts : 0)
  }

  get labels () {
    return this._labels.get(this._points) || this._labels.set(this._points, Array.apply(0, new Array(this._points)).map((v, i) => this._points - 1 - i)).get(this._points)
  }

  sync () {
    this.last = this._prevLast > 0 ? this._prevLast : this._shift || 0
  }

}
