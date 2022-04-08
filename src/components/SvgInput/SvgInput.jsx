import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../ThemeProvider';
import Button from '../Button/Button';
import SettingsLabel from '../SettingsLabel/SettingsLabel';
import Background from '../Background/Background';
import Dropzone from '../Dropzone/Dropzone';
import DropPlaceholder from '../DropPlaceholder/DropPlaceholder';
import example from './example';
import classes from './SvgInput.styles.less';

export default function SvgInput({
  value,
  onChange,
  errors,
  onFilesDrop,
  dropLabel,
  formatFileName = (f) => f,
}) {
  const [theme] = useTheme();
  const formattedErrors = errors.map((error, index) => (
    <p className={classes.error} key={index}>
      Failed to parse or minify file {formatFileName(error)}
    </p>
  ));

  return (
    <div className={classes[theme]}>
      <Dropzone onDrop={onFilesDrop} />
      <DropPlaceholder onFileAdd={(file) => onFilesDrop([file])}>{dropLabel}</DropPlaceholder>
      <Background className={classes.wrapper}>
        <div className={classes.header}>
          <SettingsLabel className={classes.title}>Paste SVG markup</SettingsLabel>
          <Button onClick={() => onChange(example)}>Load example</Button>
        </div>
        <textarea
          placeholder="Paste SVG markup here"
          className={classes.input}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {formattedErrors.length > 0 && <div className={classes.errors}>{formattedErrors}</div>}
      </Background>
    </div>
  );
}

SvgInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilesDrop: PropTypes.func.isRequired,
  dropLabel: PropTypes.string.isRequired,
  formatFileName: PropTypes.func,
};
