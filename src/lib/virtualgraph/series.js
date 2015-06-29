import React, { Component } from 'react'
import Chartist from 'chartist'

export default class Series extends Component {

  constructor (props) {
    super(props)
    let pathNode = props.virtualNode.children[0] || false,
      d = pathNode ? (pathNode.attributes.d || {}).value || '' : ''

    // TODO: State not properly used
    this.state = { d: d }
  }

  shouldComponentUpdate ({ virtualNode }) {
    let pathNode = virtualNode.children[0] || false,
      d = pathNode ? (pathNode.attributes.d || {}).value || '' : ''
    return this.state.d !== d
  }

  render () {
    let { className, children } = this.props.virtualNode

    // TODO: className.baseVal vs className.animVal
    return (
      <g key={ 'sg' + children.length } className={ className.baseVal }>
        { Array.from(children, function ({ nodeName, attributes, className }, i) {
          let props = { className: className.baseVal }

          switch (nodeName) {
            case 'path':
              if (props.className === 'ct-line') {
                return <path key={ 'pl' + i } d={ attributes.d.value } className={ props.className } />
              } else if (props.className === 'ct-area') {
                return <path key={ 'pa' + i } d={ attributes.d.value } className={ props.className } values={ (attributes['ct:values'] || {}).value || '' } />
              } else {
                throw new Error('Unexpected className: ' + props.className)
              }
              break
            case 'line':
              let {
                x1: { value: x1 },
                x2: { value: x2 },
                y1: { value: y1 },
                y2: { value: y2 },
                'ct:value': { value: value }
                } = attributes

              return <line key={ 'l' + i } x1={ x1 } x2={ x2 } y1={ y1 } y2={ y2 } value={ value } className={ props.className } />
              break
          }
        }, this) }
      </g>
    )
  }

}
