

export const orderHtml = (obj) => {

    let orderItemsHTML = '';
    let deliveryAddress = '';

    if(obj.order !== ''){
        obj.order.order_items.forEach((item) => {
            orderItemsHTML += `
            <div class="order-item">
                <p><strong>${item.name}</strong></p>
                <p>Price: ₹${item.price}, Quantity: ${item.quantity}, Order Status: ${item.product_status}</p>
            </div>
        `;
        });

        deliveryAddress = `${obj.address.flat}, ${obj.address.street_address}, ${obj.address.landmark ? obj.address.landmark + ', ' : ''}${obj.address.city}, ${obj.address.state}, India`;
    }


    const html = `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                margin: 20px auto;
                max-width: 600px;
                padding: 20px;
            }
            .header {
                background-color: #007bff;
                border-radius: 10px 10px 0 0;
                color: #ffffff;
                padding: 15px 0;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                font-weight: bold;
                margin: 0;
            }
            .content {
                padding: 15px 0;
            }
            .content p {
                font-size: 16px;
                line-height: 1.5;
                margin: 10px 0;
            }
            .order-details {
                border: 1px solid #ddd;
                border-radius: 10px;
                padding: 15px;
            }
            .order-details p {
                font-size: 16px;
                margin: 10px 0;
            }
            .order-items {
                margin-top: 15px;
            }
            .order-item {
                border-bottom: 1px solid #ddd;
                padding: 10px 0;
            }
            .order-item:last-child {
                border-bottom: none;
            }
            .order-item p {
                font-size: 14px;
                margin: 0;
                color: #333;
            }
            .order-item strong {
                font-weight: bold;
                color: #007bff;
            }
            .button {
                background-color: #007bff;
                border: none;
                border-radius: 5px;
                color: #fff;
                display: inline-block;
                font-size: 16px;
                margin-top: 15px;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                transition: background-color 0.3s;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .content a{
                color: white
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${obj.head}</h1>
            </div>
            <div class="content">
                <p>Dear ${obj.user_name},</p>
                <p>${obj.head_caption}</p>

                ${obj.order !== '' ? 
                    `<div class="order-details">
                    <p><strong>Order ID:</strong> ${obj.order._id}</p>
                     <p><strong>Shipping Address:</strong> ${deliveryAddress}</p>
                    <div class="order-items">
                        <p><strong>ORDER ITEMS:</strong></p>
                        ${orderItemsHTML}
                    </div>
                    <p><strong>Total Amount:</strong>₹ ${obj.order.total_price}</p>
                    </div>`
                    :``}

                <p>${obj.order_caption}</p>
                <a href=${obj.button_url} class="button">${obj.button_text}</a>
                <p>${obj.mail_caption}</p>
            </div>
        </div>
    </body>
    </html>`;

    return html;
}