import React from 'react';
import PropTypes from 'prop-types';
import Background from '../../../components/Background/Background';
import SettingsLabel from '../../../components/SettingsLabel/SettingsLabel';
import directions from '../directions';
import DirectionPicker from '../DirectionPicker/DirectionPicker';
import SizePicker from '../SizePicker/SizePicker';
import ColorPicker from '../ColorPicker/ColorPicker';
import classes from './Settings.styles.less';

export default function Settings({ values, handlers }) {
  return (
    <Background className={classes.wrapper}>
      <div className={classes.inner}>
        <div className={classes.section}>
          <SettingsLabel>Direction</SettingsLabel>
          <DirectionPicker value={values.direction} onChange={handlers.onDirectionChange} />
        </div>

        <div className={classes.section}>
          <SettingsLabel>Size</SettingsLabel>
          <SizePicker
            value={{ width: values.width, height: values.height }}
            predefinedSizes={values.predefinedSizes}
            setPredefinedSize={handlers.setPredefinedSize}
            activePredefinedSize={values.activePredefinedSize}
            onWidthChange={handlers.onWidthChange}
            onHeightChange={handlers.onHeightChange}
          />
        </div>

        <div className={classes.section}>
          <SettingsLabel>Color</SettingsLabel>
          <ColorPicker value={values.color} onChange={handlers.onColorChange} />
        </div>
      </div>
    </Background>
  );
}

Settings.propTypes = {
  values: PropTypes.shape({
    predefinedSizes: PropTypes.object,
    activePredefinedSize: PropTypes.string,
    direction: PropTypes.oneOf(directions).isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,

  handlers: PropTypes.shape({
    onDirectionChange: PropTypes.func.isRequired,
    onWidthChange: PropTypes.func.isRequired,
    onHeightChange: PropTypes.func.isRequired,
    onColorChange: PropTypes.func.isRequired,
    setPredefinedSize: PropTypes.func.isRequired,
  }),
};
