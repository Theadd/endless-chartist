
export default class Serie {

  constructor () {
    this._data = new Map()
  }

  add ({ fill=false, points=[], interval=1000, last=0 }) {
    let _ts = parseInt(last, 10),
      _last = parseInt((_ts <= 0 ? new Date().getTime() : _ts) / interval, 10) * interval + (_ts < 0 ? _ts : 0)

    let [dataLast, dataPoints] = this._data.get(interval) || [null, null]

    if (dataLast === null) {
      // There was no previous data with provided interval
      // TODO: preprocess fill mode
      this._data.set(interval, [_last, points])
    } else {
      // Write points to their corresponding position
      let timeSpan = interval * (points.length - 1),
        dataTimeSpan = interval * (dataPoints.length - 1),
        _first = _last - timeSpan,
        dataFirst = dataLast - dataTimeSpan

      if (_first < dataFirst) {
        // Provided points are older than the current first point (the oldest one currently stored)
        let shiftBy = parseInt((dataFirst - _first) / interval, 10),
          previous = []

        previous[shiftBy - 1] = 0
        dataPoints = previous.concat(dataPoints)
        dataFirst = _first
      }
      // TODO: Check that Math.abs()
      let pos = Math.abs(parseInt((dataFirst - _first) / interval, 10)),
        i = -1,
        len = points.length
      // Write new points
      while (++i < len) {
        // TODO: preprocess fill mode
        dataPoints[pos + i] = points[i] || (points[i] === 0 ? 0 : null)
      }
      // Write data to interval (dataLast isn't a reference)
      this._data.set(interval, [dataLast < _last ? _last : dataLast, dataPoints])
    }

    return this
  }

  use (syncer) {
    // TODO: Add something like a 'having' argument to retrieve newer points only
    let interval = syncer.interval,
      lastPoint = syncer.last,
      numPoints = syncer.points,
      res = []
    let [last, points] = this._data.get(interval) || [null, null]

    if (last !== null) {
      let pos = parseInt((lastPoint - last) / interval, 10)

      if (pos - numPoints >= 0) {
        res[numPoints - 1] = null
      } else {
        if (Math.abs(pos - numPoints) > points.length) {
          // Prepend points that doesn't exist (with undefined or null value)
          let previous = []
          previous[Math.abs(pos - numPoints) - (points.length + 1)] = null
          res = previous.concat(points.slice(0, numPoints - previous.length))
        } else {
          res = points.slice(pos - numPoints, pos >= 0 ? void 0 : pos)
        }

        if (pos > 0) {
          // Append points that doesn't exist (with undefined or null value)
          let concat = []
          concat[pos - 1] = null
          res = res.concat(concat)
        }
      }
    } else {
      res[numPoints - 1] = null
    }

    return res
  }

}
