import React, { useState, useLayoutEffect } from 'react';
import cx from 'classnames';
import { useDocumentTitle, useLocalStorage } from 'xooks';
import Highlight from '../../components/Highlight/Highlight';
import Background from '../../components/Background/Background';
import SettingsLabel from '../../components/SettingsLabel/SettingsLabel';
import DropPlaceholder from '../../components/DropPlaceholder/DropPlaceholder';
import Dropzone from '../../components/Dropzone/Dropzone';
import B64Worker from '../../workers/b64.worker';
import classes from './B64Encoding.styles.less';

const b64 = new B64Worker();

function generateCssExample(content) {
  return `.element {\n  background-image: url(${content});\n}`;
}

export default function B64Encoding() {
  useDocumentTitle('Base64 encoding');

  const ls = useLocalStorage({ key: '@volt/b64-encoding', delay: 500 });
  const transmittedValue = useLocalStorage({ key: '@volt/conversion-after-compression/b64' });
  const [result, setResult] = useState({ loading: false, error: null, content: ls.retrieve() });

  const handleMessage = (event) => {
    const error = event.data instanceof Error;
    if (!error) {
      ls.save(event.data);
    }
    setResult({
      error,
      loading: false,
      content: error ? null : event.data,
    });
  };

  const postMessage = (file) => {
    b64.postMessage({ file });
  };

  useLayoutEffect(() => {
    b64.addEventListener('message', handleMessage);
    const transmittedContent = transmittedValue.retrieveAndClean();

    if (transmittedContent) {
      b64.postMessage({ content: transmittedContent });
    }

    return () => b64.removeEventListener('message', handleMessage);
  }, []);

  const handleFilesDrop = (files) => {
    if (files.length > 0) {
      postMessage(files[0]);
    }
  };

  return (
    <>
      <Dropzone accepts="*" onDrop={handleFilesDrop} />
      <DropPlaceholder
        className={cx({ [classes.fullscreenDrop]: !result.content })}
        onFileAdd={(file) => handleFilesDrop([file])}
        accepts={undefined}
      >
        Drop a file to the browser window to convert it to base64 format
      </DropPlaceholder>
      {result.content && (
        <Background className={classes.wrapper}>
          <div className={classes.section}>
            <SettingsLabel>Raw base64</SettingsLabel>
            <Highlight>{result.content}</Highlight>
          </div>

          <div className={classes.section}>
            <SettingsLabel>Use as CSS background</SettingsLabel>
            <Highlight>{generateCssExample(result.content)}</Highlight>
          </div>
        </Background>
      )}
    </>
  );
}
