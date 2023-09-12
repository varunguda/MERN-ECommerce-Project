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

    let meritToAdd = Math.sqrt(100 - this.sellerMerit) / Math.log(this.orderCount + Math.E);

    this.sellerMerit += meritToAdd;

    if (this.sellerMerit > 100) {
      this.sellerMerit = 100;
    }

    seller.seller_merit = Math.floor(this.sellerMerit * 10) / 10;
    await seller.save({ validateBeforeSave: false });

    return this.sellerMerit;

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
    this.sellerMerit = seller.seller_merit;

    if (this.orderCount === 1) {
      this.sellerMerit -= 1;
    }
    else {
      let reductions = Math.floor(this.orderCount / 8);
      let meritToReduce = reductions;
      this.sellerMerit -= meritToReduce;
    }

    seller.seller_merit = Math.floor(this.sellerMerit * 10) / 10;
    if (this.sellerMerit < 30) {
      this.dropSeller();
    }

    await seller.save({ validateBeforeSave: false })

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
    })
  }
}