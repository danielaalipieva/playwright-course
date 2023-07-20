import { expect } from "@playwright/test";
import { isDesktopViewport } from "../utils/isDesktopViewport";

export class Navigation {

    constructor(page) {
        this.page = page;
        this.basketCounter = page.locator('[data-qa="header-basket-count"]');
        this.checkoutButton = page.getByRole('link', { name: 'Checkout' });
        this.mobileBurgetButton= page.locator('[data-qa="burger-button"]');
    }

    getBasketCount = async () => {
        await this.basketCounter.waitFor();
        //return number
        const text = await this.basketCounter.innerText();
        // "0" -> 0
        const asNumber = parseInt(text, 10);
        return asNumber;
    }

    goToCheckout = async () => {
        //if mobile viewport, first open the hamburger menu
        if (!isDesktopViewport(this.page)) {
            await this.mobileBurgetButton.waitFor();
            await this.mobileBurgetButton.click();
        }
       
        await this.checkoutButton.waitFor();
        await expect(this.checkoutButton).toHaveText("Checkout");
        await this.checkoutButton.click();
        await this.page.waitForURL("/basket");

    }
}