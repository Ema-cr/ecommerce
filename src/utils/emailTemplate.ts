export function createEmailTemplate(userName = "Cliente") {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bienvenido a AutoMarket</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, sans-serif;
        background-color: #f4f6fa;
        color: #333;
        margin: 0;
        padding: 0;
      }

      a {
        text-decoration: none;
        color: #0073e6;
      }

      .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }

      .header {
        background: linear-gradient(90deg, #0073e6, #004f99);
        color: white;
        text-align: center;
        padding: 25px 20px;
      }

      .header img {
        width: 180px;
        margin-bottom: 15px;
      }

      .content {
        padding: 30px 25px;
        font-size: 16px;
        line-height: 1.6;
        color: #333;
        text-align: center;
      }

      .content h2 {
        color: #0073e6;
        margin-bottom: 20px;
      }

      .btn {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 25px;
        background-color: #0073e6;
        color: white !important;
        border-radius: 6px;
        font-weight: bold;
      }

      .btn:hover {
        background-color: #005bb5;
      }

      .footer {
        background-color: #f4f6fa;
        text-align: center;
        font-size: 12px;
        padding: 15px 20px;
        color: #777;
      }

      .footer a {
        color: #0073e6;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:icon-gt" alt="AutoMarket Logo" />
        <h1>Bienvenido a AutoMarket</h1>
      </div>
      <div class="content">
        <h2>¡Hola ${userName}!</h2>
        <p>
          Gracias por registrarte en <strong>AutoMarket</strong>, tu plataforma confiable para comprar autos de calidad con total seguridad.
        </p>
        <p>
          Explora nuestro catálogo, encuentra ofertas exclusivas y asegura tu próximo vehículo con facilidad.
        </p>
        <a href="https://www.example.com/catalogo" class="btn">Ver Catálogo</a>
        <p>
          Si tienes preguntas o necesitas soporte, visita nuestro 
          <a href="https://www.example.com/soporte">Centro de Ayuda</a>.
        </p>
        <p>
          ¡Esperamos que disfrutes tu experiencia de compra con nosotros!
        </p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} GT AutoMarket. Todos los derechos reservados.<br/>
        <a href="https://www.example.com/privacidad">Política de Privacidad</a> | 
        <a href="https://www.example.com/terminos">Términos y Condiciones</a>
      </div>
    </div>
  </body>
  </html>
  `;
}
