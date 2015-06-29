import React, { Component } from 'react'
import { Syncer, VirtualGraph } from 'lib'
// import CustomChart from './charts/customchart'
import Chart from './charts/chart'
import VirtualChart from './charts/virtualchart'
import settings from 'settings'

const displayName = 'App'

export default class App extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }


  render () {

    return (
      <div style={{ margin: '20px' }}>
        <div style={{ width: '100%', height: 250, float: 'none', clear: 'both' }}>
          <VirtualChart settings={ settings } chart='chart04' />
        </div>
      </div>
    )
  }

}

App.displayName = displayName
