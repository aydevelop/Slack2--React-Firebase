import React from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: 0,
  }

  componentDidMount() {
    const { channel, messages, messagesLoading, user } = this.state
    if (!channel || !user) {
      return
    }

    const loadedMessages = []
    this.state.messagesRef.child(channel.id).on('child_added', (snap) => {
      loadedMessages.push(snap.val())
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      })

      this.countUniqueUsers(loadedMessages)
    })
  }

  countUniqueUsers = (msgs) => {
    const uniqueUsers = msgs.reduce((users, messages) => {
      if (!users.includes(messages.user.name)) {
        users.push(messages.user.name)
      }

      return users
    }, [])

    const numUniqueUsers = `${uniqueUsers.length} users`
    this.setState({ numUniqueUsers })
  }

  displayMsg = () => {
    return this.state.messages.map((msg, i) => {
      return (
        <Message key={msg.timestamp + i} message={msg} user={this.state.user} />
      )
    })
  }

  displayChannelName = (channel) => (channel ? `#${channel.name}` : ``)

  render() {
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(this.state.channel)}
          numUniqueUsers={this.state.numUniqueUsers}
        />

        <Segment>
          <Comment.Group className='messages'>
            {this.displayMsg()}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={this.state.messagesRef}
          currentChannel={this.state.channel}
          currentUser={this.state.user}
        />
      </React.Fragment>
    )
  }
}

export default Messages
