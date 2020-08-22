import React from 'react'
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react'
import firebase from './../../firebase'
import { connect } from 'react-redux'

class UserPanel extends React.Component {
  state = {
    user: null,
  }

  componentDidMount() {
    this.setState({ user: this.props.currentUser })
  }

  dropdownOptions = () => [
    {
      key: 'avatar',
      text: <span>Change Avatar</span>,
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
