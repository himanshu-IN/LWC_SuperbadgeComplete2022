import { LightningElement, wire } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

const columns = [
    { label: 'First Name', fieldName: FIRST_NAME_FIELD },
    { label: 'Last Name', fieldName: LAST_NAME_FIELD },
    { label: 'Email', fieldName: EMAIL_FIELD, type: 'email' },
];

export default class ContactList extends LightningElement {
    columns = columns;
    data = [];
    get errors() {
        return (this.accounts.error) ?
            reduceErrors(this.accounts.error) : [];
    }
    @wire (getContacts)setData({ error, data }){
        if (data) {
            this.data = data
        }
    };

}