import React from 'react'
import { Modal, Input, Button, Icon } from 'semantic-ui-react'
import mime from 'mime-types'

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ['image/jpeg', 'image/png'],
  }

  addfile = (event) => {
    const file = event.target.files[0]
    if (file) {
      this.setState({ file })
    }
  }

  uploadFile = (file, m) => {
    console.log('file ' + file + ', ' + m)
  }

  sendFile = () => {
    const file = this.state.file

    if (file !== null) {
      const m = mime.lookup(file.name)
      if (this.state.authorized.includes(m)) {
        this.props.uploadFile(file, m)
        this.props.closeModal()
        this.setState({ file: null })
      }
    }
  }

  render() {
    const { modal, closeModal } = this.props

    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addfile}
            fluid
            label='File types: jpg, png'
            name='file'
            type='file'
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.sendFile} color='green' inverted>
            <Icon name='checkmark' /> Send
          </Button>
          <Button color='red' inverted onClick={closeModal}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default FileModal
