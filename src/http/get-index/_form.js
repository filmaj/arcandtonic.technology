module.exports = function form ({url}) {
    return `
<div class="card mt-5 mr-auto ml-auto mb-1 w-25">
  <h2>Create Note</h2>
  <div class=card-body>
    <form action=${url} method=post>
      <div class=form-group>
        <input type=text class=form-control name=title placeholder="Enter title" required>
      </div>
      <div class=form-group>
        <textarea class=form-control name=body placeholder="Enter text"></textarea>
      </div>
      <button type=submit class="btn btn-primary float-right">Save</button>
    </form>
  </div>
</div>`;
};
