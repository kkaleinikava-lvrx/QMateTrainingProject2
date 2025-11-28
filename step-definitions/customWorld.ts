import { World } from "@wdio/cucumber-framework";
import { Product } from "../support/product";
import { Filter } from "../support/filter";

const SHORTAGE_THRESHOLD = 10;

export default class CustomWorld<ParametersType> extends World<ParametersType> {

    private products: Array<Product>;
    private selectedProduct: Product | undefined;
    private searchTerm: string;

    constructor(options: World<ParametersType>) {
        super(options);
        this.products = [];
        this.selectedProduct = undefined;
        this.searchTerm = "";
    }

    getProducts(): Array<Product> {
        return this.products;
    }
    getProductByName(productName: string): Product | undefined {
        return this.products.find((item) => item.productName === productName);
    }

    getFilteredProducts(filter: string): Array<Product> {
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

    getSearchTerm(): string {
        return this.searchTerm;
    }
    getSelectedProduct(): Product | undefined {
        return this.selectedProduct;
    }

    removeProduct(productName: string) {
        const removedProductIndex = this.products.findIndex((item) => item.productName === productName);
        this.products.splice(removedProductIndex, 1);
    }

    orderProduct(productName: string) {
        const orderedProduct = this.products.find((item) => item.productName === productName);
        if (orderedProduct) {
            orderedProduct.unitsInStock +=10;
        }
    }

    setSearchTerm(searchTerm: string) {
        this.searchTerm = searchTerm;
    }
    setSelectedProduct(productName: string) {
        this.selectedProduct = this.products.find((item) => item.productName === productName)
    }

    storeProducts(products: Array<Product>) {
        this.products = products;
    }
}