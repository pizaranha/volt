import prettier from 'prettier/standalone';
import prettierXml from '@prettier/plugin-xml';
/* import xml2csv from 'svg-to-jsx'; */
import optimize from 'svgo-browser/lib/optimize';

function generateComponent(xml) {
  return xml;
}

function xml2csv(xml) {
  return xml;
}

onmessage = (event) => {
  const { payload } = event.data;

  optimize(event.data.content)
    .then((content) => xml2csv(content))
    .then((xml) =>
      prettier.format(generateComponent(xml), { parser: 'xml', plugins: [prettierXml] })
    )
    .then((code) => postMessage({ error: null, payload, code }))
    .catch((error) => postMessage({ error, payload, content: null }));
};
