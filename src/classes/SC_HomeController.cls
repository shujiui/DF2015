/**
@author Shuji Ui
@version 8/23/2015
*/
public with sharing class SC_HomeController {
	
	public SC_Community_Configuration__c HomePageConfig {get;set;}
	public SC_HomeController() {
		String homeConfigRecName = 'Home ' + Site.getMasterLabel(); 
		HomePageConfig = SC_Utils.getConfig(homeConfigRecName,'Home Page Configuration');
	}

}