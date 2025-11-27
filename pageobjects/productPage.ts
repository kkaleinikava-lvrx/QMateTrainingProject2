import { BasePage } from "./basePage";

export class ProductPage extends BasePage {
    private static readonly PAGE_HEADER_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Object",
            "metadata": "sap.f.DynamicPageHeader",
            "id": "*page-pageHeader"
        }
    }
    private static readonly PRICE_TEXT_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Object",
            "metadata": "sap.m.Text",
            "text": "Price: *"
        }
    }

    private static readonly PRODUCT_NAME_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Object",
            "metadata": "sap.m.Title"
        }
    }

    private static readonly SUPPLIER_NAME_SELECTOR = {
        "elementProperties": {
            "viewName": "mycompany.myapp.MyWorklistApp.view.Object",
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
            "viewName": "mycompany.myapp.MyWorklistApp.view.Object",
            "metadata": "sap.m.ObjectNumber",
            "id": "*objectHeader"
        }
    }

    async getPrice(): Promise<number> {
        return parseFloat(await ui5.element.getPropertyValue(ProductPage.PRICE_TEXT_SELECTOR, "text"));
    }
    async getProductName(): Promise<string> {
        return await ui5.element.getValue(ProductPage.PRODUCT_NAME_SELECTOR);
    }
    async getSupplierName(): Promise<string> {
        return await ui5.element.getValue(ProductPage.SUPPLIER_NAME_SELECTOR);
    }
    async getUnitsInStock(): Promise<number> {
        return parseInt(await ui5.element.getPropertyValue(ProductPage.UNITS_IN_STOCK_SELECTOR, "number"));
    }

    async getProductDetails(): Promise<object> {
        return { 
            productName: await this.getProductName(),
            price: await this.getPrice(),
            unitsInStock: await this.getUnitsInStock(),
            supplierName: await this.getSupplierName()
        };

    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.waitForAll(ProductPage.PAGE_HEADER_SELECTOR);
    }
}