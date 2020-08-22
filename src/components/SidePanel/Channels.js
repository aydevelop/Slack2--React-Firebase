import React from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel } from './../../actions/index'

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDetails: '',
    modal: false,
    channelsRef: firebase.database().ref('channels'),
  }

  componentDidMount() {
    this.state.channelsRef.on('child_added', (snap) => {
      this.setState({ channels: this.state.channels.concat(snap.val()) })
    })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  isValid = ({ channelName, channelDetails }) => {
    return channelName && channelDetails
  }

  changeChannel = (channel) => {
    this.props.setCurrentChannel(channel)
  }

  displayChannels = () =>
    this.state.channels.length > 0 &&
    this.state.channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.8 }}
      >
        # {channel.name}
      </Menu.Item>
    ))

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state

    channelsRef.push()
    const key = channelsRef.push().key

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
    }

    channelsRef
      .child(key)
      .set(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: '' })
        this.closeModal()
      })
      .catch((err) => {
        console.error(err)
      })
  }

  handleSubmit = (event) => {
    if (this.isValid(this.state)) {
      this.addChannel()
    } else {
      console.error('Not valid')
    }
  }

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false })

  render() {
    const { channels, modal } = this.state

    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name='exchange' /> CHANNELS
            </span>{' '}
            ({channels.length}) <Icon name='add' onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels()}
        </Menu.Menu>

        {/* Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  label='Name of Channel'
                  name='channelName'
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label='About the Channel'
                  name='channelDetails'
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button onClick={this.handleSubmit} color='green' inverted>
              <Icon name='checkmark' /> Add
            </Button>
            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove' /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default connect(null, { setCurrentChannel })(Channels)
