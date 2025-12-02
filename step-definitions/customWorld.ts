import { World } from "@wdio/cucumber-framework";
import { Product } from "../support/product.ts";

export default class CustomWorld<ParametersType = any> extends World<ParametersType> {

    private products: Array<Product>;
    private counts: Map<string, number>

    constructor(options: World<ParametersType>) {
        super(options);
        this.products = [];
        this.counts = new Map<string, number>();
    }

    getStoredFilterCount(filterName: string): number | undefined {
        return this.counts.get(filterName);
    }

    getStoredProduct(productName: string): Product | undefined {
        return this.products.find((item) => item.productName === productName);
    }
    
    getStoredProducts(): Array<Product> {
        return this.products;
    }

    storeFilterCount(filterName: string, count: number) {
        this.counts.set(filterName, count);
    }

    storeProduct(product: Product) {
        const index = this.products.findIndex(
            (item) => item.productName === product.productName);
        if (index >= 0) {
            Object.assign(this.products[index], product);
        } else {
            this.products.push(product);
        }        
    }

    storeProducts(products: Array<Product>) {
        this.products = products;
    }
}