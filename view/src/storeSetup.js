import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import Thunk from 'redux-thunk';

import reducers from './reducers';

const store = compose(applyMiddleware(Thunk))(createStore)(reducers);