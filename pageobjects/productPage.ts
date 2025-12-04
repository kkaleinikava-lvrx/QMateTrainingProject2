import { Product } from "../support/product.ts";
import { BasePage } from "./basePage.ts";
import { Formatter } from "../support/formatter.ts";

class ProductPage extends BasePage {

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

    async getPrice(): Promise<string> {        
        return Formatter.extractNumberFromString(
            await ui5.element.getPropertyValue(ProductPage.PRICE_TEXT_SELECTOR, "text"));
    }

    async getProductName(): Promise<string> {
        return await ui5.element.getPropertyValue(ProductPage.PRODUCT_NAME_SELECTOR, "text");
    }

    async getSupplierName(): Promise<string> {
        return await ui5.element.getPropertyValue(ProductPage.SUPPLIER_NAME_SELECTOR, "text");
    }

    async getUnitsInStock(): Promise<number> {
        return parseInt(await ui5.element.getPropertyValue(ProductPage.UNITS_IN_STOCK_SELECTOR, "number"));
    }

    async getProductDetails(): Promise<Product> {
        return { 
            productName: await this.getProductName(),
            supplierName: await this.getSupplierName(),
            price: await this.getPrice(),
            unitsInStock: await this.getUnitsInStock()            
        };
    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.getDisplayed(ProductPage.PAGE_HEADER_SELECTOR);
    }
}

export default new ProductPage();