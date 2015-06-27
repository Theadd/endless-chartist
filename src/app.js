import React, { Component } from 'react'
import { Syncer } from 'lib'
// import CustomChart from './charts/customchart'
import Chart from './charts/chart'
import settings from 'settings'

const displayName = 'App'

export default class App extends Component {

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = { more: 1 }
  }

  componentDidMount () {
    this.refs.bigOne.syncer = new Syncer({ interval: 1000, points: 241, last: -5000 })
    this.refs.cc50d2.syncer = new Syncer({ interval: 1000, points: 60, last: 0 })
  }

  handleClick () {
    this.setState({ more: this.state.more + 1 })
  }

  render () {

    return (
      <div>
        <div>
          <div style={{ float: 'right', margin: '20px', textAlign: 'right' }}>
            <span style={{ opacity: 0.5 }}>
              <strong>{ this.state.more }</strong> * 6
              <span style={{ opacity: 0.6, fontSize: '0.82em' }}> (chart02, chart03, chart04, chart02, chart03, chart04)</span>
            </span>
            <h2 style={{ display: 'inline-block', minWidth: 80, textAlign: 'right', margin: '0 0 0 10px' }}>{ this.state.more * 6 }</h2>
            <br />
            <span style={{ opacity: 0.5 }}>
              6<span style={{ opacity: 0.6, fontSize: '0.82em' }}> (chart04#241p, chart01, chart02#60p, chart03, chart03, chart02)</span>
            </span>
            <h2 style={{ display: 'inline-block', minWidth: 80, textAlign: 'right', margin: '0 0 0 10px', borderBottom: '1px solid rgba(0, 0, 0, 0.3)' }}>+ 6</h2>
            <br />
            <h1 style={{ display: 'inline-block', minWidth: 80, textAlign: 'right', margin: 0 }}>{ 6 + (this.state.more * 6) }</h1>
          </div>
          <input type='button' value='LOAD MORE' onClick={ this.handleClick } style={{ padding: '20px', margin: '20px' }} />
          <hr style={{ clear: 'both' }} />
        </div>
        <div style={{ clear: 'both' }}>
          { Array.apply(0, (new Array(this.state.more))).map((v, i) => (
            <div key={ 'iter' + i }>
              <div style={{ width: '16.66%', height: 150, float: 'left', minWidth: '215px' }}>
                <Chart settings={ settings } chart='chart02' />
              </div>
              <div style={{ width: '16.66%', height: 150, float: 'left', minWidth: '215px' }}>
                <Chart settings={ settings } chart='chart03' />
              </div>
              <div style={{ width: '16.66%', height: 150, float: 'left', minWidth: '215px' }}>
                <Chart settings={ settings } chart='chart04' />
              </div>
              <div style={{ width: '16.66%', height: 150, float: 'left', minWidth: '215px' }}>
                <Chart settings={ settings } chart='chart02' />
              </div>
              <div style={{ width: '16.66%', height: 150, float: 'left', minWidth: '215px' }}>
                <Chart settings={ settings } chart='chart03' />
              </div>
              <div style={{ width: '16.66%', height: 150, float: 'left', minWidth: '215px' }}>
                <Chart settings={ settings } chart='chart04' />
              </div>
            </div>
          )) }
        </div>
        <div style={{ clear: 'both', width: '100%', height: 180 }}>
          <Chart ref='bigOne' settings={ settings } chart='chart04' />
        </div>
        <div style={{ clear: 'both' }}>
          <div style={{ width: '50%', height: 300, float: 'left' }}>
            <Chart settings={ settings } chart='chart01' />
          </div>
          <div style={{ width: '50%', height: 300, float: 'left' }}>
            <Chart ref='cc50d2' settings={ settings } chart='chart02' />
          </div>
          <div style={{ width: '24%', height: 210, float: 'left' }}>
            <Chart settings={ settings } chart='chart03' />
          </div>
          <div style={{ width: '38%', height: 210, float: 'left' }}>
            <Chart settings={ settings } chart='chart03' />
          </div>
          <div style={{ width: '38%', height: 210, float: 'left' }}>
            <Chart settings={ settings } chart='chart02' />
          </div>
        </div>
      </div>
    )
  }

}

App.displayName = displayName
