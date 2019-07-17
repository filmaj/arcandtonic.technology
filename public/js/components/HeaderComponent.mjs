import Tonic from '../tonic.mjs';
export default class HeaderComponent extends Tonic {
  render () {
    return `
        <div>
            <tonic-button id=home>Home</tonic-button>
            <div id=controls>
                ${this.props.user
    ? `Welcome ${this.props.user}. <tonic-button id=logout>logout</tonic-button>?`
    : `<tonic-button id=signup>Sign up</tonic-button> or <tonic-button id=login>log in</tonic-button>`
}
            </div>
        </div>`;
  }
  stylesheet () {
    return `
            header-component>div {
                display: flex;
                align-items: center;
            }
            header-component #controls {
                margin-left: auto;
            }
        `;
  }
  async click (evt) {
    if (Tonic.match(evt.target, 'tonic-button#signup')) {
      window.history.pushState({}, 'Sign up', `signup`);
    } else if (Tonic.match(evt.target, 'tonic-button#login')) {
      window.history.pushState({}, 'Log in', `login`);
    } else if (Tonic.match(evt.target, 'tonic-button#logout')) {
      await fetch(`/api/logout`, {
        credentials: 'same-origin',
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
      });
      window.location.href = '/';
    } else if (Tonic.match(evt.target, 'tonic-button#home')) {
      window.history.pushState({}, 'Home', `/`);
      evt.preventDefault();
    }
  }
}
Tonic.add(HeaderComponent);
