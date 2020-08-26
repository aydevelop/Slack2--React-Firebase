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
        <SidePanel
          key={props.currentUser && props.currentUser.uid}
          currentUser={props.currentUser}
        />
        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages
            key={props.currentChannel && props.currentChannel.id}
            currentChannel={props.currentChannel}
            currentUser={props.currentUser}
            isPrivateChannel={props.isPrivateChannel}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel
            key={props.currentChannel && props.currentChannel.id}
            isPrivateChannel={props.isPrivateChannel}
          />
        </Grid.Column>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
  }
}

export default connect(mapStateToProps, null)(App)
