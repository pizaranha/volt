import React, { useLayoutEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTheme } from '../../ThemeProvider';
import classes from './Dropzone.styles.less';

const preventDefault = (event) => event.preventDefault();

export default function Dropzone({ onDrop, accepts = ['text/xml'] }) {
  const [theme] = useTheme();
  const [dragOver, setDragOver] = useState(false);
  const dragLeaveTimeout = useRef();
  const allowAll = accepts === '*';

  const onDragOver = () => {
    clearTimeout(dragLeaveTimeout.current);
    setDragOver(true);
  };

  const onDragLeave = () => {
    clearTimeout(dragLeaveTimeout.current);
    dragLeaveTimeout.current = setTimeout(() => {
      setDragOver(false);
    }, 20);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    clearTimeout(dragLeaveTimeout.current);
    setDragOver(false);
    onDrop([...event.dataTransfer.files].filter((file) => allowAll || accepts.includes(file.type)));
  };

  useLayoutEffect(() => {
    document.addEventListener('dragover', preventDefault, false);
    document.addEventListener('drop', handleDrop, false);
    document.addEventListener('dragover', onDragOver, false);
    document.addEventListener('dragleave', onDragLeave, false);

    return () => {
      document.removeEventListener('dragover', preventDefault, false);
      document.removeEventListener('drop', handleDrop, false);
      document.removeEventListener('dragover', onDragOver, false);
      document.removeEventListener('dragleave', onDragLeave, false);
    };
  }, []);

  return dragOver ? (
    <div className={cx(classes.wrapper, classes[theme])}>
      <h1 className={classes.title}>Drop files to browser window</h1>
    </div>
  ) : null;
}

Dropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
  accepts: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
};
