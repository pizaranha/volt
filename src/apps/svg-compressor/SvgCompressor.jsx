import React, { useState, useLayoutEffect, useRef } from 'react';
import { useLocalStorage, useDocumentTitle } from 'xooks';
import SvgInput from '../../components/SvgInput/SvgInput';
import SvgoWorker from '../../workers/svgo.worker';
import processSvgFile from '../../utils/process-svg-file';
import formatFileName from './format-file-name';
import Output from './Output/Output';

const svgo = new SvgoWorker();

const INITIAL_PROGRESS_STATE = {
  loading: false,
  output: null,
  error: null,
};

export default function SvgCompressor() {
  useDocumentTitle('SVG compressor');

  const ls = useLocalStorage({ key: '@volt/svg-compressor', delay: 500 });
  const [value, setValue] = useState(ls.retrieve() || '');
  const [results, setResults] = useState({});
  const queue = useRef(0);
  const incrementQueue = () => {
    queue.current += 1;
  };

  const postTextValue = (text) =>
    svgo.postMessage({
      content: text,
      payload: { name: 'file', index: 'input', queue: queue.current },
    });

  const handleSvgoMessage = (event) => {
    const { index, name, queue: q } = event.data.payload;
    setResults((current) => ({
      ...current,
      [`${index}_${name}`]: {
        queue: q,
        loading: false,
        error: event.data.error,
        content: event.data.content,
      },
    }));
  };

  useLayoutEffect(() => {
    svgo.addEventListener('message', handleSvgoMessage);

    if (value.trim().length > 0) {
      postTextValue(value);
    }

    return () => svgo.removeEventListener('message', handleSvgoMessage);
  }, []);

  const handleFilesDrop = (files) => {
    incrementQueue();
    Promise.all(files.map((file) => processSvgFile(file))).then((filesData) => {
      setResults((current) =>
        filesData.reduce(
          (acc, fileData, index) => {
            acc[`${index}_${fileData.file.name}`] = {
              ...INITIAL_PROGRESS_STATE,
              queue: queue.current,
            };
            return acc;
          },
          { ...current }
        )
      );

      filesData.forEach((fileData, index) => {
        svgo.postMessage({
          content: fileData.text,
          payload: { name: fileData.file.name, index, queue: queue.current },
        });
      });
    });
  };

  const handleChange = (text) => {
    setValue(text);
    incrementQueue();
    ls.save(text);
    postTextValue(text);
  };

  const errors = Object.keys(results).filter((key) => results[key].error);

  return (
    <>
      <SvgInput
        value={value}
        onChange={handleChange}
        errors={errors}
        onFilesDrop={handleFilesDrop}
        formatFileName={formatFileName}
        dropLabel="Drop one or more SVG files to start compression"
      />
      <Output results={results} />
    </>
  );
}
