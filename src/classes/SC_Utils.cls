/**
@author Shuji Ui
@version 8/23/2015
*/

public with sharing class SC_Utils {
	public static SC_Community_Configuration__c  getConfig(String configName, String recordType){

		List<SC_Community_Configuration__c> listOfHC = [select 	Home_Page_Title__c,
																Home_Page_Description__c,
																Brand_Primary_Color__c,
																Brand_Primary_Dark_Color__c,
																Brand_Primary_Text_Color__c,
																Brand_Secondary_Color__c,
																Brand_Secondary_Text_Color__c,
																Header_Nav_Label_1__c,	
																Header_Nav_Label_2__c,	
																Header_Nav_Label_3__c,	
																Header_Nav_URL_1__c,	
																Header_Nav_URL_2__c,	
																Header_Nav_URL_3__c,
																Header_Logo_URL__c
														from 	SC_Community_Configuration__c
														where RecordType.Name = :recordType and Name = :configName limit 1];
		if(listOfHC.size()>0){
			return listOfHC[0];
		}else {
			// TODO throw exception
		}
		return null;
	}
}