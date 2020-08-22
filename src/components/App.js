import React from 'react'
import { Grid } from 'semantic-ui-react'
import './App.css'
import { connect } from 'react-redux'

import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'

function App(props) {
  return (
    <div className='app'>
      <Grid columns='equal' style={{ background: '#eee' }}>
        <ColorPanel />
        <SidePanel currentUser={props.currentUser} />
        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages />
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  }
}

export default connect(mapStateToProps, null)(App)
