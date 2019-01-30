import Tonic from './tonic.mjs';
import Header from './components/header.mjs';
import Signup from './components/signup.mjs';
import Login from './components/login.mjs';
export default class App extends Tonic {
    render () {
        let body = `
            <${Header.el} user="${this.props.user}"></${Header.el}>
            <tonic-router id=signup-view path="${BASE_URL}signup" >
                <${Signup.el}></${Signup.el}>
            </tonic-router>
            <tonic-router id=login-view path="${BASE_URL}login">
                <${Login.el}></${Login.el}>
            </tonic-router>
            <tonic-router id=home-view none>
              <h2>Welcome!</h2>
              <p>
                Welcome to arctonic, the app that uses the <a href="https://arc.codes">architect serverless framework</a>
                together with <a href="https://tonic.technology">tonic, a JavaScript frontend library</a>.
              </p>
            </tonic-router>`;
        return body;
    }
    stylesheet () {
        return `
        tonic-router {
            max-width: 400px;
            margin: 0 auto;
        }
        tonic-router>form>* {
            margin: 5px;
        }`;
    }
}
Tonic.add(App);
