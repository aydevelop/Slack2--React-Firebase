import React from 'react'
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'

class MessageForm extends React.Component {
  state = {
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messagesRef: firebase.database().ref('messages'),
    errors: [],
  }

  handleChange = (e) => {
    const name = e.target.name
    const val = e.target.value
    this.setState({ [name]: val })
  }

  createMsg = () => {
    const message = {
      content: this.state.message,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    }

    return message
  }

  sendMessage = () => {
    const msg = this.state.message
    if (msg) {
      this.setState({ loading: true })
      this.props.messagesRef
        .child(this.state.channel.id)
        .push()
        .set(this.createMsg())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [] })
        })
        .catch((err) => {
          console.error(err)
          this.setState({ loading: false, errors: this.state.errors.push(err) })
        })
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' }),
      })
    }
  }

  render() {
    return (
      <Segment className='message__form'>
        <Input
          onChange={this.handleChange}
          fluid
          name='message'
          style={{ marginBottom: '0.7em' }}
          label={<Button icon={'add'} />}
          labelPosition='left'
          placeholder='Write your message'
          value={this.state.message}
          className={
            this.state.errors?.some((err) => err.message.includes('message'))
              ? 'error'
              : ''
          }
        />
        <Button.Group icon widths='2'>
          <Button
            onClick={this.sendMessage}
            color='orange'
            content='Add Reply'
            labelPosition='left'
            icon='edit'
            disabled={this.state.loading}
          />
          <Button
            color='teal'
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
          />
        </Button.Group>
      </Segment>
    )
  }
}

export default MessageForm
