import React, { Component } from 'react'
import { VirtualGraph, BaseChart, Serie, Syncer } from 'lib'

const displayName = 'VirtualChart'
const propTypes = {
  settings: React.PropTypes.object.isRequired,
  chart: React.PropTypes.string.isRequired
}

export default class VirtualChart extends Component {

  constructor (props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleWheel = this.handleWheel.bind(this)
    this.state = {}
  }

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
      this.forceUpdate()
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

    var other = {
      tabIndex: "0",
      onKeyDown: this.handleKeyDown,
      onClick: this.handleClick,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      onWheel: this.handleWheel
    }

    return (
      <div { ...other } ref='wrapper'>
        <VirtualGraph ref='graph' type='Line' data={ data } options={ this.settings.options } responsiveOptions={ this.settings.responsiveOptions } />
      </div>
    )
  }

  handleClick (e) {
    console.dir(e)
    //React.findDOMNode(this.refs.wrapper)
  }

  handleFocus (e) {
    // console.dir(e)
  }

  handleBlur (e) {
    // console.dir(e)
  }

  handleWheel ({ deltaX, deltaY, ctrlKey }) {
    this.syncer && this.syncer.perform(deltaX, deltaY, ctrlKey)
  }

  handleKeyDown (e) {
    let { which, ctrlKey, shiftKey } = e
    let speed = (ctrlKey ? 60 : 1) * (shiftKey ? 5 : 1),
      direction = 1

    if (this.syncer) {
      switch (which) {
        // Scroll left/right
        case 37: direction = -1
        case 39: this.syncer.perform(direction * 100 * speed)
          break
        // Zoom in/out
        case 107: direction = -1
        case 109: this.syncer.perform(direction * 100 * speed, 0, true)
          if (ctrlKey && !shiftKey) {
            e.preventDefault()
          }
          break
        // Pause
        case 32: this.chart && (this.chart.pause = !this.chart.pause)
          break
        case 16: break  // Shift key
        case 17: break  // Ctrl key
        default:
          console.log(e.type, which, e.timeStamp, ctrlKey, shiftKey)
      }
    }
  }

}

VirtualChart.displayName = displayName
VirtualChart.propTypes = propTypes
