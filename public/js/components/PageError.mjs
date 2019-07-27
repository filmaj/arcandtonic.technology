import Tonic from '../tonic.mjs';
export default class PageError extends Tonic {
  render () {
    let qs = document.location.search;
    let error = null;
    if (qs.length) {
      let params = (new URL(document.location)).searchParams;
      if (params.has('error')) {
        error = new DOMParser().parseFromString(params.get('error'), "text/html").documentElement.textContent;
      }
    }
    return `<tonic-toaster-inline id=error-toast type=danger dismiss=true
  display=${error ? 'true' : 'false'}>
    ${error}
</tonic-toaster-inline>`;
  }
}
Tonic.add(PageError);
