export function createEmailTemplate() {
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Correo de Frozono</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #F4F6FA;
        color: #222;
        padding: 0;
        margin: 0;
      }
      .container {
        background: #fff;
        max-width: 600px;
        margin: 20px auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      .header {
        background: linear-gradient(90deg, #00ADEF, #005F7F);
        color: white;
        padding: 20px;
        text-align: center;
      }
      .header img {
        width: 300px;
        margin-bottom: 10px;
      }
      .content {
        padding: 25px;
        font-size: 16px;
        line-height: 1.6;
        text-align: center;
      }
      .content h2 {
        color: #00ADEF;
      }
      .footer {
        background: #F4F6FA;
        text-align: center;
        font-size: 12px;
        padding: 10px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:frozono-logo" alt="Frozono" />
        <h1>¡Hola desde Frozono!</h1>
      </div>
      <div class="content">
        <h2>Bienvenido al Equipo Congelado</h2>
        <p>
          David aqui esta tu mensaje de bienvenida a nuestra comunidad de <strong>Frozono App</strong>.
        </p>
        <p>
          ¡Siempre fresco, siempre increíble!
        </p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} La Morcilla — Todos los derechos reservados.
      </div>
    </div>
  </body>
  </html>
  `;
}
