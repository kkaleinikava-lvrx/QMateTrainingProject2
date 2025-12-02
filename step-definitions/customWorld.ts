import { World } from "@wdio/cucumber-framework";
import { Product } from "../support/product.ts";
import { Filter } from "../support/filter.ts";

export default class CustomWorld<ParametersType = any> extends World<ParametersType> {

    private products: Array<Product>;
    private storedProduct: Product | undefined;
    private counts: Map<string, number>

    constructor(options: World<ParametersType>) {
        super(options);
        this.products = [];
        this.storedProduct = undefined;
        this.counts = new Map<string, number>();
    }

    getStoredFilterCount(filterName: string): number | undefined {
        return this.counts.get(filterName);
    }

    getStoredProduct(): Product | undefined {
        return this.storedProduct;
    }
    
    getStoredProducts(): Array<Product> {
        return this.products;
    }

    storeFilterCount(filterName: string, count: number) {
        this.counts.set(filterName, count);
    }

    storeProduct(product: Product) {
        this.storedProduct = product;
    }

    storeProducts(products: Array<Product>) {
        this.products = products;
    }
}