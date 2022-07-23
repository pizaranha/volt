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
        let xmlElement;
        let billDate;
        let billNit;
        let billIssuer;
        let billId;
        let billSubtotal;
        let billDiscount;
        let billIva;
        let billRetention;
        let billTotal;
        if (xmlItem.getElementsByTagName('cbc:IssueDate')[0] !== undefined) {
          billDate = xmlItem.getElementsByTagName('cbc:IssueDate')[0].childNodes[0].nodeValue;
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
        if (xmlItem.getElementsByTagName('cac:LegalMonetaryTotal').length) {
          xmlElement = xmlItem.getElementsByTagName('cac:LegalMonetaryTotal');
          if (xmlElement[0].getElementsByTagName('cbc:AllowanceTotalAmount')[0] !== undefined) {
            billSubtotal = xmlElement[0].getElementsByTagName('cbc:LineExtensionAmount')[0].childNodes[0].nodeValue;
          } else {
            billSubtotal = '🚩';
          }
          if (xmlElement[0].getElementsByTagName('cbc:AllowanceTotalAmount')[0] !== undefined) {
            billDiscount = xmlElement[0].getElementsByTagName('cbc:AllowanceTotalAmount')[0].childNodes[0].nodeValue;
          } else {
            billDiscount = '🚩';
          }
          if (xmlElement[0].getElementsByTagName('cbc:PayableAmount')[0] !== undefined) {
            billTotal = xmlElement[0].getElementsByTagName('cbc:PayableAmount')[0].childNodes[0].nodeValue;
          } else {
            billTotal = '🚩';
          }
          if (xmlElement[0].getElementsByTagName('cbc:ChargeTotalAmount')[0] !== undefined) {
            billRetention = xmlElement[0].getElementsByTagName('cbc:ChargeTotalAmount')[0].childNodes[0].nodeValue;
          } else {
            billRetention = '🚩';
          }
        } else {
          billSubtotal = '🚩';
          billDiscount = '🚩';
          billRetention = '🚩';
          billTotal = '🚩';
        }
        if (xmlItem.getElementsByTagName('cac:TaxTotal').length) {
          xmlElement = xmlItem.getElementsByTagName('cac:TaxTotal');
          if (xmlElement[0].getElementsByTagName('cbc:TaxAmount')[0] !== undefined) {
            billIva = xmlElement[0].getElementsByTagName('cbc:TaxAmount')[0].childNodes[0].nodeValue;
          } else {
            billIva = '🚩';
          }
        } else {
          billIva = '0';
        }
        let item = '';
        let i = 0;
        let itemID = '';
        let itemDescription = '';
        let itemQuantity = '';
        let itemTax = '';
        let itemPrice = '';
        let itemSubtotal = '';
        for (i; i < xmlItem.getElementsByTagName('cac:InvoiceLine').length; i += 1) {
          xmlElement = xmlItem.getElementsByTagName('cac:InvoiceLine');
          if (xmlElement[i].getElementsByTagName('cac:StandardItemIdentification')[0] !== undefined) {
            itemID = xmlElement[i].getElementsByTagName('cac:StandardItemIdentification')[0].firstElementChild.textContent;
          } else {
            itemID = '🚩';
          }
          if (xmlElement[i].getElementsByTagName('cbc:Description')[0] !== undefined) {
            itemDescription = xmlElement[i].getElementsByTagName('cbc:Description')[0].childNodes[0].nodeValue;
          } else {
            itemDescription = '🚩';
          }
          if (xmlElement[i].getElementsByTagName('cbc:BaseQuantity')[0] !== undefined) {
            itemQuantity = xmlElement[i].getElementsByTagName('cbc:BaseQuantity')[0].childNodes[0].nodeValue;
          } else {
            itemQuantity = '🚩';
          }
          if (xmlElement[i].getElementsByTagName('cbc:PriceAmount')[0] !== undefined) {
            itemPrice = xmlElement[i].getElementsByTagName('cbc:PriceAmount')[0].childNodes[0].nodeValue;
          } else {
            itemPrice = '🚩';
          }
          if (xmlElement[i].getElementsByTagName('cbc:LineExtensionAmount')[0] !== undefined) {
            itemSubtotal = xmlElement[i].getElementsByTagName('cbc:LineExtensionAmount')[0].childNodes[0].nodeValue;
          } else {
            itemSubtotal = '🚩';
          }
          if (xmlElement[i].getElementsByTagName('cbc:Percent')[0] !== undefined) {
            itemTax = xmlElement[i].getElementsByTagName('cbc:Percent')[0].childNodes[0].nodeValue;
          } else {
            itemTax = '0';
          }
          item += `\t \t \t \t \t \t \t \t \t ${itemID} \t ${itemDescription} \t ${itemQuantity} \t ${itemTax} \t ${itemPrice} \t ${itemSubtotal}\n`;
        }
        xmlElement = null;
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
