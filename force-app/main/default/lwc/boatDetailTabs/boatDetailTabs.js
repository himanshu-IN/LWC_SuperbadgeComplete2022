import { LightningElement, wire } from 'lwc';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import BOAT_OBJECT from '@salesforce/schema/Boat__c';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import BOAT_TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import BOAT_LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import BOAT_PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import BOAT_DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import BOATMC from "@salesforce/messageChannel/boatMessageChannel__c";
import {
  subscribe,
  MessageContext,
  APPLICATION_SCOPE
} from 'lightning/messageService';

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  boatId;
  boatObjectName = BOAT_OBJECT;
  boatTypeField = BOAT_TYPE_FIELD;
  boatLengthField = BOAT_LENGTH_FIELD;
  boatPriceField = BOAT_PRICE_FIELD;
  boatDescriptionField = BOAT_DESCRIPTION_FIELD;

  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };
  
  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() { 
    return this.wiredRecord.data ? 'utility:anchor': null;
  }
  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() {
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
   }
   @wire(MessageContext)
   messageContext;
   @wire(getRecord,{recordId : '$boatId',fields : BOAT_FIELDS})wiredRecord;
  // Private
  subscription = null;

  // Subscribe to the message channel
  subscribeMC() {
    // local boatId must receive the recordId from the message
    this.subscription = subscribe(this.messageContext, BOATMC, (message) => { this.boatId = message.recordId }, { scope: APPLICATION_SCOPE });

  }
  
  // Calls subscribeMC()
  connectedCallback() { 
    if (this.subscription || this.boatId) {
      return;
    }
    this.subscribeMC();
  }
  
  // Navigates to record page
  navigateToRecordViewPage() { 
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        objectApiName: "Account",
        actionName: "view",
        recordId: this.boatId
      }
    });
  }
  
  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() { 
    let tabset = this.template.querySelector('<lightning-tabset>');
    tabset.activeTabValue = this.label.labelAddReview;
    this.template.querySelectorAll('c-boat-reviews').refresh();
  }
}
