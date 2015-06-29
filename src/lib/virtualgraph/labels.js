import React, { Component } from 'react'
import Chartist from 'chartist'

export default class Labels extends Component {

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
      hzTicks = 0,
      hzY = nodes[hzTicks++].attributes.y.value

    while (nodes[hzTicks++].attributes.y.value === hzY) {}
    --hzTicks

    // TODO: className.baseVal vs className.animVal
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
    // console.debug('IN Labels.Vertical.render()')
    let { nodes, axisX, hzTicks } = this.props
    window._foes = nodes

    return (
      <g key={ 'lhg' + hzTicks } className='ct-labels ct-hz-labels'>
        { Array.apply(0, (new Array(hzTicks))).map((v, i) => (
          <foreignobject key={ 'fh' + i } style={{overflow: 'visible'}} x={ nodes[i].attributes.x.value }
                         y={ nodes[i].attributes.y.value } width={ nodes[i].attributes.width.value }
                         height={ nodes[i].attributes.height.value }>
            <span className="ct-label ct-horizontal ct-end">{ nodes[i].textContent + ' ' }</span>
          </foreignobject>
        )) }
      </g>
    )
  }

}

class Vertical extends Component {

  constructor (props) {
    super(props)
    this.state = { ticks: props.axisY.ticks.length }
  }

  shouldComponentUpdate (props) {
    if (this.state.ticks !== props.axisY.ticks.length) {
      this.setState({ ticks: props.axisY.ticks.length })
    }
    return true
  }

  render () {
    console.debug('IN Labels.Vertical.render()')
    let { nodes, axisY, hzTicks } = this.props
    let vtTicks = axisY.ticks.length

    return (
      <g key={ 'lvg' + this.state.ticks } className='ct-labels ct-vt-labels'>
        { Array.apply(0, (new Array(vtTicks))).map((v, i) => (
          <foreignobject key={ 'fv' + i } style={{overflow: 'visible'}} x={ nodes[hzTicks + i].attributes.x.value }
                         y={ nodes[hzTicks + i].attributes.y.value } width={ nodes[hzTicks + i].attributes.width.value }
                         height={ nodes[hzTicks + i].attributes.height.value }>
            <span className="ct-label ct-vertical ct-start"
                  style={{ width: parseInt(nodes[hzTicks + i].attributes.width.value, 10), height: parseInt(nodes[hzTicks + i].attributes.height.value, 10) }}> { String(nodes[hzTicks + i].textContent) + ' ' }</span>
          </foreignobject>
        )) }
      </g>
    )
  }

}
