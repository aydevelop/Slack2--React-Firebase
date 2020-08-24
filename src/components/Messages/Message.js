import React from 'react'
import moment from 'moment'
import { Comment, Image } from 'semantic-ui-react'

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message__self' : ''
}

const timeFromNow = (timestamp) => moment(timestamp).fromNow()

const isImage = (msg) => {
  return msg.hasOwnProperty('image') && !msg.hasOwnProperty('content')
}

const Message = ({ message, user }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as='a'>{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
      <Comment.Text>{message.content}</Comment.Text>
      {isImage(message) ? <Image src={message.image} /> : ''}
    </Comment.Content>
  </Comment>
)

export default Message
