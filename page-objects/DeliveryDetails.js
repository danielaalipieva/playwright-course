import { expect } from "@playwright/test";

export class DeliveryDetails {

    constructor(page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First name');
        this.lastNameInput = page.getByPlaceholder('Last name');
        this.streetInput = page.getByPlaceholder('Street');
        this.postCodeInput = page.getByPlaceholder('Post code');
        this.cityInput = page.getByPlaceholder('City');
        this.countryDropdown = page.getByRole('combobox');
        this.saveAdressButton = page.getByRole('button', { name: 'Save address for next time' });
        this.continueToPaymentButton = page.getByRole('button', { name: 'Continue to payment' });
        this.savedAddressContainer = page.locator('[data-qa="saved-address-container"]');
        this.savedAddressFirstName = page.locator('[data-qa="saved-address-firstName"]');
        this.savedAddressLastName = page.locator('[data-qa="saved-address-lastName"]');
        this.savedAddressStreet = page.locator('[data-qa="saved-address-street"]');
        this.savedAddressCity = page.locator('[data-qa="saved-address-city"]');
    }

    fillDetails = async (userAddress) => {
        await this.firstNameInput.waitFor();
        await this.firstNameInput.fill(userAddress.firstName);

        await this.lastNameInput.waitFor();
        await this.lastNameInput.fill(userAddress.lastName);

        await this.streetInput.waitFor();
        await this.streetInput.fill(userAddress.street);

        await this.postCodeInput.waitFor();
        await this.postCodeInput.fill(userAddress.postcode);

        await this.cityInput.waitFor();
        await this.cityInput.fill(userAddress.city);

        await this.countryDropdown.waitFor();
        await this.countryDropdown.selectOption(userAddress.country);


    }

    saveDetails = async () => {
        const addressCountBeforeSaving = await this.savedAddressContainer.count();
        await this.saveAdressButton.waitFor();
        await this.saveAdressButton.click();
        const addressCountAfterSaving = await this.savedAddressContainer.count();
        await expect(this.savedAddressContainer).toHaveCount(addressCountBeforeSaving + 1);

        await this.savedAddressFirstName.first().waitFor();
        expect(await this.savedAddressFirstName.first().innerText()).toBe(await this.firstNameInput.inputValue());
    }

    continueToPayment = async () => {
        await this.continueToPaymentButton.waitFor();
        await this.continueToPaymentButton.click();
        await this.page.waitForURL(/\/payment/, { setTimeout: 3000 });
    }
}