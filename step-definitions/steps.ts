import { Given, When, Then, setWorldConstructor } from '@wdio/cucumber-framework';

import CustomWorld from './customWorld.ts';
import ProductListPage from '../pageobjects/productListPage.ts';
import ProductPage from '../pageobjects/productPage.ts';
import { Product } from "../support/product.ts";
import { Filter } from '../support/filter.ts';

setWorldConstructor(CustomWorld);

Given ('Open Manage Product app', async function(): Promise<void> {
    await ProductListPage.openPage();
    await ProductListPage.waitForPageLoaded();
    await browser.takeScreenshot();
});

When ('Select product {string}', async function(productName: string): Promise<void> {
    this.storeProduct(await ProductListPage.getProductDetails(productName));
    await ProductListPage.clickRowForProduct(productName);
    await ProductPage.waitForPageLoaded();    
    await browser.takeScreenshot();    
});

When ('Order product {string}', async function(productName: string): Promise<void> {
    this.storeProduct(await ProductListPage.getProductDetails(productName));
    
    await ProductListPage.clickCheckboxForProduct(productName);
    await browser.takeScreenshot();
    await ProductListPage.orderProduct();
    await browser.takeScreenshot();

    this.orderStoredProduct();
});

When ('Remove product {string}', async function(productName: string): Promise<void> {
    this.storeProducts(await ProductListPage.getProductList());
    await ProductListPage.clickCheckboxForProduct(productName);
    await browser.takeScreenshot();
    await ProductListPage.removeProduct();
    await browser.takeScreenshot();

    this.removeProductFromStorage(productName);
});

When ('Search for {string}', async function(searchTerm: string): Promise<void> {
    this.storeProducts(await ProductListPage.getProductList());
    await ProductListPage.searchForProduct(searchTerm);
    await browser.takeScreenshot();

    this.storeSearchTerm(searchTerm);
});

Then ('Verify product details match data from product list', async function(): Promise<void> {
    const expectedProduct = this.getStoredProduct();
    const actualProduct = await ProductPage.getProductDetails();
    common.assertion.expectEqual(expectedProduct, actualProduct);
});

Then ('Verify product {string} is in {string} list', async function(productName: string, listName: string): Promise<void> {
    await ProductListPage.selectTab(listName);
    await browser.takeScreenshot();
    const actualProducts = await ProductListPage.getProductList();
    common.assertion.expectTrue(actualProducts.some((item) => item.productName === productName));    
});

Then ('Verify product {string} is not in {string} list', async function(productName: string, listName: string): Promise<void> {
    await ProductListPage.selectTab(listName);
    await browser.takeScreenshot();
    const actualProducts = await ProductListPage.getProductList();
    common.assertion.expectFalse(actualProducts.some((item) => item.productName === productName));  
});

Then ('Verify product {string} is not in any list', {timeout: 90000}, async function(productName: string): Promise<void> {
    const filterOptions = Object.values(Filter).slice();
    for (let i = 0; i < filterOptions.length; i++) {
        await ProductListPage.selectTab(filterOptions[i]);
        await browser.takeScreenshot();
        let actualProducts = await ProductListPage.getProductList();
        common.assertion.expectFalse(actualProducts.some((item) => item.productName === productName));
    }
});

Then ('Verify Units in Stock for product {string}', async function(productName: string): Promise<void> {
    common.assertion.expectEqual(this.getStoredProduct().unitsInStock, 
        (await ProductListPage.getProductDetails(productName)).unitsInStock);
});

Then ('Verify item counts for all lists', async function() {
    const filterOptions = Object.values(Filter).slice();
    for (let i = 0; i < filterOptions.length; i++) {
        common.assertion.expectEqual(this.getStoredProducts(filterOptions[i]).length, 
        await ProductListPage.getTabFilterCount(filterOptions[i]));
    }
    await browser.takeScreenshot();
});

Then ('Verify search results', async function(): Promise<void> {
    const searchTerm = this.getStoredSearchTerm();
    const expectedProducts = (this.getStoredProducts() as Array<Product>).filter((item) => item.productName.includes(searchTerm));
    const actualProducts = await ProductListPage.getProductList();
    common.assertion.expectEqual(expectedProducts, actualProducts);
    await browser.takeScreenshot(); 
});