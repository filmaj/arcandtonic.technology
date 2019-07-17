import Tonic from './tonic.mjs';
import HeaderComponent from './components/HeaderComponent.mjs';
import SignupView from './components/SignupView.mjs';
import LoginView from './components/LoginView.mjs';
import NotesComponent from './components/NotesComponent.mjs';
export default class ArcTonic extends Tonic {
  render () {
    let txt = document.createElement('textarea');
    txt.innerHTML = this.props.notes;
    let decoded = txt.value;
    let notes = JSON.parse(decoded);
    console.log('parsed top level notes', notes);
    return this.html`
<header-component user="${this.props.user}"></header-component>
<tonic-router id=signup-view path="/signup" >
    <signup-view></signup-view>
</tonic-router>
<tonic-router id=login-view path="/login">
    <login-view></login-view>
</tonic-router>
<tonic-router id=home-view none>
  <h2>Welcome!</h2>
  <p>
    Welcome to arctonic, the app that uses the <a href="https://arc.codes">architect serverless framework</a>
    together with <a href="https://tonic.technology">tonic, a JavaScript frontend library</a>.
  </p>
  <notes-component user="${this.props.user}" notes='${notes}'></notes-component>
</tonic-router>`;
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
Tonic.add(ArcTonic);
