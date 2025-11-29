export function emailTemplateOffer({ title, intro, offers }: {
  title: string;
  intro: string;
  offers: Array<{ brand: string; model: string; price: number; currency?: string; imageUrl?: string; link?: string }>;
}) {
  const items = offers.map((o) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #eee;vertical-align:middle">
        <img src="${o.imageUrl ?? 'https://via.placeholder.com/160x100?text=GT+Auto'}" alt="${o.brand} ${o.model}" style="width:160px;height:100px;object-fit:cover;border-radius:8px;margin-right:12px" />
      </td>
      <td style="padding:12px;border-bottom:1px solid #eee;vertical-align:middle">
        <div style="font-weight:600;color:#111">${o.brand} ${o.model}</div>
        <div style="color:#555;margin-top:4px">Precio: ${o.currency ?? 'USD'} ${o.price.toLocaleString()}</div>
        ${o.link ? `<a href="${o.link}" style="display:inline-block;margin-top:8px;color:#0ea5e9;text-decoration:none">Ver detalle</a>` : ''}
      </td>
    </tr>
  `).join('')

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background:#f6f7fb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif">
      <table role="presentation" width="100%" style="background:#f6f7fb;padding:24px 0">
        <tr>
          <td align="center">
            <table role="presentation" width="620" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08)">
              <tr>
                <td style="padding:28px 28px 8px 28px;text-align:center">
                  <img src="https://gtautomarket.example/assets/logo.png" alt="GT AutoMarket" style="height:48px" />
                  <h1 style="margin:16px 0 0 0;color:#0f172a;font-size:24px">${title}</h1>
                  <p style="margin:8px 0 0 0;color:#334155">${intro}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 16px 16px 16px">
                  <table role="presentation" width="100%" style="border-collapse:collapse">
                    ${items}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 28px 28px 28px;color:#64748b;font-size:12px;text-align:center">
                  Recibes este correo porque te suscribiste a ofertas de GT AutoMarket.
                  <br />
                  <a href="https://gtautomarket.example/unsubscribe" style="color:#94a3b8;text-decoration:none">Darse de baja</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`
}
