const {
  convertTextToDelta,
  convertHtmlToDelta,
  convertDeltaToHtml } = require('../lib/index.js');

describe('node-quill-converter', () => {
  it('convertTextToDelta', () => {
    let text = 'hello, world';
    let deltaExpected = {ops: [{insert: 'hello, world\n'}]};

    let deltaResult = convertTextToDelta(text);

    expect(deltaResult).toEqual(deltaExpected);
  });

  it('convertHtmlToDelta', () => {
    let html = `<p>hello, <strong>world</strong></p>`;
    let deltaExpected = {
      ops:[
        {
          insert: "hello, "
        },
        {
          insert:"world",
          attributes: {
            bold: true
          }
        }
      ]
    };
    
    let deltaResult = convertHtmlToDelta(html);

    expect(deltaResult).toEqual(deltaExpected);
  });

  it('convertHtmlToDelta', () => {
    let delta = {
      ops:[
        {
          insert: "hello, "
        },
        {
          insert:"world",
          attributes: {
            bold: true
          }
        }
      ]
    };

    let htmlExpected = `<p>hello, <strong>world</strong></p>`;
    let htmlResult = convertDeltaToHtml(delta);

    expect(htmlResult).toEqual(htmlExpected);
  });

  it('GitHub Issue #2', () => {
    let issueDeltaJSON = "{\"ops\":[{\"insert\":\"first\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"second\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"next level\"},{\"attributes\":{\"indent\":1,\"list\":\"ordered\"},\"insert\":\"\\n\"}]}"
    let delta = JSON.parse(issueDeltaJSON);

    let htmlExpected = "<ol><li>first</li><li>second</li><li class=\"ql-indent-1\">next level</li></ol>";
    let htmlResult = convertDeltaToHtml(delta);

    expect(htmlResult).toEqual(htmlExpected);
  });

  it('GitHub Issue #22', () => {
    const sampleData = [
      `<pre>Hola</pre>`,
      `<h3>Hello</h3>`,
    ];

    const test = () => {
      sampleData.forEach((sample) => {
        const delta = convertHtmlToDelta(sample);
        convertDeltaToHtml(delta);
      });
    };

    expect(test).not.toThrow();
  });
});
