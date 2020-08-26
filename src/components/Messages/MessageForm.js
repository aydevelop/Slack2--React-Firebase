import React from 'react'
import { Segment, Button, Input } from 'semantic-ui-react'
import firebase from '../../firebase'
import FileModal from './FileModal'
import uuidv4 from 'uuid.v4'
import ProgressBar from './ProgressBar'

class MessageForm extends React.Component {
  state = {
    percentUploaded: '',
    uploadState: '',
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messagesRef: firebase.database().ref('messages'),
    errors: [],
    modal: false,
  }

  openModal = () => this.setState({ modal: true })
  closeModal = () => this.setState({ modal: false })

  handleChange = (e) => {
    const name = e.target.name
    const val = e.target.value
    this.setState({ [name]: val })
  }

  createMsg = (fileUrl = null) => {
    const message = {
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL,
      },
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    }

    if (fileUrl !== null) {
      message['image'] = fileUrl
    } else {
      message['content'] = this.state.message
    }

    return message
  }

  sendMessage = () => {
    const msg = this.state.message
    if (msg) {
      this.setState({ loading: true })
      this.props
        .getMessagesRef()
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

  uploadFile = (file, m) => {
    const path = this.state.channel.id
    const ref = this.props.getMessagesRef
    const filePath = this.getPath() + `/${uuidv4()}.jpg`

    var metadata = {
      contentType: 'image/jpeg',
    }

    const filePut = this.state.storageRef.child(filePath).put(file, metadata)
    this.setState({ uploadState: 'uploading' })

    filePut.on(
      'state_changed',
      (snap) => {
        const percentUploaded = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        )
        this.setState({ percentUploaded })
      },
      (err) => console.error('Uploading error ' + err),
      () => {
        filePut.snapshot.ref
          .getDownloadURL()
          .then((downloadUrl) => {
            console.log(downloadUrl)
            this.sendFileMessage(downloadUrl, ref, path)
            this.setState({ percentUploaded: -1 })
          })
          .catch((err) => console.error('GetDownloadURL error ' + err))
      }
    )
  }

  sendFileMessage = (fileURL, ref, pathToUpload) => {
    this.props
      .getMessagesRef()
      .child(pathToUpload)
      .push()
      .set(this.createMsg(fileURL))
      .then(() => {
        this.setState({ uploadState: 'done' })
      })
      .catch((err) => {
        console.error(err)
        this.setState({
          errors: this.state.errors.concat(err),
        })
      })
  }

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`
    } else {
      return 'chat/public'
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
            disabled={this.state.uploadState == 'uploading'}
            color='teal'
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal
          modal={this.state.modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={this.state.uploadState}
          percentUploaded={this.state.percentUploaded}
        />
      </Segment>
    )
  }
}

export default MessageForm
