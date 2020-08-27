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
import AvatarEditor from 'react-avatar-editor'

class UserPanel extends React.Component {
  state = {
    user: null,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: '',
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

  handleChange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    if (file) {
      reader.readAsDataURL(file)
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result })
      })
    }
  }

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob)
        this.setState({
          croppedImage: imageUrl,
          blob,
        })
      })
    }
  }

  render() {
    const { previewImage } = this.state

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
              <Input
                onChange={this.handleChange}
                fluid
                type='file'
                label='New Avatar'
                name='previewImage'
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className='ui aligned grid'>
                    {previewImage && (
                      <AvatarEditor
                        ref={(node) => (this.avatarEditor = node)}
                        image={this.state.previewImage}
                        width={220}
                        height={170}
                        border={55}
                        scale={1.3}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {this.state.croppedImage && (
                      <Image
                        style={{ margin: '3.5em auto' }}
                        width={220}
                        height={170}
                        src={this.state.croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {this.state.croppedImage && (
                <Button color='green' inverted>
                  <Icon name='save' /> Change Avatar
                </Button>
              )}
              <Button color='green' inverted onClick={this.handleCropImage}>
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
