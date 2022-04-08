import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocalStorage } from 'xooks';
import Tabs from '../../../components/Tabs/Tabs';
import Background from '../../../components/Background/Background';
import Highlight from '../../../components/Highlight/Highlight';
import directions from '../directions';
import generateExample from './generate-example';
import classes from './Code.styles.less';

const languages = ['.css', '.scss', '.jss'].map((language) => ({
  value: language,
  label: language,
}));

export default function Code({ values }) {
  const ls = useLocalStorage({ key: '@volt/triangle-generator/code', delay: 10 });
  const [language, setLanguage] = useState(ls.retrieve() || '.css');
  const [elementExample, pseudoExample] = generateExample(language, values)[1];

  const handleLanguageChange = (l) => {
    setLanguage(l);
    ls.save(l);
  };

  return (
    <Background className={classes.wrapper}>
      <Tabs data={languages} active={language} onTabChange={handleLanguageChange} />
      <div className={classes.code}>
        <div className={classes.section}>
          <div className={classes.title}>Element</div>
          <Highlight>{elementExample}</Highlight>
        </div>

        <div className={classes.section}>
          <div className={classes.title}>Pseudo-element</div>
          <Highlight>{pseudoExample}</Highlight>
        </div>
      </div>
    </Background>
  );
}

Code.propTypes = {
  values: PropTypes.shape({
    direction: PropTypes.oneOf(directions).isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
};
