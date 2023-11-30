import { Users } from "../models/userModel.js";
import { sendEmail } from "./sendMail.js";


export class MeritMeter {

    constructor(orderCount, sellerId) {
        this.orderCount = orderCount;
        this.sellerId = sellerId;
        this.sellerMerit = 0;
    }

    async addMerit() {

        const seller = await Users.findById(this.sellerId);
        this.sellerMerit = seller.seller_merit;

        seller.total_sales += this.orderCount;

        let multiplyingFactor = 1 + (seller.total_sales / 200);

        for (let i = 0; i < this.orderCount; i++) {
            let meritToAdd = ((100 - this.sellerMerit) / 140) * multiplyingFactor;
            this.sellerMerit += meritToAdd;
        }

        if (this.sellerMerit > 100) {
            this.sellerMerit = 100;
        }

        seller.seller_merit = this.sellerMerit;
        await seller.save({ validateBeforeSave: false });

        return this.sellerMerit;
    }

    async reduceMerit() {
        const seller = await Users.findById(this.sellerId);
        this.sellerMerit = seller.seller_merit;

        if (this.orderCount === 1) {
            this.sellerMerit -= 1;
        }
        else {
            let reductions = this.orderCount / 8;
            this.sellerMerit -= reductions;
        }

        seller.seller_merit = this.sellerMerit;
        if (this.sellerMerit < 30) {
            this.dropSeller();
        }
        else{
            await seller.save({ validateBeforeSave: false });
        }

        return this.sellerMerit;
    }

    async reduceMeritBy(count) {
        const seller = await Users.findById(this.sellerId);
        this.sellerMerit = seller.seller_merit;

        this.sellerMerit -= count;

        seller.seller_merit = this.sellerMerit;
        if (this.sellerMerit < 30) {
            this.dropSeller();
        }
        else{
            await seller.save({ validateBeforeSave: false });
        }

        return this.sellerMerit;
    }

    async dropSeller() {

        const seller = await Users.findById(this.sellerId);
        seller.is_seller = false;
        seller.seller_merit = undefined;
        
        await seller.save({ validateBeforeSave: false });

        const html = `
        <!DOCTYPE html>
        <html>
          <head> </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
            <div style="background-color: #f8f8f8; padding: 20px;">
              <div style="max-width: 600px; margin: auto;">
                <div
                  style="
                    background-color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    border-top: 5px solid #005cb9;
                  "
                >
                  <h2>ManyIN Notice</h2>
                </div>
                <div style="padding: 20px;">
                  <h2>Dear ${seller.name},</h2>
                  <p>
                    We regret to inform you that your seller status has been revoked due to lower merit. We
                    appreciate your contributions till date and we wish you a good luck for your future.
                  </p>
                  <p>
                    If you have any questions or need further clarification, please do
                    not hesitate to reply to this Email.
                  </p>
                </div>
                <div
                  style="
                    background-color: #f8f8f8;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 3px solid #005cb9;
                  "
                >
                  <p>Best regards,</p>
                  <p>ManyIN</p>
                </div>
              </div>
            </div>
          </body>
        </html>        
        `
        sendEmail({
            email: seller.email,
            subject: "Seller Status Revoking Notice!",
            html
        });
    }
}