import { Users } from "../models/userModel.js";
import { sendEmail } from "./sendMail.js";


export class MeritMeter {

    constructor(orderCount, sellerId) {
        this.orderCount = orderCount;
        this.sellerId = sellerId;
    }

    async addMerit() {

        const seller = await Users.findById(this.sellerId);
        let meritToAdd = Math.sqrt(100 - seller.seller_merit) / Math.log(this.orderCount + Math.E);

        seller.seller_merit += meritToAdd;

        if (seller.seller_merit > 100) {
            seller.seller_merit = 100;
        }

        await seller.save({ validateBeforeSave: false });

        return seller.seller_merit;

        // Below are some scenarios on how algorithm behaves based on the sellers merit and the orders he got

        // 1. A seller with a merit of 30 got 10 orders
        // The merit to be added would be Math.sqrt(100 - 30) / Math.log(10 + Math.E) = 8.37 / 2.61 = 3.2 (approximately).

        // 2. A seller with a merit of 50 and has got 20 orders
        // The merit to be added would be Math.sqrt(100 - 50) / Math.log(20 + Math.E) = 7.07 / 3.09 = 2.3 (approximately).

        // 3. A seller with a merit of 70 and has got 30 orders
        // The merit to be added would be Math.sqrt(100 - 70) / Math.log(30 + Math.E) = 5.48 / 3.43 = 1.6 (approximately).

        // 4. A seller with a merit of 90 and has got 40 orders
        // The merit to be added would be Math.sqrt(100 - 90) / Math.log(40 + Math.E) = 3.16 / 3.71 = 0.85 (approximately).

    }

    async reduceMerit() {

        const seller = await Users.findById(this.sellerId);

        if (this.orderCount === 1) {
            seller.seller_merit -= 3;
        }
        else {
            let reductions = Math.floor(this.orderCount / 8);
            let meritToReduce = reductions;
            seller.seller_merit -= meritToReduce;
        }

        await seller.save({ validateBeforeSave: false })

        if (seller.seller_merit < 30) {
            this.dropSeller();
        }

        return seller.seller_merit;

    }


    async dropSeller() {

        const seller = await Users.findById(this.sellerId);
        seller.is_seller = false;
        seller.merit = 0;

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
                  <h2 style="color: #444;">ManyIN Notice</h2>
                </div>
                <div style="padding: 20px; color: #666;">
                  <h2>Dear ${seller.name},</h2>
                  <p>
                    We regret to inform you that your seller status has been revoked due to lower merit. We
                    appreciate your contributions till date and thank you for your understanding.
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
        })
    }

}