import React, { Component } from 'react'
import Chartist from 'chartist'
import Grids from './grids'
import Series from './series'
import Labels from './labels'

var SVGComponent = React.createClass({
  render: function() {
    return <svg {...this.props}>{this.props.children}</svg>;
  }
});

const displayName = 'VirtualGraph'
const propTypes = {
  type: React.PropTypes.string,
  data: React.PropTypes.object.isRequired,
  options: React.PropTypes.object,
  responsiveOptions: React.PropTypes.array
}

export default class VirtualGraph extends Component {

  constructor (props) {
    super(props)
    this.handleCreated = this.handleCreated.bind(this)
    this.state = { ready: false, counter: 0 }
  }

  handleCreated () {
    this.setState({ ready: true, counter: this.state.counter + 1 }, function () {
      console.debug("RENDERED!!!!!")
    })
  }

  componentDidMount () {
    let { width, height } = React.findDOMNode(this.refs.placeholder).getBoundingClientRect()
    let pWidth = width + 'px',
      pHeight = height + 'px'

    this.width = width
    this.height = height

    var container = document.createElement('div'),
      inner = document.createElement('div')

    container.style.width = pWidth
    container.style.height = pHeight
    container.setAttribute("width", pWidth)
    container.setAttribute("height", pHeight)
    inner.style.width = pWidth
    inner.style.height = pHeight
    inner.setAttribute("width", pWidth)
    inner.setAttribute("height", pHeight)
    inner.className = 'ct-chart'

    container.appendChild(inner)

    let { data, type='Line', options={}, responsiveOptions=[] } = this.props
    // TODO: do NOT modify props

    options.width = pWidth
    options.height = pHeight
    this.chartist = new Chartist[type](
      inner, data, options, responsiveOptions
    )
    /*this.chartist = new Chartist.Line(
      inner,
      {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: [
          [12, 9, 7, 8, 11],
          [2, 1, 3.5, 7, 12],
          [1, 3, 4, 5, 10]
        ]
      },
      {
        fullWidth: true,
        width: pWidth,
        height: pHeight
      }
    )*/

    window._container = this.container = container
    window._inner = this.inner = inner
    window._chartist = this.chartist
    window._virtual = this

    /*bounds: axisY.bounds,
      chartRect: chartRect,
      axisX: axisX,
      axisY: axisY,
      svg: this.svg,
      options: options*/
    this.chartist.on('created', function ({ bounds, chartRect, axisX, axisY }) {
      this.bounds = bounds
      this.chartRect = chartRect
      this.axisX = axisX
      this.axisY = axisY
      this.handleCreated()
    }.bind(this))
  }

  componentWillUnmount () {
    if (this.chartist) {
      try {
        this.chartist.detach()
      } catch (e) {}
    }
  }

  update (data) {
    return (this.chartist || false) ? this.chartist.update(data) : null
  }

  render () {
    if (!this.state.ready) {
      let { width='100%', height='100%' } = this.props.options || {}
      return <div ref='placeholder' style={{ width: width, height: height }} />
    }

    let [...gNodes] = this.inner.children[0].children

    return (
      <div ref='container' style={{ width: this.width, height: this.height }}>
        <div className='ct-chart'>
          <svg className="ct-chart-line" height="100%" width="100%">
            { gNodes.map(function (gNode, gi) {
              switch (gNode.className.baseVal) {
                case 'ct-grids':
                  return <Grids key={ 'g' + gi } virtualNode={ gNode } axisX={ this.axisX } axisY={ this.axisY } />
                case '':
                  // TODO: get rid of this querySelectorAll
                  return <g key={ 'g' + gi }>{ [].map.call(gNode.querySelectorAll('.ct-series'), (node, i) => <Series key={ "virt-series-" + i } virtualNode={ node } />) }</g>
                case 'ct-labels':
                  return <Labels key={ 'g' + gi } virtualNode={ gNode } axisX={ this.axisX } axisY={ this.axisY } />
                default:
                  throw new Error("Unexpected className: " + gNode.className.baseVal)
              }
            }, this) }
          </svg>
        </div>
      </div>
    )
  }

}

VirtualGraph.displayName = displayName
VirtualGraph.propTypes = propTypes
