/* eslint-disable linebreak-style */
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
      if (xmlItem.getElementsByTagName('cbc:Description').length > 0) {
        let billDate = '';
        let billNit;
        let billIssuer;
        let billId;
        let billSubtotal;
        let billDiscount;
        let billIva;
        let billRetention;
        let billTotal;
        if (xmlDoc.getElementsByTagName('cbc:IssueDate')[0] !== undefined) {
          billDate = xmlDoc.getElementsByTagName('cbc:IssueDate')[0].childNodes[0].nodeValue;
        } else {
          billDate = '🚩';
        }
        if (xmlDoc.getElementsByTagName('cbc:CompanyID')[0] !== undefined) {
          billNit = xmlDoc.getElementsByTagName('cbc:CompanyID')[0].childNodes[0].nodeValue;
        } else {
          billNit = '🚩';
        }
        if (xmlDoc.getElementsByTagName('cbc:RegistrationName')[0] !== undefined) {
          billIssuer = xmlDoc.getElementsByTagName('cbc:RegistrationName')[0].childNodes[0].nodeValue;
        } else {
          billIssuer = '🚩';
        }
        if (xmlDoc.getElementsByTagName('cbc:ParentDocumentID')[0] !== undefined) {
          billId = xmlDoc.getElementsByTagName('cbc:ParentDocumentID')[0].childNodes[0].nodeValue;
        } else {
          billId = '🚩';
        }
        if (xmlItem.getElementsByTagName('cbc:TaxableAmount')[0] !== undefined) {
          billSubtotal = xmlItem.getElementsByTagName('cbc:TaxableAmount')[0].childNodes[0].nodeValue;
        } else {
          billSubtotal = '🚩';
        }
        if (xmlItem.getElementsByTagName('cbc:AllowanceTotalAmount')[0] !== undefined) {
          billDiscount = xmlItem.getElementsByTagName('cbc:AllowanceTotalAmount')[0].childNodes[0].nodeValue;
        } else {
          billDiscount = '🚩';
        }
        if (xmlItem.getElementsByTagName('cbc:TaxAmount')[0] !== undefined) {
          billIva = xmlItem.getElementsByTagName('cbc:TaxAmount')[0].childNodes[0].nodeValue;
        } else {
          billIva = '🚩';
        }
        if (xmlItem.getElementsByTagName('cbc:ChargeTotalAmount')[0] !== undefined) {
          billRetention = xmlItem.getElementsByTagName('cbc:ChargeTotalAmount')[0].childNodes[0].nodeValue;
        } else {
          billRetention = '🚩';
        }
        if (xmlItem.getElementsByTagName('cbc:TaxInclusiveAmount')[0] !== undefined) {
          billTotal = xmlItem.getElementsByTagName('cbc:TaxInclusiveAmount')[0].childNodes[0].nodeValue;
        } else {
          billTotal = '🚩';
        }
        let item = '';
        let i = 0;
        let itemID = '';
        let itemDescription = '';
        let itemQuantity = '';
        let itemRetention = '';
        let itemPrice = '';
        let itemSubtotal = '';
        for (i; i < xmlItem.getElementsByTagName('cbc:Description').length; i += 1) {
          itemID = xmlItem.getElementsByTagName('cac:StandardItemIdentification')[i].firstElementChild.textContent;
          itemDescription = xmlItem.getElementsByTagName('cbc:Description')[i].childNodes[0].nodeValue;
          itemQuantity = xmlItem.getElementsByTagName('cbc:BaseQuantity')[i].childNodes[0].nodeValue;
          if (xmlItem.getElementsByTagName('cbc:TaxableAmount')[i] !== undefined) {
            itemRetention = xmlItem.getElementsByTagName('cbc:Percent')[i].childNodes[0].nodeValue;
            itemSubtotal = xmlItem.getElementsByTagName('cbc:TaxableAmount')[i].childNodes[0].nodeValue;
          } else {
            itemRetention = '¿?';
            itemSubtotal = '¿?';
          }
          itemPrice = xmlItem.getElementsByTagName('cbc:PriceAmount')[i].childNodes[0].nodeValue;
          item += `\t \t \t \t \t \t \t \t \t ${itemID} \t ${itemDescription} \t ${itemQuantity} \t ${itemRetention} \t ${itemPrice} \t ${itemSubtotal}\n`;
        }
        csv = `Bill Date \t Issuer NIT \t Issuer Name \t Bill # \t Subtotal \t Discount \t IVA \t Retention \t Total \t Item \t Description \t Quantity \t Tax \t Unit Cost \t Total by item
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
  }
  return null;
}

Output.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
    loading: PropTypes.bool.isRequired,
  }),
};
