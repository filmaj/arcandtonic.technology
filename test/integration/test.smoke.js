const assert = require('assert');
const HomePage = require('./page/HomePage');
const SignupPage = require('./page/SignupPage');
const LoginPage = require('./page/LoginPage');

const user = 'fil@filmaj.ca';
const pwd = 'password';

describe('arcandtonic.technology end to end browser tests', function () {
  this.timeout(30000);

  it('should load homepage with sign up and login buttons displayed', () => {
    HomePage.open();
    assert(HomePage.login.isDisplayed(), 'login button is not displayed');
    assert(HomePage.signup.isDisplayed(), 'signup button is not displayed');
  });
  it('should be able to sign up, log out and log in', () => {
    SignupPage.open();
    SignupPage.register(user, pwd);
    HomePage.logout.waitForDisplayed(3000);
    HomePage.logout.click();
    HomePage.login.waitForDisplayed(3000);
    LoginPage.open();
    LoginPage.login(user, pwd);
    HomePage.logout.waitForDisplayed(3000);
    assert(HomePage.logout.isDisplayed(), 'logged back in and logout button is not displayed');
  });
  it('should be able to create and delete a note', () => {
    assert(HomePage.note.isDisplayed(), 'note input displayed on home page');
    HomePage.createNote('bat country');
    browser.waitUntil(() => browser.$('#notes form').isDisplayed(), 5000, 'expected new note to be displayed');
    browser.$('#notes form button').click();
    browser.waitUntil(() => !browser.$('#notes').isDisplayed(), 5000, 'expected old notes to be hidden after deleting note');
  });
});
