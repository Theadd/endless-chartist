import React, { Component } from 'react'
import { Graph, BaseChart, Serie, Syncer } from 'lib'
import Chartist from 'chartist'

const displayName = 'CustomChart'

let rate = 80
let s3mask = [null, 1, 2, 3, null, 5, 6, 7, 8, 9, null]

export default class CustomChart extends Component {

  componentWillMount () {
    this.series1 = new Serie()
    this.series2 = new Serie()
    this.series3 = new Serie()
    this.addSomethingToSeries()

    setInterval(function () {
      this.addSomethingToSeries()
    }.bind(this), rate)

    this.syncer = new Syncer({ points: 21, interval: rate })
    this.chart = new BaseChart(this.syncer)
    this.chart.add('series-1', this.series1)
    this.chart.add('series-2', this.series2)
    this.chart.add('series-3', this.series3)

    this.options = {
      series: {
        'series-1': {
          lineSmooth: Chartist.Interpolation.simple(),
          showArea: false,
          showPoint: false
        },
        'series-2': {
          showLine: false,
          showArea: true,
          areaBase: 8,
          showPoint: false
        },
        'series-3': {
          lineSmooth: Chartist.Interpolation.none(),
          showArea: false,
          showPoint: true
        }
      },
      axisX: {
        onlyInteger: true,
        labelInterpolationFnc: function (value) {
          return (parseInt(value, 10) % 2 === 0) ? value : null
        }
      },
      axisY: {
        type: Chartist.AutoScaleAxis,
        onlyInteger: true,
        low: 0,
        high: 10,
        offset: 60,
        labelInterpolationFnc: function (value) {
          return value + ' MB/s'
        }
      },
      fullWidth: true
    }
  }

  componentDidMount () {
    this.chart.updateTo(this.refs.graph, rate)
  }

  shouldComponentUpdate () {
    return false
  }

  addSomethingToSeries () {
    this.series1.add({ points: [parseInt(Math.random() * 11, 10)], interval: rate })
    this.series2.add({ points: [10], interval: rate })
    this.series3.add({ points: [s3mask[parseInt(Math.random() * 11, 10)]], interval: rate })
  }

  render () {
    var data = {
      labels: this.chart.labels,
      series: this.chart.series
    }

    return (
      <div>
        <Graph ref='graph' data={ data } options={ this.options } type='Line' />
      </div>
    )
  }

}

CustomChart.displayName = displayName
