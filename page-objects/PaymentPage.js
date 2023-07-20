import { expect } from "@playwright/test";

export class PaymentPage{

    constructor(page) {
        this.page = page;
        
        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]').locator('[data-qa="discount-code"]');
        this.discountInput = page.getByPlaceholder('Discount code');
        this.activateDiscountButton = page.getByRole('button', { name: 'Submit discount' });
        this.discountActivatedText = page.getByText('Discount activated!');
        this.totalPriceWithDiscount = page.locator('[data-qa="total-with-discount-value"]');
        this.totalValue = page.locator('[data-qa="total-value"]');
        this.cardOwnerInput = page.getByPlaceholder('Credit card owner');
        this.cardNumberInput = page.getByPlaceholder('Credit card number');
        this.validUntilInput = page.getByPlaceholder('Valid until');
        this.CVCinput = page.getByPlaceholder('Credit card CVC');
        this.payButton = page.getByRole('button', { name: 'Pay' });
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor();
        const code = await this.discountCode.innerText();
        //Option 1 for laggy inputs: using fill() with await expect()
        await this.discountInput.fill(code);
        await expect(this.discountInput).toHaveValue(code);

        //Option 2 for laggy inputs: slow typing
        // await this.discountInput.focus();
        // await this.page.keyboard.type(code, { delay: 1000});
        // await expect(this.discountInput).toHaveValue(code);

        await this.activateDiscountButton.waitFor();
        await expect(this.discountActivatedText).toBeHidden();
        await this.activateDiscountButton.click();
        await expect(this.discountActivatedText).toBeVisible();

        await this.totalPriceWithDiscount.waitFor();
        const discountValueText = await this.totalPriceWithDiscount.innerText(); //344$
        const discountValueOnlyText = discountValueText.replace("$", ""); // string 344
        const discountValueNumber = parseInt(discountValueOnlyText, 10); // int 344

        await this.totalValue.waitFor();
        const totalValueText = await this.totalValue.innerText(); //344$
        const totalValueOnlyText = totalValueText.replace("$", ""); // string 344
        const totalValueNumber = parseInt(totalValueOnlyText, 10); // int 344
        
        expect(discountValueNumber).toBeLessThan(totalValueNumber);
    }

    fillPaymentDetails = async (cardDetails) => {
        await this.cardOwnerInput.waitFor();
        await this.cardOwnerInput.fill(cardDetails.cardOwner);

        await this.cardNumberInput.waitFor();
        await this.cardNumberInput.fill(cardDetails.cardNumber);

        await this.validUntilInput.waitFor();
        await this.validUntilInput.fill(cardDetails.validUntil);

        await this.CVCinput.waitFor();
        await this.CVCinput.fill(cardDetails.cardCVC);
    }

    completePayment = async () => {
        await this.payButton.waitFor();
        await this.payButton.click();
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 });
        await this.page.pause();

    }
}