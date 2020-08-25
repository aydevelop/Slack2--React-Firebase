import React from 'react'
import { Segment, Comment, Accordion } from 'semantic-ui-react'
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
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
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

  displayMsg = (messages) => {
    return messages.map((msg, i) => {
      return (
        <Message key={msg.timestamp + i} message={msg} user={this.state.user} />
      )
    })
  }

  displayChannelName = (channel) => (channel ? `#${channel.name}` : ``)

  handleSearchMessages = (e) => {
    const channelMessages = [...this.state.messages]
    const regex = new RegExp(this.state.searchTerm, 'gi')

    const searchResults = channelMessages.reduce((acc, msg) => {
      if (
        msg.content &&
        (msg.content.match(regex) || msg.user.name.match(regex))
      ) {
        acc.push(msg)
      }
      return acc
    }, [])

    this.setState({ searchResults })
  }

  handleSearchChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true,
      },
      () => {
        this.handleSearchMessages()
      }
    )
  }

  render() {
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(this.state.channel)}
          numUniqueUsers={this.state.numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
        />

        <Segment>
          <Comment.Group className='messages'>
            {!this.state.searchTerm
              ? this.displayMsg(this.state.messages)
              : this.displayMsg(this.state.searchResults)}
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
