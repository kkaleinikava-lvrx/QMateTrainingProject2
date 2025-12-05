import { World } from "@wdio/cucumber-framework";
import { Product } from "../support/product.ts";
import { Filter } from "../support/filter.ts";

export default class CustomWorld<ParametersType = any> extends World<ParametersType> {

    private product: Product | undefined;
    private counts: Map<string, number>

    constructor(options: World<ParametersType>) {
        super(options);
        this.product = undefined;
        this.counts = new Map<string, number>();
    }

    getStoredFilterCount(filterName: Filter): number | undefined {
        return this.counts.get(filterName);
    }

    getStoredProduct(): Product | undefined {
        return this.product;
    }
    
    storeFilterCount(filterName: Filter, count: number) {
        this.counts.set(filterName, count);
    }
    
    storeProduct(product: Product) {
        this.product = product;
    }
}