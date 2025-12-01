import { World } from "@wdio/cucumber-framework";
import { Product } from "../support/product.ts";
import { Filter } from "../support/filter.ts";

const SHORTAGE_THRESHOLD = 10;

export default class CustomWorld<ParametersType = any> extends World<ParametersType> {

    private products: Array<Product>;
    private storedProduct: Product | undefined;
    private searchTerm: string;

    constructor(options: World<ParametersType>) {
        super(options);
        this.products = [];
        this.storedProduct = undefined;
        this.searchTerm = "";
    }

    getStoredProducts(filter?: string): Array<Product> {
        if (filter === Filter.PlentyInStock) {
            return this.products.filter((item) => item.unitsInStock >= SHORTAGE_THRESHOLD);
        } else if (filter === Filter.Shortage) {
            return this.products.filter((item) => item.unitsInStock < SHORTAGE_THRESHOLD && item.unitsInStock > 0);
        } else if (filter === Filter.OutOfStock) {
            return this.products.filter((item) => item.unitsInStock == 0);
        } else {
            return this.products;
        }
    }

    getStoredSearchTerm(): string {
        return this.searchTerm;
    }

    getStoredProduct(): Product | undefined {
        return this.storedProduct;
    }

    removeProductFromStorage(productName: string) {
        const removedProductIndex = this.products.findIndex((item) => item.productName === productName);
        this.products.splice(removedProductIndex, 1);
    }

    orderStoredProduct() {
        if (this.storedProduct) {
            this.storedProduct.unitsInStock +=10;
        }
    }

    storeSearchTerm(searchTerm: string) {
        this.searchTerm = searchTerm;
    }

    storeProduct(product: Product) {
        this.storedProduct = product;
    }

    storeProducts(products: Array<Product>) {
        this.products = products;
    }
}