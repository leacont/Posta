# Posta - Deploy en Netlify

## Archivos

- `index.html`: frontend sin API key pública.
- `netlify/functions/chat.js`: backend serverless que llama a Anthropic.
- `netlify.toml`: configuración básica de Netlify Functions.

## Variable obligatoria en Netlify

Crear esta variable de entorno:

```txt
ANTHROPIC_API_KEY=tu_api_key_nueva
```

Opcional:

```txt
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

## Importante

La API key anterior quedó expuesta en el HTML original. Revocala y generá una nueva antes de publicar.
