import Tonic from '../tonic.mjs';
export default class Header extends Tonic {
    render () {
        return `
        <div>
            <tonic-button id=home>Home</tonic-button>
            <div id=header-controls>
                ${this.props.user
                  ? `Welcome ${this.props.user}. Maybe you want to <tonic-button id=logout>logout</tonic-button>?`
                  : `<tonic-button id=signup>Sign up</tonic-button> or <tonic-button id=login>log in</tonic-button>`
                }
            </div>
        </div>`;
    }
    stylesheet () {
        return `
            header>div {
                display: flex;
                align-items: center;
            }
            #header-controls {
                margin-left: auto;
            }
        `;
    }
    async click (evt) {
        if (Tonic.match(evt.target, 'tonic-button#signup')) {
            window.history.pushState({}, 'Sign up', `${BASE_URL}signup`);
        } else if (Tonic.match(evt.target, 'tonic-button#login')) {
            window.history.pushState({}, 'Log in', `${BASE_URL}login`);
        } else if (Tonic.match(evt.target, 'tonic-button#logout')) {
            let result = await fetch(`${BASE_URL}api/logout`, {
                credentials: 'same-origin',
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });
            window.location.href = BASE_URL;
        } else if (Tonic.match(evt.target, 'tonic-button#home')) {
            window.history.pushState({}, 'Home', `${BASE_URL}`);
            evt.preventDefault();
        }
    }
}
Header.el = 'Header';
Tonic.add(Header);
