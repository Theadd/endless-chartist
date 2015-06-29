import React, { Component } from 'react'
import Chartist from 'chartist'

export default class Grids extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  shouldComponentUpdate ({ virtualNode }) {
    // TODO
    return true
  }

  render () {
    let { className, children } = this.props.virtualNode
    let nodes = [...children],
      hzTicks = 0

    while (nodes[hzTicks++].classList.contains('ct-horizontal')) {}
    --hzTicks

    return (
      <g className={ className.baseVal }>
        <Horizontal nodes={ nodes } axisX={ this.props.axisX } hzTicks={ hzTicks } />
        <Vertical nodes={ nodes } axisY={ this.props.axisY } hzTicks={ hzTicks } />
      </g>
    )
  }

}

class Horizontal extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  shouldComponentUpdate () {
    // TODO
    return true
  }

  render () {
    // console.debug('IN Grids.Horizontal.render()')
    let { nodes, hzTicks } = this.props

    return (
      <g className='ct-hz-grids'>
        { Array.apply(0, (new Array(hzTicks))).map((v, i) => (
          <line key={ 'rh' + i } x1={ nodes[i].attributes.x1.value } x2={ nodes[i].attributes.x2.value }
                y1={ nodes[i].attributes.y1.value } y2={ nodes[i].attributes.y2.value }
                className="ct-grid ct-horizontal" />
        )) }
      </g>
    )
  }

}

class Vertical extends Component {

  constructor (props) {
    super(props)
    this.state = { vtTicks: props.nodes.length - props.hzTicks }
  }

  shouldComponentUpdate ({ nodes: { length }, hzTicks }) {
    return this.state.vtTicks !== length - hzTicks
  }

  render () {
    console.debug('IN Grids.Vertical.render()')
    let { nodes, /*axisY,*/ hzTicks } = this.props
    let vtTicks = nodes.length - hzTicks

    return (
      <g key={ 'gvg' + this.state.vtTicks } className='ct-vt-grids'>
        { Array.apply(0, (new Array(vtTicks))).map((v, i) => (
          <line key={ 'rv' + i } x1={ nodes[hzTicks + i].attributes.x1.value } x2={ nodes[hzTicks + i].attributes.x2.value }
                y1={ nodes[hzTicks + i].attributes.y1.value } y2={ nodes[hzTicks + i].attributes.y2.value }
                className="ct-grid ct-vertical" />
        )) }
      </g>
    )
  }

}
