import { Given, When, Then, setWorldConstructor } from '@wdio/cucumber-framework';

import CustomWorld from './customWorld';
import ProductListPage from '../pageobjects/productListPage';
import ProductPage from '../pageobjects/productPage';
import { Product } from "../support/product";
import { Filter } from '../support/filter';

setWorldConstructor(CustomWorld);

Given ('Open Manage Product app', async function(): Promise<void> {
    await ProductListPage.openPage();
    await ProductListPage.waitForPageLoaded();
    this.storeProducts(await ProductListPage.getProductList());
    await browser.takeScreenshot();
});

When ('Select product {string}', async function(productName: string): Promise<void> {
    await ProductListPage.clickRowByProduct(productName);
    await ProductPage.waitForPageLoaded();    
    await browser.takeScreenshot();

    this.setSelectedProduct(productName);
});

When ('Order product {string}', async function(productName: string): Promise<void> {
    await ProductListPage.selectRowByProduct(productName);
    await ProductListPage.clickOrderButton();
    await browser.takeScreenshot();

    this.orderProduct(productName);
});

When ('Remove product {string}', async function(productName: string): Promise<void> {
    await ProductListPage.selectRowByProduct(productName);
    await ProductListPage.clickRemoveButton();
    await browser.takeScreenshot();

    this.removeProduct(productName);
});

When ('Search for {string}', async function(searchTerm: string): Promise<void> {
    await ProductListPage.searchForProduct(searchTerm);
    await browser.takeScreenshot();

    this.setSearchTerm(searchTerm);
});

Then ('Verify product details match data from product list', async function(): Promise<void> {
    const expectedProduct = this.getSelectedProduct();
    const actualProduct = await ProductPage.getProductDetails();
    common.assertion.expectEqual(expectedProduct, actualProduct);
    // const expectedItems: Array<Product> = this.getProductsFromDataStorage();
    // const actualItems: Array<Product> = await ShoppingCartPage.getItemListInShoppongCart();
    // expectedItems.sort((a: object, b: object) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    // actualItems.sort((a: object, b: object) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    // common.assertion.expectEqual(expectedItems, actualItems);
});

Then ('Verify product {string} is in {string} list', async function(productName: string, listName: string): Promise<void> {
    await ProductListPage.selectTab(listName);
    await browser.takeScreenshot();
    const actualProducts = await ProductListPage.getProductList();
    common.assertion.expectTrue(actualProducts.some((item) => item.productName === productName));    
});

Then ('Verify product {string} is not in {string} list', async function(productName: string, listName: string): Promise<void> {
    if (listName === "any") {
        Object.values(Filter).forEach(async (value) => {
            await ProductListPage.selectTab(value);
            await browser.takeScreenshot();
            const actualProducts = await ProductListPage.getProductList();
            common.assertion.expectFalse(actualProducts.some((item) => item.productName === productName));
        })
    } else {
        await ProductListPage.selectTab(listName);
        await browser.takeScreenshot();
        const actualProducts = await ProductListPage.getProductList();
        common.assertion.expectFalse(actualProducts.some((item) => item.productName === productName));
    }   
});

Then ('Verify Units in Stock for product {string}', async function(productName: string): Promise<void> {
    common.assertion.expectEqual(this.getProductByName(productName).unitsInStock, 
        await ProductListPage.getUnitsInStockByProduct(productName));
    
});

Then ('Verify item counts for all lists', async function(productName: string): Promise<void> {
    common.assertion.expectEqual(this.getProducts().lenth, 
        await ProductListPage.getAllProductsCount());
    common.assertion.expectEqual(this.getFilteredProducts(Filter.PlentyInStock).length, 
        await ProductListPage.getPlentyInStockCount());
    common.assertion.expectEqual(this.getFilteredProducts(Filter.Shortage).length, 
        await ProductListPage.getShortageCount());
    common.assertion.expectEqual(this.getFilteredProducts(Filter.OutOfStock).length, 
        await ProductListPage.getOutOfStockCount());
});

Then ('Verify search results', async function(): Promise<void> {
    const searchTerm = this.getSearchTerm();
    const expectedProducts = (this.getProducts as Array<Product>).filter((item) => item.productName.includes(searchTerm));
    const actualProducts = ProductListPage.getProductList();
    common.assertion.expectEqual(expectedProducts, actualProducts);    
});