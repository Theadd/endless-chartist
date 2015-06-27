import React, { Component } from 'react'
import { Graph, BaseChart, Serie, Syncer } from 'lib'

const displayName = 'Chart'
const propTypes = {
  settings: React.PropTypes.object.isRequired,
  chart: React.PropTypes.string.isRequired
}

export default class Chart extends Component {

  componentWillMount () {
    this.settings = this.props.settings.charts[this.props.chart]
    this.chart = new BaseChart(this.syncer)
    for (let { name='', provider='' } of this.settings.series) {
      this.add(name, this.props.settings.providers[provider])
    }

    if (typeof this.settings.options.axisX.labelInterpolationFnc === 'function') {
      this.labelXFnc = this.settings.options.axisX.labelInterpolationFnc.bind({})
      this.settings.options.axisX.labelInterpolationFnc = function (value) {
        return this.labelXFnc(value, this.syncer)
      }.bind(this)
    }
  }

  componentDidMount () {
    if (this.settings.delay > 0) {
      setTimeout(function () {
        this.chart.updateTo(this.refs.graph, this.settings.interval)
      }.bind(this), this.settings.delay)
    } else {
      this.chart.updateTo(this.refs.graph, this.settings.interval)
    }
  }

  shouldComponentUpdate () {
    return false
  }

  get syncer () {
    if (typeof this._syncer === 'object' && this._syncer !== null) return this._syncer
    if (this.settings === void 0) return null

    if (typeof this.settings.syncer === 'string') {
      if (!(this.props.settings.syncers[this.settings.syncer] instanceof Syncer)) {
        this.props.settings.syncers[this.settings.syncer] = new Syncer(this.props.settings.syncers[this.settings.syncer])
      }
      this._syncer = this.props.settings.syncers[this.settings.syncer]
    } else {
      if (!(this.settings.syncer instanceof Syncer)) {
        this.settings.syncer = new Syncer(this.settings.syncer)
      }
      this._syncer = this.settings.syncer
    }

    return this._syncer
  }

  set syncer (value) {
    this._syncer = value
    if (this.chart || 0) {
      this.chart.syncer = this._syncer
    }
  }

  add (name, provider) {
    if (!(provider instanceof Serie)) {
      if (!provider.initialized || false) {
        provider.initialized = true
        provider.instance = new Serie()
        provider.initialize(provider.instance)
      }
      this.chart.add(name, provider.instance)
    } else {
      this.chart.add(name, provider)
    }
  }

  render () {
    var data = {
      labels: this.chart.labels,
      series: this.chart.series
    }

    return (
      <div>
        <Graph ref='graph' type='Line' data={ data } options={ this.settings.options } responsiveOptions={ this.settings.responsiveOptions } />
      </div>
    )
  }

}

Chart.displayName = displayName
Chart.propTypes = propTypes
