export default class Tonic extends window.HTMLElement {
constructor () { super(); const state = Tonic._states[this.id]; delete Tonic._states[this.id], this.state = state || {}, this.props = {}, this.initialChildElements = [...this.children].map(el => el.cloneNode(!0)), this.initialChildElements.__children__ = !0, this.initialChildNodes = [...this.childNodes].map(el => el.cloneNode(!0)), this.initialChildNodes.__children__ = !0, this._events() } static _createId () { return Math.random().toString(16).slice(2) } static match (el, s) { return el.matches || (el = el.parentElement), el.matches(s) ? el : el.closest(s) } static add (c) { if (c.prototype._props = Object.getOwnPropertyNames(c.prototype), !c.name || c.name.length === 1) throw Error("Mangling. https://bit.ly/2TkJ6zP"); const name = Tonic._splitName(c.name).toLowerCase(); window.customElements.get(name) || (Tonic._reg[name] = c, Tonic._tags = Object.keys(Tonic._reg).join(), window.customElements.define(name, c)) } static sanitize (o) { if (!o) return o; for (const [k, v] of Object.entries(o)) typeof v === "object" && (o[k] = Tonic.sanitize(v)), typeof v === "string" && (o[k] = Tonic.escape(v)); return o } static escape (s) { return s.replace(Tonic.ESC, c => Tonic.MAP[c]) } static _splitName (s) { return s.match(/[A-Z][a-z]*/g).join("-") } static _normalizeAttrs (o, x = {}) { return [...o].forEach(o => x[o.name] = o.value), x }html ([s, ...strings], ...values) { return values.map(o => { if (o && o.__children__) return this._placehold(o); switch ({}.toString.call(o)) { case "[object HTMLCollection]":case "[object NodeList]":return this._placehold([...o]); case "[object Array]":case "[object Object]":case "[object Function]":return this._prop(o); case "[object NamedNodeMap]":return this._prop(Tonic._normalizeAttrs(o)); case "[object Number]":return `${o}__float`; case "[object Boolean]":return `${o}__boolean` } return o }).reduce((a, b) => a.concat(b, strings.shift()), [s]).join("") }setState (o) { this.state = typeof o === "function" ? o(this.state) : o }getState () { return this.state }reRender (o = this.props) { if (this.props = Tonic.sanitize(typeof o === "function" ? o(this.props) : o), this._set(this, this.render()), this.updated) { const oldProps = JSON.parse(JSON.stringify(this.props)); this.updated(oldProps) } }getProps () { return this.props }handleEvent (e) { this[e.type](e) }_events () { const hp = Object.getOwnPropertyNames(window.HTMLElement.prototype); for (const p of this._props)hp.indexOf("on" + p) !== -1 && this.addEventListener(p, this) }_set (target, content = "") {
 for (const node of target.querySelectorAll(Tonic._tags))Tonic._refs.findIndex(ref => ref === node) !== -1 && (Tonic._states[node.id] = node.getState()); if (typeof content === "string") {
 if (content = content.replace(Tonic.SPREAD, (_, p) => { const o = Tonic._data[p.split("__")[1]][p]; return Object.entries(o).map(([key, value]) => `${key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}="${Tonic.escape(String(value))}"`).join(" ") }), target.innerHTML = content, this.styles) { const styles = this.styles(); for (const node of target.querySelectorAll("[styles]")) for (const s of node.getAttribute("styles").split(/\s+/))Object.assign(node.style, styles[s.trim()]) } const children = Tonic._children[this._id] || {},
walk = (node, fn) => { if (node.nodeType === 3) { const id = node.textContent.trim(); if (children[id]) return fn(node, children[id]) }node = node.firstChild; while (node)walk(node, fn), node = node.nextSibling }; walk(target, (node, children) => { for (const child of children)node.parentNode.appendChild(child); delete Tonic._children[this._id][node.id], node.parentNode.removeChild(node) })
} else target.innerHTML = "", target.appendChild(content.cloneNode(!0)); if (this.stylesheet) { const styleNode = document.createElement("style"); styleNode.appendChild(document.createTextNode(this.stylesheet())), target.insertBefore(styleNode, target.firstChild) }
}_prop (o) {
 const id = this._id,
p = `__${id}__${Tonic._createId()}__`; return Tonic._data[id] = Tonic._data[id] || {}, Tonic._data[id][p] = o, p
}_placehold (r) { const ref = `__${Tonic._createId()}__`; return Tonic._children[this._id] = Tonic._children[this._id] || {}, Tonic._children[this._id][ref] = r, ref }connectedCallback () {
 if (this.root = this.shadowRoot || this, this.childElements = this.children, this.wrap) { const render = this.render; this.render = (() => this.wrap(render.bind(this))) }Tonic._refs.push(this); const cc = s => s.replace(/-(.)/g, (_, m) => m.toUpperCase()); for (const {name: _name, value} of this.attributes) {
 const name = cc(_name),
p = this.props[name] = value; if ((/__\w+__\w+__/).test(p)) { const {1: root} = p.split("__"); this.props[name] = Tonic._data[root][p] } else (/\d+__float/).test(p) ? this.props[name] = parseFloat(p, 10) : (/\w+__boolean/).test(p) && (this.props[name] = p.includes("true"))
} this.props = Object.assign(this.defaults && this.defaults() || {}, Tonic.sanitize(this.props)), this._id ? this.innerHTML = this.source : this.source = this.innerHTML, this._id = this._id || Tonic._createId(), this.willConnect && this.willConnect(), this._set(this, this.render()), this.connected && this.connected()
}disconnectedCallback (index) { this.disconnected && this.disconnected(), this.initialChildElements.length = 0, this.initialChildNodes.length = 0, delete Tonic._data[this._id], delete Tonic._children[this._id], Tonic._refs.splice(index, 1) }
}Object.assign(Tonic, {_tags: "",
_refs: [],
_data: {},
_states: {},
_children: {},
_reg: {},
_index: 0,
SPREAD: /\.\.\.(__\w+__\w+__)/g,
ESC: /["&'<>`]/g,
MAP: {'"': "&quot;",
"&": "&amp;",
"'": "&#x27;",
"<": "&lt;",
">": "&gt;",
"`": "&#x60;"}}), typeof module === "object" && (module.exports = Tonic);
