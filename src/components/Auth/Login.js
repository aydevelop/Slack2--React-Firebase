import React from 'react'
import { Grid, Form, Segment, Button, Header, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from 'md5'

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    errors: { msg: '' },
    loading: false,
    usersRef: firebase.database().ref('users'),
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({ loading: true })

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        console.log(user)
      })
      .catch((err) => {
        const error = { msg: err?.message }
        this.setState({ errors: error })
      })
      .finally(this.setState({ loading: false }))
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' icon color='violet' textAlign='center'>
            Login
          </Header>
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
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

              <Button disabled={this.loading} color='violet' fluid size='large'>
                Submit
              </Button>
            </Segment>
          </Form>

          {this.state.errors.msg && (
            <Message error>{this.state.errors.msg}</Message>
          )}
          <Message>
            Don't have an account <Link to='/register'>Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
