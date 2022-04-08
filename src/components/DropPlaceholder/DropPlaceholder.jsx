import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useTheme } from '../../ThemeProvider';
import classes from './DropPlaceholder.styles.less';

export default function DropPlaceholder({
  className,
  children,
  onFileAdd,
  accepts = 'text/xml',
}) {
  const [theme] = useTheme();

  return (
    <div className={cx(classes.placeholder, classes[theme], className)}>
      <div className={classes.label}>{children} or</div>
      <label className={classes.inputLabel} htmlFor="file-browse">
        Upload file{' '}
        <input
          className={classes.input}
          type="file"
          id="file-browse"
          accepts={accepts}
          onChange={(event) => event.target.files[0] && onFileAdd(event.target.files[0])}
        />
      </label>
    </div>
  );
}

DropPlaceholder.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string.isRequired,
  onFileAdd: PropTypes.func.isRequired,
  accepts: PropTypes.string,
};
