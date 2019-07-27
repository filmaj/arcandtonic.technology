import Tonic from '../tonic.mjs';

export default class SignupView extends Tonic {
  render () {
    return `<div>
      <h2>Create an Account</h2>
      <form action=${ROOT}api/signup method=post>
        <tonic-input
          label="Email Address"
          type=email
          id=email
          name=email
          required=true
          placeholder="Enter a valid email address"
          spellcheck=false
          error-message="Invalid Email">
        </tonic-input>
        <tonic-input
          label=Password
          type=password
          id=password
          name=password
          placeholder="Enter a password"
          spellcheck=false>
        </tonic-input>
        <tonic-input
          label="Confirm Password"
          type=password
          id=confirm
          placeholder="Confirm your password"
          spellcheck=false>
        </tonic-input>
        <tonic-button async=true id=submit>
          Submit
        </tonic-button>
      </form>
    </div>`;
  }
  click (evt) {
    if (Tonic.match(evt.target, 'tonic-button#submit')) {
      const email_input = this.root.querySelector('#email');
      const button = this.root.querySelector('#submit');

      // TODO: how to check if browser validation of email input passed? i.e.
      // shouldnt contain single quote characters.
      // TODO: can we check if the input is valid? a tonic api? and then prevent
      // the submit from happening
      if (!email_input.value || email_input.value.length === 0) {
        email_input.setInvalid('Cannot be empty!');
        button.loading(false);
        evt.preventDefault();
        return;
      }
      email_input.setValid();

      const password = this.root.querySelector('#password');
      if (!password.value || password.value.length === 0) {
        password.setInvalid('Cannot be empty!');
        button.loading(false);
        evt.preventDefault();
        return;
      }
      password.setValid();

      const confirm = this.root.querySelector('#confirm');
      if (!confirm.value || confirm.value.length === 0) {
        confirm.setInvalid('Cannot be empty!');
        button.loading(false);
        evt.preventDefault();
        return;
      }
      confirm.setValid()

      if (password.value === confirm.value) {
        confirm.setValid();
      } else {
        confirm.setInvalid('Password fields must match!');
        button.loading(false);
        evt.preventDefault();
      }
    }
  }
}
Tonic.add(SignupView);
