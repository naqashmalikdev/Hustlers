interface OrderItem {
  name: string;
  flavor: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderConfirmationData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total: number;
  shipping_address: {
    full_name: string;
    address_line1: string;
    address_line2?: string | null;
    city: string;
    province: string;
    phone: string;
  };
  coupon_code?: string | null;
}

export function orderConfirmationHtml(data: OrderConfirmationData): string {
  const {
    order_number, customer_name, items, subtotal,
    discount_amount, shipping_amount, total, shipping_address, coupon_code,
  } = data;

  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #1C1C1C;">
          <span style="font-family:'Oswald',Arial,sans-serif;font-size:14px;color:#F5F5F5;">${item.name}</span>
          ${item.flavor ? `<br><span style="font-size:11px;color:#888;">${item.flavor}</span>` : ""}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #1C1C1C;text-align:center;color:#888;font-size:13px;">×${item.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #1C1C1C;text-align:right;color:#F5F5F5;font-size:13px;">
          PKR ${item.subtotal.toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Order Confirmed — ${order_number}</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;" align="center">
              <span style="font-family:'Bebas Neue',Arial,sans-serif;font-size:32px;letter-spacing:0.1em;color:#F5F5F5;">
                Hustlers <span style="color:#f02b39;">Gym</span>
              </span>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background:#111111;border:1px solid #1C1C1C;padding:40px 36px;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#f02b39;font-family:Arial,sans-serif;">
                Order Confirmed
              </p>
              <h1 style="margin:0 0 20px;font-size:36px;letter-spacing:-0.01em;color:#F5F5F5;font-family:Arial,sans-serif;text-transform:uppercase;">
                Thank You, ${customer_name.split(" ")[0]}!
              </h1>
              <p style="margin:0;font-size:14px;color:#888;line-height:1.6;">
                Your order <strong style="color:#F5F5F5;">${order_number}</strong> has been received and is being processed.
                We&apos;ll notify you once it ships.
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- Items -->
          <tr>
            <td style="background:#111111;border:1px solid #1C1C1C;padding:28px 36px;">
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#555;">
                Order Items
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="text-align:left;padding-bottom:12px;border-bottom:1px solid #1C1C1C;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#444;font-weight:normal;">Product</th>
                    <th style="text-align:center;padding-bottom:12px;border-bottom:1px solid #1C1C1C;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#444;font-weight:normal;">Qty</th>
                    <th style="text-align:right;padding-bottom:12px;border-bottom:1px solid #1C1C1C;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#444;font-weight:normal;">Price</th>
                  </tr>
                </thead>
                <tbody>${itemsRows}</tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td style="color:#555;font-size:12px;padding:4px 0;">Subtotal</td>
                  <td style="text-align:right;color:#888;font-size:12px;padding:4px 0;">PKR ${subtotal.toLocaleString()}</td>
                </tr>
                ${discount_amount > 0 ? `<tr>
                  <td style="color:#555;font-size:12px;padding:4px 0;">Discount${coupon_code ? ` (${coupon_code})` : ""}</td>
                  <td style="text-align:right;color:#ffffff;font-size:12px;padding:4px 0;">-PKR ${discount_amount.toLocaleString()}</td>
                </tr>` : ""}
                <tr>
                  <td style="color:#555;font-size:12px;padding:4px 0;">Shipping</td>
                  <td style="text-align:right;color:#888;font-size:12px;padding:4px 0;">PKR ${shipping_amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top:1px solid #1C1C1C;padding-top:16px;"></td>
                </tr>
                <tr>
                  <td style="color:#F5F5F5;font-size:14px;font-weight:bold;padding:4px 0;">Total</td>
                  <td style="text-align:right;color:#F5F5F5;font-size:20px;font-weight:bold;padding:4px 0;">PKR ${total.toLocaleString()}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- Shipping Address -->
          <tr>
            <td style="background:#111111;border:1px solid #1C1C1C;padding:28px 36px;">
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#555;">
                Shipping To
              </p>
              <p style="margin:0;color:#888;font-size:13px;line-height:1.8;">
                ${shipping_address.full_name}<br/>
                ${shipping_address.address_line1}${shipping_address.address_line2 ? `, ${shipping_address.address_line2}` : ""}<br/>
                ${shipping_address.city}, ${shipping_address.province}<br/>
                ${shipping_address.phone}
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:24px;"></td></tr>

          <!-- Payment -->
          <tr>
            <td style="background:#111111;border:1px solid #1C1C1C;padding:20px 36px;">
              <p style="margin:0;font-size:12px;color:#555;">
                Payment method: <span style="color:#888;">Cash on Delivery</span>
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height:40px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td align="center">
              <p style="margin:0;font-size:11px;color:#333;letter-spacing:0.1em;text-transform:uppercase;">
                Hustlers Gym · Johar Town, Lahore
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:#222;">
                Questions? Reply to this email or visit hustlers.pk
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function adminNewOrderHtml(data: OrderConfirmationData): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#080808;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid #1C1C1C;padding:36px;">
        <tr>
          <td>
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#f02b39;">New Order</p>
            <h1 style="margin:0 0 24px;font-size:28px;color:#F5F5F5;font-family:Arial,sans-serif;text-transform:uppercase;">
              ${data.order_number}
            </h1>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#555;font-size:12px;padding:6px 0;">Customer</td>
                <td style="text-align:right;color:#888;font-size:12px;padding:6px 0;">${data.customer_name}</td>
              </tr>
              <tr>
                <td style="color:#555;font-size:12px;padding:6px 0;">Email</td>
                <td style="text-align:right;color:#888;font-size:12px;padding:6px 0;">${data.customer_email}</td>
              </tr>
              <tr>
                <td style="color:#555;font-size:12px;padding:6px 0;">Total</td>
                <td style="text-align:right;color:#ffffff;font-size:16px;font-weight:bold;padding:6px 0;">PKR ${data.total.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="color:#555;font-size:12px;padding:6px 0;">Items</td>
                <td style="text-align:right;color:#888;font-size:12px;padding:6px 0;">${data.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}</td>
              </tr>
            </table>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders"
               style="display:inline-block;padding:12px 24px;background:#f02b39;color:#ffffff;text-decoration:none;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-weight:bold;">
              View in Admin →
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
