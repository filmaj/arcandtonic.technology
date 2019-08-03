// login.page.js
const Page = require('./page');

class LoginPage extends Page {

  get email () { return $('input[name=email]'); }
  get password () { return $('input[name=password]'); }
  get submitBtn () { return $('#login_submit'); }

  open () {
    super.open('login');
  }

  submit () {
    this.submitBtn.click();
  }

  login (user, password) {
    this.email.setValue(user);
    this.password.setValue(password);
    this.submit();
  }
}

module.exports = new LoginPage();
