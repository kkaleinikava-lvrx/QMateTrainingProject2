import { QmateSelector, Ui5Selector } from "wdio-qmate-service/modules/ui5/types/ui5.types";
import { BasePage } from "./basePage.ts";
import { Product } from "../support/product.ts";

class ProductListPage extends BasePage {

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

    private getTabFilterSelector(filterName: string): QmateSelector {
        return {
             "elementProperties": {
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.IconTabFilter",
                "text": filterName
            }
        }
    }

    private getProductNameSiblingSelector(productName:string): QmateSelector {
        return {
            "elementProperties": { },
            "siblingProperties": {
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.ObjectIdentifier",
                "title": productName
            }
        }
    }

    private getProductNameSelector(productName:string): QmateSelector {
        return {
            "elementProperties": {
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.ObjectIdentifier",
                "title": productName
            }
        }
    }

    private getListItemSelector(productName:string): QmateSelector {
        return {
            "elementProperties": { 
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.ColumnListItem"
            },
            "childProperties": {
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.ObjectIdentifier",
                "title": productName
            }
        }
    }
    
    async clickCheckboxForProduct(productName: string): Promise<void> {
        const checkBoxSelector = {...(this.getProductNameSiblingSelector(productName) as object), 
            ...ProductListPage.ITEM_CHECKBOX_SELECTOR} as QmateSelector;
        await ui5.userInteraction.check(checkBoxSelector);

    }
    
    async clickOrderButton(): Promise<void> {
        await ui5.userInteraction.click(ProductListPage.ORDER_BUTTON_SELECTOR);
    }

    async clickRemoveButton(): Promise<void> {
        await ui5.userInteraction.click(ProductListPage.REMOVE_BUTTON_SELECTOR);
    }
    
    async clickRowForProduct(productName: string): Promise<void> {
        await ui5.userInteraction.clickListItem(this.getListItemSelector(productName));
    }

    async getTabFilterCount(filterName: string): Promise<number> {
        return parseInt(await ui5.element.getPropertyValue(this.getTabFilterSelector(filterName), "count"));
    }

    async getRowCount(): Promise<number> {
        if (await ui5.element.isVisible(ProductListPage.PRODUCT_NAME_SELECTOR)) {
            return (await ui5.element.getAllDisplayed(ProductListPage.PRODUCT_NAME_SELECTOR)).length;
        } else {
            return 0;
        }
    }

    async getProductList(): Promise<Array<Product>> {
        const productList: Array<Product> = [];
        const rowCount = await this.getRowCount();
        for(let i = 0; i < rowCount; i++) {
            productList.push({
                productName: await ui5.element.getPropertyValue(ProductListPage.PRODUCT_NAME_SELECTOR, "text", i),
                unitsInStock: parseInt(await ui5.element.getPropertyValue(ProductListPage.UNITS_IN_STOCK_SELECTOR, "number", i))
            });
        }
        return productList;
    }

    async getProductDetails(productName: string): Promise<Product> {
        const productNameSelector = this.getProductNameSelector(productName);
        const supplierNameSelector = {...(this.getProductNameSiblingSelector(productName) as object), 
            ...ProductListPage.SUPPLIER_SELECTOR} as QmateSelector;
        const priceSelector = {...(this.getProductNameSiblingSelector(productName) as object), 
            ...ProductListPage.PRICE_SELECTOR} as QmateSelector;
        const unitsInStockSelector = {...(this.getProductNameSiblingSelector(productName) as object), 
            ...ProductListPage.UNITS_IN_STOCK_SELECTOR} as QmateSelector;
        
        return {
                productName: await ui5.element.getPropertyValue(productNameSelector, "title"),
                supplierName: await ui5.element.getPropertyValue(supplierNameSelector, "text"),
                price: parseFloat(await ui5.element.getPropertyValue(priceSelector, "number")),
                unitsInStock: parseInt(await ui5.element.getPropertyValue(unitsInStockSelector, "number"))
        }
    }

    async openPage(): Promise<void> {
        await browser.url('/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/mockServer.html');
    }

    async orderProduct(): Promise<void> {
        await this.clickOrderButton();
        await ui5.assertion.expectMessageToastTextToBe("Product stock level updated");
    }
    async removeProduct(): Promise<void> {
        await this.clickRemoveButton();
        await ui5.assertion.expectMessageToastTextToBe("Product removed");
    }
    
    async searchForProduct(searchText: string): Promise<void> {
        await ui5.userInteraction.searchFor(ProductListPage.SERACH_FIELD_SELECTOR, searchText);
    }

    async selectTab(filterName: string) {
        await ui5.userInteraction.clickTab(this.getTabFilterSelector(filterName));
    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.waitForAll(ProductListPage.WORKLIST_TOOLBAR);
    }
}

export default new ProductListPage();