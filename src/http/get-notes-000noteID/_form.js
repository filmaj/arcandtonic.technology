module.exports = function form ({noteID, href, title, body}) {
    return `
<div class="card mt-5 mr-auto ml-auto mb-1 w-25">
  <h2>Viewing "${title}" Note</h2>
  <div class=card-body>
    <form action=${href} method=post>
      <input type=hidden name=noteID value=${noteID}>
      <div class=form-group>
        <input 
          type=text 
          class=form-control 
          name=title 
          placeholder="Enter title" 
          value="${title}"
          required>
      </div>
      <div class=form-group>
        <textarea 
          class=form-control 
          name=body 
          placeholder="Enter text">${body}</textarea>
      </div>
      <button type=submit class="btn btn-primary float-right">Save</button>
    </form>
    <form action=${href}/del method=post>
      <button type=submit class="btn btn-danger float-right mr-2">Delete</button>
    </form>
  </div>
</div>
`;
};
