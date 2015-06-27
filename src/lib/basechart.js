import { Syncer } from '.'

export default class BaseChart {

  constructor (syncer=null) {
    this._series = new Map()
    this._syncer = syncer !== null ? syncer : new Syncer({})
  }

  add (serieName, serie) {
    this._series.set(serieName, serie)
  }

  get series () {
    this._syncer.sync()

    return [...this._series].map(([name, s]) => ({ name, data: s.use(this._syncer)}))
  }

  get labels () {
    return this._syncer.labels
  }

  get syncer () {
    return this._syncer
  }

  set syncer (value) {
    if (value && value instanceof Syncer) {
      this._syncer = value
    }
  }

  updateTo (graph, interval=1000) {
    setInterval(function () {
      graph.update({
        labels: this.labels,
        series: this.series
      })
    }.bind(this), interval)
  }

}
