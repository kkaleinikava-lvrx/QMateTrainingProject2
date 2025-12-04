import { Given, When, Then, setWorldConstructor } from '@wdio/cucumber-framework';

import CustomWorld from './customWorld.ts';
import ProductListPage from '../pageobjects/productListPage.ts';
import ProductPage from '../pageobjects/productPage.ts';
import { Product } from "../support/product.ts";
import { Filter } from '../support/filter.ts';
import productListPage from '../pageobjects/productListPage.ts';

setWorldConstructor(CustomWorld);

Given ('Open Manage Product app', async function(): Promise<void> {
    await ProductListPage.openPage();
    await ProductListPage.waitForPageLoaded();
    await browser.takeScreenshot();
});

When ('Collect details for product {string} from product list', async function(productName: string): Promise<void> {
    this.storeProduct(await ProductListPage.getProductDetails(productName)); 
});

When ('Select product {string}', async function(productName: string): Promise<void> {
    await ProductListPage.clickProduct(productName);
    await ProductPage.waitForPageLoaded();    
    await browser.takeScreenshot();    
});

When ('Order product {string}', async function(productName: string): Promise<void> {
    await ProductListPage.clickCheckboxForProduct(productName);
    await browser.takeScreenshot();
    await ProductListPage.orderProduct();
    await browser.takeScreenshot();
});

When ('Remove product {string}', async function(productName: string): Promise<void> {
    const filterOptions = Object.values(Filter);
    for (let option of filterOptions) {
        this.storeFilterCount(option, await productListPage.getTabFilterCount(option));
    }
    await ProductListPage.clickCheckboxForProduct(productName);
    await browser.takeScreenshot();
    await ProductListPage.removeProduct();
    await browser.takeScreenshot();
});

When ('Search for {string}', async function(searchTerm: string): Promise<void> {
    this.storeProducts(await ProductListPage.getProductList());
    await ProductListPage.searchForProduct(searchTerm);
    await browser.takeScreenshot();
});

Then ('Verify product details match data from product list', async function(): Promise<void> {
    const actualProduct = await ProductPage.getProductDetails();
    const expectedProduct = this.getStoredProduct(actualProduct.productName);
    common.assertion.expectEqual(expectedProduct, actualProduct);
});

Then (/Verify product "(.+)" is( not)? in "(.+)" list/, 
  async function(productName: string, negation: string, listName: string): Promise<void> {
    await ProductListPage.selectTab(listName);
    await browser.takeScreenshot();
    const actualProducts = await ProductListPage.getProductList();
    const isProductFound = actualProducts.some((item) => item.productName === productName);
    if (negation) {
        common.assertion.expectFalse(isProductFound);
    } else {
        common.assertion.expectTrue(isProductFound);
    }      
});

Then ('Verify Units in Stock for product {string} increased by {int}', 
    async function(productName: string, addedQuantity: number): Promise<void> {
        common.assertion.expectEqual(this.getStoredProduct(productName).unitsInStock + addedQuantity, 
            (await ProductListPage.getProductDetails(productName)).unitsInStock);
});

Then ('Verify item count decreased by {int} for {string} list', 
    async function(quantity: number, listName: string) {
        common.assertion.expectEqual(this.getStoredFilterCount(listName) - quantity, 
            await ProductListPage.getTabFilterCount(listName));
});

Then ('Verify search results for {string}', async function(searchTerm: string): Promise<void> {
    const expectedProducts = (this.getStoredProducts() as Array<Product>).filter(
        (item) => item.productName.includes(searchTerm));
    const actualProducts = await ProductListPage.getProductList();
    common.assertion.expectEqual(expectedProducts, actualProducts);
    await browser.takeScreenshot(); 
});