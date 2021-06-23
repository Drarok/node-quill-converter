const {
  convertTextToDelta,
  convertHtmlToDelta,
  convertDeltaToHtml } = require('../lib/index.js');


xdescribe('node-quill-converter', () => {
  const { iterate } = require('leakage');

  it('convertTextToDelta - does not leak', () => {
    iterate(() => {
      const text = 'hello, world';

      convertTextToDelta(text);
    })
  })

  it('convertHtmlToDelta - does not leak', () => {
    iterate(() => {
      const html = `<p>hello, <strong>world</strong></p>`;

      convertHtmlToDelta(html);
    })
  })

  it('convertDeltaToHtml - does not leak', () => {
    iterate(() => {
      const delta = {
        ops: [
          {
            insert: "hello, "
          },
          {
            insert: "world",
            attributes: {
              bold: true
            }
          }
        ]
      };

      convertDeltaToHtml(delta);
    })
  })
})
