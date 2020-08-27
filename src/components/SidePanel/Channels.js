import React from 'react'
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../actions'

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    channel: null,
    channels: [],
    channelName: '',
    channelDetails: '',
    modal: false,
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    notifications: [],
    firstLoad: true,
    activeChennel: '',
  }

  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(this.state.channels[0])
      this.setActiveChannel(this.state.channels[0])
      this.setState({ channel: this.state.channels[0] })
    }

    this.setState({ firstLoad: false })
  }

  componentDidMount() {
    this.state.channelsRef.on('child_added', (snap) => {
      this.setState({ channels: this.state.channels.concat(snap.val()) }, () =>
        this.setFirstChannel()
      )
      this.addNotificationListener(snap.key)
    })
  }

  addNotificationListener = (channelId) => {
    this.state.messagesRef.child(channelId).on('value', (snap) => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        )
      }
    })
  }

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0

    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    )

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren()
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      })
    }

    this.setState({ notifications })
  }

  componentWillUnmount() {
    this.state.channelsRef.off()
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  isValid = ({ channelName, channelDetails }) => {
    return channelName && channelDetails
  }

  changeChannel = (channel) => {
    this.props.setCurrentChannel(channel)
    this.setActiveChannel(channel)
    this.props.setPrivateChannel(false)
    this.setState({ channel })
    this.clearNotifications()
  }

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.state.channel.id
    )

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications]
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal
      updatedNotifications[index].count = 0
      this.setState({ notifications: updatedNotifications })
    }
  }

  setActiveChannel = (channel) => {
    this.setState({ activeChennel: channel.id })
  }

  displayChannels = () =>
    this.state.channels.length > 0 &&
    this.state.channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.8 }}
        active={channel.id === this.state.activeChennel}
      >
        {this.getNotificationCount(channel) && (
          <Label color='red'>{this.getNotificationCount(channel)}</Label>
        )}
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

  getNotificationCount = (channel) => {
    let count = 0

    this.state.notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count
      }
    })

    if (count > 0) return count
  }

  render() {
    const { channels, modal } = this.state

    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: '2em', marginTop: '25px' }}>
          <Menu.Item>
            <span>
              <Icon name='exchange' /> CHANNELS
            </span>{' '}
            ({channels.length}){' '}
            <Icon
              style={{ cursor: 'pointer' }}
              name='add'
              onClick={this.openModal}
            />
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

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels)
