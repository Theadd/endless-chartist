import { Syncer } from '.'

export default class BaseChart {

  constructor (syncer=null) {
    this._graph = false
    this._series = new Map()
    this.syncer = syncer !== null ? syncer : new Syncer({})
  }

  add (serieName, serie) {
    this._series.set(serieName, serie)
  }

  get series () {
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
      if (this._syncer && this._syncer instanceof Syncer) {
        this._syncer.detach(this)
      }
      this._syncer = value
      this._syncer.attach(this)
    }
  }

  updateTo (graph, interval=1000) {
    this._graph = graph
    setInterval(function () {
      this.refresh(true)
    }.bind(this), interval)
  }

  refresh (sync=true) {
    if (this._graph !== false) {
      (sync === true && (this._syncer.sync() || 0)) || this._graph.update({
        labels: this.labels,
        series: this.series
      })
    }
  }

}
