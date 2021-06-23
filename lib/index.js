const fs = require('fs');
const path = require('path');

const { JSDOM } = require('jsdom');

let quillFilePath = require.resolve('quill');
let quillMinFilePath = quillFilePath.replace('quill.js', 'quill.min.js');

let quillLibrary = fs.readFileSync(quillMinFilePath);
let mutationObserverPolyfill = fs.readFileSync(path.join(__dirname, 'polyfill.js'));

const JSDOM_TEMPLATE = `
  <div id="editor">hello</div>
  <script>${mutationObserverPolyfill}</script>
  <script>${quillLibrary}</script>
  <script>
    document.getSelection = function() {
      return {
        getRangeAt: function() { }
      };
    };
    document.execCommand = () => false;
  </script>
`;

const cache = {};
const JSDOM_OPTIONS = { runScripts: 'dangerously', resources: 'usable' };
function getQuill() {
  if (!cache.quill) {
    const DOM = new JSDOM(JSDOM_TEMPLATE, JSDOM_OPTIONS);
    cache.quill = new DOM.window.Quill('#editor');
  } else {
    // Fix for crashing bug, see https://github.com/joelcolucci/node-quill-converter/issues/22
    cache.quill.setText('');
  }

  return cache.quill;
}

exports.convertTextToDelta = (text) => {
  const quill = getQuill();
  quill.setText(text);
  return quill.getContents();
};

exports.convertHtmlToDelta = (html) => {
  const quill = getQuill();
  return quill.clipboard.convert(html);
};

exports.convertDeltaToHtml = (delta) => {
  const quill = getQuill();
  quill.setContents(delta);
  return quill.root.innerHTML;
};
