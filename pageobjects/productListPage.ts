import { QmateSelector } from "wdio-qmate-service/modules/ui5/types/ui5.types";
import { BasePage } from "./basePage";

export class ProductListPage extends BasePage {

    private static readonly ALL_PRODUCTS_TAB_FILTER_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.IconTabFilter",
            "id": "__filter0"
        }
    }
    private static readonly ITEM_CHECKBOX_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.CheckBox",
            "id": "*item*"
        }
    }
    private static readonly ORDER_BUTTON_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.Button",
            "text": "Order"
        }
    }
    private static readonly OUT_OF_STOCK_TAB_FILTER_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.IconTabFilter",
            "id": "__filter3"
        }
    }
    private static readonly PLENTY_IN_STOCK_TAB_FILTER_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.IconTabFilter",
            "id": "__filter1"
        }
    }
    private static readonly PRICE_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.ObjectNumber",
            "number": [
                {
                    "path": "UnitPrice"
                }
            ]
        }
    }
    private static readonly PRODUCT_NAME_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.Text",
            "id": "__identifier0-*-txt"
        }
    }
    private static readonly REMOVE_BUTTON_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.Button",
            "text": "Remove"
        }
    }
    private static readonly SERACH_FIELD_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.SearchField",
            "id": "*searchField"
        }
    }
    private static readonly SHORTAGE_TAB_FILTER_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.IconTabFilter",
            "id": "__filter2"
        }
    }
    private static readonly SUPPLIER_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.Text",
            "text": [
                {
                    "path": "Supplier/CompanyName"
                }
            ]
        }
    }
    private static readonly UNITS_IN_STOCK_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.ObjectNumber",
            "number": [
                {
                    "path": "UnitsInStock"
                }
            ]
        }
    }
    private static readonly WORKLIST_TOOLBAR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.Toolbar"
        }
    }

    private getProductNameSiblingSelector(productName:string): QmateSelector{
        return {
            "elementProperties": { },
            "siblingProperties": {
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.Text",
                "id": "__identifier0-*-txt",
                "text": productName
            }
        }
    }

    private getListItemSelector(productName:string): QmateSelector{
        return {
            "elementProperties": { 
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.ColumnListItem"
            },
            "childProperties": {
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.Text",
                "id": "__identifier0-*-txt",
                "text": productName
            }
        }
    }

    async clickOrderButton(): Promise<void> {
        await ui5.userInteraction.click(ProductListPage.ORDER_BUTTON_SELECTOR);
    }
    async clickRemoveButton(): Promise<void> {
        await ui5.userInteraction.click(ProductListPage.REMOVE_BUTTON_SELECTOR);
    }

    async clickRow(productName: string): Promise<void> {
        await ui5.userInteraction.clickListItem(this.getListItemSelector(productName));
    }
    async getAllProductsCount(): Promise<number> {
        return parseInt(await ui5.element.getPropertyValue(ProductListPage.ALL_PRODUCTS_TAB_FILTER_SELECTOR, "count"));
    }
    async getOutOfStockCount(): Promise<number> {
        return parseInt(await ui5.element.getPropertyValue(ProductListPage.OUT_OF_STOCK_TAB_FILTER_SELECTOR, "count"));
    }
    async getPlentyInStockCount(): Promise<number> {
        return parseInt(await ui5.element.getPropertyValue(ProductListPage.PLENTY_IN_STOCK_TAB_FILTER_SELECTOR, "count"));
    }
    async getShortageCount(): Promise<number> {
        return parseInt(await ui5.element.getPropertyValue(ProductListPage.SHORTAGE_TAB_FILTER_SELECTOR, "count"));
    }

    async getRowCount(): Promise<number> {
        return (await ui5.element.getAllDisplayed(ProductListPage.ITEM_CHECKBOX_SELECTOR)).length;
    }
    
    async getProductList(): Promise<Array<object>> {
        const productList: Array<object> = [];
        for(let i = 0; i < await this.getRowCount(); i++) {
            productList.push({
                productName: await ui5.element.getPropertyValue(ProductListPage.PRODUCT_NAME_SELECTOR, "text", i),
                supplier: await ui5.element.getPropertyValue(ProductListPage.SUPPLIER_SELECTOR, "text", i),
                price: parseFloat(await ui5.element.getPropertyValue(ProductListPage.PRICE_SELECTOR, "number", i)),
                unitsInStock: parseInt(await ui5.element.getPropertyValue(ProductListPage.UNITS_IN_STOCK_SELECTOR, "number", i))
            });
        }
        return productList;
    }

    async getUnitsInStockByProduct(productName: string): Promise<number> {
        const unitsInStockSelector = {...(this.getProductNameSiblingSelector(productName) as object), 
            ...ProductListPage.UNITS_IN_STOCK_SELECTOR} as QmateSelector;
        return parseInt(await ui5.element.getPropertyValue(unitsInStockSelector, "number"));
    }

    async searchForProduct(searchText: string): Promise<void> {
        await ui5.userInteraction.searchFor(ProductListPage.SERACH_FIELD_SELECTOR, searchText);
        // await common.userInteraction.pressEnter();
    }

    async selectProduct(productName: string): Promise<void> {
        const checkBoxSelector = {...(this.getProductNameSiblingSelector(productName) as object), 
            ...ProductListPage.ITEM_CHECKBOX_SELECTOR} as QmateSelector;
        await ui5.userInteraction.check(checkBoxSelector);
    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.waitForAll(ProductListPage.WORKLIST_TOOLBAR);
    }
}