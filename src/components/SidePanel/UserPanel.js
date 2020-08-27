import React from 'react'
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Button,
  Input,
} from 'semantic-ui-react'
import firebase from './../../firebase'
import { connect } from 'react-redux'

class UserPanel extends React.Component {
  state = {
    user: null,
    modal: false,
  }

  componentDidMount() {
    this.setState({ user: this.props.currentUser })
  }

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false })

  dropdownOptions = () => [
    {
      key: 'avatar',
      text: <span onClick={this.openModal}>Change Avatar</span>,
    },
    {
      key: 'signout',
      text: (
        <a style={{ color: 'black' }} onClick={this.handleSignout}>
          <span>Sign Out</span>
        </a>
      ),
    },
  ]

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out'))
  }

  render() {
    return (
      <Grid style={{ background: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header inverted floated='left' as='h2'>
              <Icon name='code' />
              <Header.Content>Chat</Header.Content>
            </Header>
          </Grid.Row>

          <Header style={{ padding: '0.25em' }} as='h4' inverted>
            <Dropdown
              trigger={
                <span>
                  <Image
                    src={this.state.user?.photoURL}
                    spaced='right'
                    avatar
                  />
                  {this.state.user?.displayName}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>

          <Modal basic open={this.state.modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input fluid type='file' label='New Avatar' name='previewImage' />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className='ui center aligned grid'>
                    {/* Image Preview */}
                  </Grid.Column>
                  <Grid.Column>{/* Cropped Image Preview */}</Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' inverted>
                <Icon name='save' /> Change Avatar
              </Button>
              <Button color='green' inverted>
                <Icon name='image' /> Preview
              </Button>
              <Button color='red' inverted onClick={this.closeModal}>
                <Icon name='remove' /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  }
}

export default connect(mapStateToProps, null)(UserPanel)
