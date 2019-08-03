// login.page.js
const Page = require('./page');

class HomePage extends Page {

  get note () { return $('input[name=note]'); }
  get logout () { return $('#logout'); }
  get login () { return $('#login'); }
  get signup () { return $('#signup'); }
  get submitBtn () { return $('form[name=new_note] button'); }

  open () {
    super.open('/');
  }

  submit () {
    this.submitBtn.click();
  }

  createNote (text) {
    this.note.setValue(text);
    this.submit();
  }
}

module.exports = new HomePage();
