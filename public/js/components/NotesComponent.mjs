import Tonic from '../tonic.mjs';
export default class NotesComponent extends Tonic {
    render () {
        return `
        <div id="notes_container">
            <h3>Create a new note:</h3>
            <form name="new_note">
              <tonic-input
                  label="Note"
                  type=text
                  id=note_body
                  placeholder="Enter your note"
                  spellcheck=false>
              </tonic-input>
              <tonic-button async=true id=note_submit>
                  Submit
              </tonic-button>
            </form>
            <h3>Old Notes:</h3>
            <ul id=notes>
            </ul>
        </div>`;
    }
    stylesheet () {
        return `
        #notes_container {
          display: ${this.props.user ? 'block' : 'none'};
        }
        `;
    }
    async click (evt) {
        if (Tonic.match(evt.target, 'tonic-button#note_submit')) {
            const note_body = this.root.querySelector('#note_body');
            if (note_body.value.length === 0) {
                alert('note body cannot be empty!');
                return;
            }
            try {
                let result = await fetch(`${BASE_URL}api/notes`, {
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: note_body.value
                });
                console.log('fetch result', result);
            } catch (e) {
                // TODO: error
                console.error('error posting note!', e);
            }
        }
    }
}
Tonic.add(NotesComponent);
