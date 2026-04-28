exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: true, message: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(500, {
      error: true,
      message: 'Missing ANTHROPIC_API_KEY. Configure it in Netlify Environment Variables with Functions scope.'
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return json(400, { error: true, message: 'Invalid JSON body.' });
  }

  const system = payload.system || 'Sos Posta, un socio financiero para argentinos.';
  const messages = Array.isArray(payload.messages) ? payload.messages : [];

  if (!messages.length) {
    return json(400, { error: true, message: 'No messages were provided.' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages
      })
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok || data.error) {
      console.error('Anthropic API error:', data);
      return json(anthropicRes.status || 500, {
        error: true,
        message: data?.error?.message || 'Anthropic API error.'
      });
    }

    const reply = data?.content?.[0]?.text || 'No pude procesar eso.';
    return json(200, { reply });
  } catch (error) {
    console.error('Function error:', error);
    return json(500, { error: true, message: 'Server error calling Anthropic.' });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(body)
  };
}
