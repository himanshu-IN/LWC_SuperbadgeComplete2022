public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        try {
            //return [select id,FirstName, LastName, Email from Contact];
            throw new AuraHandledException('Forced error');
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}