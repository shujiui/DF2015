/**
	@author Shuji Ui
	@version 8/26/2015
*/
public with sharing class SC_CSSMainController {
	
	public String BrandPrimaryColor {get;set;}
	public String BrandPrimaryDarkColor {get;set;}
	public String BrandSecondaryColor{get;set;}
	public String BrandPrimaryTextColor{get;set;}
	public String BrandSecondaryTextColor{get;set;}


	public SC_CSSMainController(){
		String homeConfigName = 'Brand ' + Site.getMasterLabel(); 
		SC_Community_Configuration__c config = SC_Utils.getConfig(homeConfigName,'Brand Colors' );
		BrandPrimaryColor  = config.Brand_Primary_Color__c;
		BrandPrimaryDarkColor = config.Brand_Primary_Dark_Color__c;
		BrandSecondaryColor = config.Brand_Secondary_Color__c;
		BrandPrimaryTextColor = config.Brand_Primary_Text_Color__c;
		BrandSecondaryTextColor = config.Brand_Secondary_Text_Color__c;
	}
}