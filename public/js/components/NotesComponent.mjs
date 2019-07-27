import Tonic from '../tonic.mjs';

export default class NotesComponent extends Tonic {
  renderNotes (notes) {
    return notes.map(note => `<li><form action=${ROOT}api/notes/${note.noteID}/del method=post>${note.note}<tonic-button async=true width=30px>X</tonic-button></form></li>`).join('\n')
  }
  render () {
    return `
      <h3>Create a new note:</h3>
      <form name="new_note" action=${ROOT}api/notes method=post>
        <tonic-input
            label="Note"
            type=text
            id=note_body
            name=note
            placeholder="Enter your note"
            spellcheck=false>
        </tonic-input>
        <tonic-button async=true id=note_submit>
            Submit
        </tonic-button>
      </form>
      <div id="notes_list">
      <h3>Old Notes:</h3>
      <ul id=notes>
      ${this.renderNotes(this.props.notes)}
      </ul></div>`;
  }
  stylesheet () {
    return `
      notes-component {
        display: ${this.props.user && this.props.user.length ? 'block' : 'none'};
      }
      #notes_list {
        display: ${this.props.notes && this.props.notes.length ? 'block' : 'none'};
      }`;
  }
  click (evt) {
    // TODO: a problem here when you enter double quotes - upon submitting the
    // input text gets cut off at the double quote. weird.
    if (Tonic.match(evt.target, 'tonic-button#note_submit')) {
      const note_body = this.root.querySelector('#note_body');
      const submit = this.root.querySelector('#note_submit');
      if (note_body.value.length === 0) {
        note_body.setInvalid('Note cannot be empty!');
        evt.preventDefault();
        submit.loading(false);
        return;
      }
      note_body.setValid();
    }
  }
}
Tonic.add(NotesComponent);
