// login.page.js
const Page = require('./page');

class SignupPage extends Page {

  get email () { return $('input[name=email]'); }
  get password () { return $('input[name=password]'); }
  get confirm () { return $('input[placeholder="Confirm your password"]'); }
  get submitBtn () { return $('#signup_submit'); }

  open () {
    super.open('/signup');
  }

  submit () {
    this.submitBtn.click();
  }

  register (user, password) {
    this.email.setValue(user);
    this.password.setValue(password);
    this.confirm.setValue(password);
    this.submit();
  }
}

module.exports = new SignupPage();
