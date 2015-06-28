import React, { Component } from 'react'
import Chartist from 'chartist'

const displayName = 'Graph'
const propTypes = {
  type: React.PropTypes.string.isRequired,
  data: React.PropTypes.object.isRequired,
  options: React.PropTypes.object,
  responsiveOptions: React.PropTypes.array
}

export default class Graph extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate () {
    this.updateChart(this.props)
  }

  componentWillUnmount () {
    if (this.chartist) {
      try {
        this.chartist.detach()
      } catch (e) {}
    }
  }

  componentDidMount () {
    this.updateChart(this.props)
  }

  updateChart (config) {
    let { data, type='Line', options={}, responsiveOptions=[] } = config
    let event

    if (this.chartist) {
      this.chartist.update(data, options, responsiveOptions)
    } else {
      this.chartist = new Chartist[type](React.findDOMNode(this), data, options, responsiveOptions)

      if (config.listener) {
        for (event in config.listener) {
          if (config.listener.hasOwnProperty(event)) {
            this.chartist.on(event, config.listener[event])
          }
        }
      }
    }

    return this.chartist
  }

  update (data) {
    return (this.chartist || false) ? this.chartist.update(data) : null
  }

  render () {
    return React.DOM.div({ className: 'ct-chart' })
  }

}

Graph.displayName = displayName
Graph.propTypes = propTypes
