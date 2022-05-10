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
      const xmlItem = parser.parseFromString(xmlDoc.getElementsByTagName('cbc:Description')[0].childNodes[0].nodeValue, 'text/xml');
      let item = '';
      let i = 0;
      for (i; i < xmlItem.getElementsByTagName('cbc:Description').length; i += 1) {
        item = item + `\t \t \t \t \t \t \t \t \t ${xmlItem.getElementsByTagName('cbc:ID')[i*4+18].childNodes[0].nodeValue} \t ${xmlItem.getElementsByTagName('cbc:Description')[i].childNodes[0].nodeValue} \t ${xmlItem.getElementsByTagName('cbc:BaseQuantity')[i].childNodes[0].nodeValue} \t ${xmlItem.getElementsByTagName('cbc:Percent')[i].childNodes[0].nodeValue} \t ${xmlItem.getElementsByTagName('cbc:PriceAmount')[i].childNodes[0].nodeValue} \t ${xmlItem.getElementsByTagName('cbc:TaxableAmount')[i+2].childNodes[0].nodeValue}\n`;
      }
      const billDate = xmlDoc.getElementsByTagName('cbc:IssueDate')[0].childNodes[0].nodeValue;
      const billNit = xmlDoc.getElementsByTagName('cbc:CompanyID')[0].childNodes[0].nodeValue;
      const billIssuer = xmlDoc.getElementsByTagName('cbc:RegistrationName')[0].childNodes[0].nodeValue;
      const billId = xmlDoc.getElementsByTagName('cbc:ParentDocumentID')[0].childNodes[0].nodeValue;
      const billSubtotal = xmlItem.getElementsByTagName('cbc:TaxableAmount')[0].childNodes[0].nodeValue;
      const billDiscount = 'falta descuento';
      const billIva = xmlItem.getElementsByTagName('cbc:TaxAmount')[0].childNodes[0].nodeValue;
      const billRetention = 'falta retención';
      const billTotal = xmlItem.getElementsByTagName('cbc:TaxInclusiveAmount')[0].childNodes[0].nodeValue;
      csv = `Bill Date \t Issuer NIT \t Issuer Name \t Bill # \t Subtotal \t Discount \t IVA \t Retention \t Total \t Item \t Description \t Quantity \t Tax Category \t Unit Cost \t Total by item
${billDate} \t ${billNit} \t ${billIssuer} \t ${billId} \t ${billSubtotal} \t ${billDiscount} \t ${billIva} \t ${billRetention} \t ${billTotal}
${item}`;
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
