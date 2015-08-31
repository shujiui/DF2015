/**
	@author Shuji Ui
	@version 08/31/2015
*/
public with sharing class SC_HeaderController {
	public SC_Community_Configuration__c PageConfig {get;set;}
	public SC_HeaderController() {
		String configRecName = 'Header ' + Site.getMasterLabel(); 
		PageConfig = SC_Utils.getConfig(configRecName,'Header Navigation');
	}
}