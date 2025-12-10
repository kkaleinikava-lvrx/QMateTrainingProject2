import { Ui5Selector } from "wdio-qmate-service/modules/ui5/types/ui5.types";
import { BasePage } from "./basePage.ts";
import { Product } from "../support/product.ts";

class ProductListPage extends BasePage {

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
            "metadata": "sap.m.ObjectIdentifier"
        }
    }

    private static readonly REMOVE_BUTTON_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.Button",
            "text": "Remove"
        }
    }

    private static readonly SEARCH_FIELD_SELECTOR = {
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

    private static readonly TABLE_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
            "metadata": "sap.m.Table",
            "id": "*table"
        }
    }

    private getTabFilterSelector(filterName: string): Ui5Selector {
        return {
             "elementProperties": {
                "viewName": "mycompany.myapp.MyWorklistApp.view.Worklist",
                "metadata": "sap.m.IconTabFilter",
                "text": filterName
            }
        }
    }
   
    async clickOrderButton(): Promise<void> {
        await ui5.userInteraction.click(ProductListPage.ORDER_BUTTON_SELECTOR);
    }

    async clickRemoveButton(): Promise<void> {
        await ui5.userInteraction.click(ProductListPage.REMOVE_BUTTON_SELECTOR);
    }
    
    async clickProduct(productName: string): Promise<void> {
        await ui5.table.openItemByValues(ProductListPage.TABLE_SELECTOR, productName, 0, 
            false, "exact");
    }

    async getTabFilterCount(filterName: string): Promise<number> {
        return parseInt(await ui5.element.getPropertyValue(this.getTabFilterSelector(filterName), "count"));
    }

    async getProductNames(): Promise<Array<string>> {
        const names = [];
        if (await ui5.element.isVisible(ProductListPage.PRODUCT_NAME_SELECTOR)) {
            const elements = await ui5.element.getAllDisplayed(ProductListPage.PRODUCT_NAME_SELECTOR);
            for (const element of elements) {
                names.push(await ui5.control.getProperty(element, "title"));
            }
        }
        return names;
    }

    async getProductDetails(productName: string): Promise<Product> {
        const tableRowSelector = (await ui5.table.getSelectorsForRowsByValues(
            ProductListPage.TABLE_SELECTOR, productName, false, "exact"))[0];
        const supplierNameElement = await ui5.element.getByParent(
            ProductListPage.SUPPLIER_SELECTOR, tableRowSelector);
        const priceElement = await ui5.element.getByParent(
            ProductListPage.PRICE_SELECTOR, tableRowSelector);
        const unitsInStockElement = await ui5.element.getByParent(
            ProductListPage.UNITS_IN_STOCK_SELECTOR, tableRowSelector);
        return {
                productName: productName,
                supplierName: await ui5.control.getProperty(supplierNameElement, "text"),
                price: await ui5.control.getProperty(priceElement, "number") + " " +
                    await ui5.control.getProperty(priceElement, "unit"),
                unitsInStock: parseInt(await ui5.control.getProperty(unitsInStockElement, "number"))
        }
    }

    async openPage(): Promise<void> {
        await common.navigation.navigateToUrl(await util.browser.getBaseUrl() + 
            '/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/mockServer.html');
    }

    async orderProduct(): Promise<void> {
        await this.clickOrderButton();
        await this.waitForMessageToast();
    }

    async removeProduct(): Promise<void> {
        await this.clickRemoveButton();
        await this.waitForMessageToast();
    }

    async searchForProduct(searchText: string): Promise<void> {
        await ui5.userInteraction.searchFor(ProductListPage.SEARCH_FIELD_SELECTOR, searchText);
    }
  
    async selectRowForProduct(productName: string): Promise<void> {
        await ui5.table.selectRowByValues(ProductListPage.TABLE_SELECTOR, productName, 0);
    }
 
    async selectTab(filterName: string) {
        await ui5.userInteraction.clickTab(this.getTabFilterSelector(filterName));
    }

    async waitForMessageToast(): Promise<void> {
        await nonUi5.element.waitToBeVisible(".sapMMessageToast");
    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.getDisplayed(ProductListPage.TABLE_SELECTOR);
    }
}

export default new ProductListPage();