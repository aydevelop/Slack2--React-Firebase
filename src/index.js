import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import firebase from './firebase'
import { BrowserRouter, Switch, Route, withRouter } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import './index.css'
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import rootReducer from './reducers/index'
import { setUser, clearUser, setLoading } from './actions'
import Spinner from './components/Spinner'

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user)
        this.props.history.push('/')
      } else {
        this.props.setLoading(true)
        this.props.history.push('/login')
        this.props.clearUser()
      }
    })
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Switch>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.user.isLoading,
  }
}

const store = createStore(rootReducer, composeWithDevTools())
const RootWithAuth = withRouter(
  connect(mapStateToProps, { setUser, clearUser, setLoading })(Root)
)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <RootWithAuth />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
