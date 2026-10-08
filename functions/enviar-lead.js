// Arquivo: functions/enviar-lead.js
export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    // A chave de API do Brevo será guardada em segurança no painel do Cloudflare
    const apiKey = context.env.BREVO_API_KEY;

    const emailBody = {
      sender: { name: "Site Alex Martins", email: "contato@alexmartins.cc" }, // Deve ser um e-mail validado no seu Brevo
      to: [{ email: "contato@alexmartins.cc", name: "Alex Martins" }], // E-mail que vai receber os leads
      subject: `🟢 Novo Lead do Site: ${data.Nome}`,
      htmlContent: `
        <div style="font-family: sans-serif; color: #0F172A;">
          <h2 style="color: #C5A059;">Novo projeto recebido</h2>
          <p><strong>Nome:</strong> ${data.Nome}</p>
          <p><strong>WhatsApp:</strong> ${data.WhatsApp}</p>
          <p><strong>E-mail:</strong> ${data.Email}</p>
          <p><strong>Objetivo:</strong> ${data.Objetivo}</p>
          <p><strong>${data.TipoInfo}:</strong> ${data.ValorInfo}</p>
          <p><strong>Página de origem:</strong> ${data.Origem}</p>
        </div>
      `
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(emailBody)
    });

    if (!response.ok) {
        throw new Error("Falha de comunicação com o Brevo");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
}