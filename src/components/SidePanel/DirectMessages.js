import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../actions'

class DirectMessages extends React.Component {
  state = {
    user: this.props.currentUser,
    users: [],
    usersRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence'),
  }

  componentWillUnmount() {
    this.state.usersRef.off()
    this.state.connectedRef.off()
    this.state.presenceRef.off()
  }

  componentDidMount() {
    console.log('errors...')
    if (!this.state.user) {
      return
    }

    const currentUserUid = this.state.user.uid
    this.getUsers(currentUserUid)

    //when i(currentUser) joined the database
    //delete currentUser from document 'presence'
    this.checkOnlineCurrentUser(currentUserUid)

    this.state.presenceRef.on('child_added', (snap) => {
      if (currentUserUid !== snap.key) {
        console.log(`online`)
        this.addStatusToUser(snap.key, true)
      }
    })

    this.state.presenceRef.on('child_removed', (snap) => {
      if (currentUserUid !== snap.key) {
        console.log(`offline`)
        this.addStatusToUser(snap.key, false)
      }
    })
  }

  getUsers = (currentUserUid) => {
    let loadedUsers = []
    this.state.usersRef.on('child_added', (snap) => {
      if (currentUserUid !== snap.key) {
        let user = snap.val()
        user['uid'] = snap.key
        user['status'] = 'offline'
        loadedUsers.push(user)
        this.setState({ users: loadedUsers })
      }
    })
  }

  checkOnlineCurrentUser = (currentUserUid) => {
    this.state.connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        //now i (currentUser) have joined the database
        const ref = this.state.presenceRef.child(this.state.user.uid)
        ref.set(true)
        //ref.onDisconnect().set(false)
        ref.onDisconnect().remove()
      }
    })
  }

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`
      }
      return acc.concat(user)
    }, [])
    this.setState({ users: updatedUsers })
  }

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid)
    const channelData = {
      id: channelId,
      name: user.name,
    }
    this.props.setCurrentChannel(channelData)
    this.props.setPrivateChannel(true)
  }

  getChannelId = (userId) => {
    const currentUserId = this.state.user.uid
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`
  }

  render() {
    const { users } = this.state

    return (
      <Menu.Menu className='menu'>
        <Menu.Item>
          <span>
            <Icon name='mail' /> DIRECT MESSAGES
          </span>{' '}
          ({users.length})
        </Menu.Item>
        {users.map((user) => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            <Icon
              name='circle'
              color={user.status === 'online' ? 'green' : 'red'}
            />
            @ {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
)
