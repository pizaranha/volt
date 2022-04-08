import React, { useState, useLayoutEffect } from 'react';
import { useDocumentTitle, useLocalStorage } from 'xooks';
import XmlInput from '../../components/XmlInput/XmlInput';
import Xml2csvWorker from '../../workers/xml-to-csv.worker';
import processXmlFile from '../../utils/process-xml-file';
import Output from './Output/Output';

const xml2csv = new Xml2csvWorker();

export default function XmlToCsv() {
  useDocumentTitle('XML to CSV');

  const ls = useLocalStorage({ key: '@volt/xml-to-csv', delay: 1000 });
  const transmittedValue = useLocalStorage({ key: '@volt/conversion-after-compression/csv' });
  const [value, setValue] = useState(transmittedValue.retrieveAndClean() || ls.retrieve() || '');
  const [result, setResult] = useState({ loading: false, error: null, content: null });

  const handleMessage = (event) => {
    setResult({ loading: false, error: event.data.error, content: event.data.code });
  };

  const postMessage = (text) => xml2csv.postMessage({ content: text });

  useLayoutEffect(() => {
    xml2csv.addEventListener('message', handleMessage);

    if (value.trim().length > 0) {
      setResult({ loading: true, content: null, error: null });
      postMessage(value);
    }

    return () => xml2csv.removeEventListener('message', handleMessage);
  }, []);

  const handleChange = (text) => {
    setValue(text);
    ls.save(text);
    setResult({ loading: true, content: null, error: null });
    postMessage(text);
  };

  const handleFilesDrop = (files) => {
    if (files.length > 0) {
      processXmlFile(files[0]).then((file) => handleChange(file.text));
    }
  };

  return (
    <div>
      <XmlInput
        value={value}
        onChange={handleChange}
        errors={result.error && value.trim().length > 0 ? ['input file'] : []}
        onFilesDrop={handleFilesDrop}
        dropLabel="Drop an XML file to the browser window to optimize it and convert it to CSV"
      />

      <Output data={result} />
    </div>
  );
}
