import { Given, When, Then, setWorldConstructor } from '@wdio/cucumber-framework';

import CustomWorld from './customWorld.ts';
import ProductListPage from '../pageobjects/productListPage.ts';
import ProductPage from '../pageobjects/productPage.ts';
import { Filter } from '../support/filter.ts';

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
        this.storeFilterCount(option, await ProductListPage.getTabFilterCount(option));
    }
    await ProductListPage.clickCheckboxForProduct(productName);
    await browser.takeScreenshot();
    await ProductListPage.removeProduct();
    await browser.takeScreenshot();
});

When ('Search for {string}', async function(searchTerm: string): Promise<void> {
    await ProductListPage.searchForProduct(searchTerm);
    await browser.takeScreenshot();
});

Then ('Verify product details match data from product list', async function(): Promise<void> {
    common.assertion.expectEqual(this.getStoredProduct(), await ProductPage.getProductDetails());
});

Then (/Verify product "(.+)" is( not)? in "(.+)" list/, 
  async function(productName: string, negation: string, listName: string): Promise<void> {
    await ProductListPage.selectTab(listName);
    await browser.takeScreenshot();
    const actualProducts = await ProductListPage.getProductNames();
    const isProductFound = actualProducts.some((item) => item === productName);
    if (negation) {
        common.assertion.expectFalse(isProductFound);
    } else {
        common.assertion.expectTrue(isProductFound);
    }      
});

Then ('Verify Units in Stock for product {string} increased by {int}', 
    async function(productName: string, addedQuantity: number): Promise<void> {
        common.assertion.expectEqual(this.getStoredProduct().unitsInStock + addedQuantity, 
            (await ProductListPage.getProductDetails(productName)).unitsInStock);
});

Then ('Verify item count decreased by {int} for {string} list', 
    async function(quantity: number, listName: string) {
        common.assertion.expectEqual(this.getStoredFilterCount(listName) - quantity, 
            await ProductListPage.getTabFilterCount(listName));
});

Then ('Verify search results for {string}', async function(searchTerm: string): Promise<void> {
    const productNames = await ProductListPage.getProductNames();
    for (let productName of productNames) {
        common.assertion.expectToContain(productName, searchTerm);
    }
    await browser.takeScreenshot(); 
});