import React from 'react';
import PropTypes from 'prop-types';
import Background from '../../../components/Background/Background';
import Highlight from '../../../components/Highlight/Highlight';
import classes from './Output.styles.less';

export default function Output({ data }) {
  if (data.loading) {
    return (
      <Background className={classes.wrapper}>Processing...</Background>
    );
  }

  if (data.content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.content, 'text/xml');
    let csv = '';
    if (xmlDoc.getElementsByTagName('cbc:RegistrationName').length > 0) {
      const xmlCon = parser.parseFromString(xmlDoc.getElementsByTagName('cbc:Description')[0].childNodes[0].nodeValue, 'text/xml');
      csv = `Supplier
${xmlDoc.getElementsByTagName('cbc:RegistrationName')[0].childNodes[0].nodeValue}
${xmlDoc.getElementsByTagName('cbc:CompanyID')[0].childNodes[0].nodeValue}
${xmlCon.getElementsByTagName('cbc:Line')[0].childNodes[0].nodeValue}
\nCustomer
${xmlDoc.getElementsByTagName('cbc:RegistrationName')[1].childNodes[0].nodeValue}
${xmlDoc.getElementsByTagName('cbc:CompanyID')[1].childNodes[0].nodeValue}
${xmlCon.getElementsByTagName('cbc:Line')[2].childNodes[0].nodeValue}
\nTransaction
${xmlCon.getElementsByTagName('cbc:StartDate')[0].childNodes[0].nodeValue}
${xmlCon.getElementsByTagName('cbc:Description')[0].childNodes[0].nodeValue}
${xmlCon.getElementsByTagName('cbc:PriceAmount')[0].childNodes[0].nodeValue}`;
    } else {
      csv = 'Oh! Looks like this 👆 is not an e-invoice 😮';
    }
    return (
      <Background className={classes.wrapper}>
        <Highlight>{csv}</Highlight>
      </Background>
    );
  }

  return null;
}

Output.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
    loading: PropTypes.bool.isRequired,
  }),
};
