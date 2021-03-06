import React from 'react'
import { Grid, Form, Segment, Button, Header, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from 'md5'

class Register extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: { msg: '' },
    loading: false,
    usersRef: firebase.database().ref('users'),
  }

  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    })
  }

  isFormValid = () => {
    const check =
      !this.state.username.length ||
      !this.state.email.length ||
      !this.state.password.length ||
      !this.state.passwordConfirmation.length

    if (check) {
      const error = { msg: 'Fill all fields' }
      this.setState({ errors: error })
      return false
    }

    const check2 =
      this.state.password.length < 6 ||
      this.state.passwordConfirmation.length < 6 ||
      this.state.password !== this.state.passwordConfirmation

    if (check2) {
      const error = { msg: 'Password is invalid' }
      this.setState({ errors: error })
      return false
    }

    return true
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    if (!this.isFormValid()) {
      return
    }

    this.setState({ errors: {}, loading: true })
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((createUser) => {
        const photo = `http://gravatar.com/avatar/${md5(
          createUser.user.email
        )}?d=identicon`

        createUser.user
          .updateProfile({
            displayName: this.state.username,
            photoURL: photo,
          })
          .then(() => {
            this.saveUser(createUser).then(() => {
              console.log('user saved')
            })
          })
          .catch((err) => {
            const error = { msg: err?.message }
            this.setState({ errors: error })
          })

        this.setState({ loading: false })
      })
      .catch((err) => {
        console.log(err)
        this.setState({ loading: false })
        const error = { msg: err?.message }
        this.setState({ errors: error })
      })
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' icon color='orange' textAlign='center'>
            Register
          </Header>
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
              <Form.Input
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={this.handleChange}
                type='text'
                value={username}
              />

              <Form.Input
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email Address'
                onChange={this.handleChange}
                type='email'
                value={email}
              />

              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={this.handleChange}
                type='password'
                value={password}
              />

              <Form.Input
                fluid
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={this.handleChange}
                type='password'
                value={passwordConfirmation}
              />

              <Button disabled={this.loading} color='orange' fluid size='large'>
                Submit
              </Button>
            </Segment>
          </Form>

          {this.state.errors.msg && (
            <Message error>{this.state.errors.msg}</Message>
          )}
          <Message>
            Already a user? <Link to='/login'>Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
