# External Services Disclosure

This document lists third-party/external services used by Bit Flows integrations.
Data is sent only when a site admin configures and runs the related trigger/action in a flow.

## Claude (Anthropic)

- **Service used for**: AI text generation and chat responses.
- **Endpoint/domain**: `https://api.anthropic.com/v1`
- **What data is sent**: Prompt text, mapped workflow fields, selected model/settings, and API authentication header.
- **When data is sent**: When a Claude action/tool step is executed.
- **Terms**: https://www.anthropic.com/legal/consumer-terms
- **Privacy policy**: https://www.anthropic.com/legal/privacy

## DeepSeek

- **Service used for**: AI text generation/chat completions.
- **Endpoint/domain**: `https://api.deepseek.com/`
- **What data is sent**: Prompt text, mapped workflow fields, selected model/settings, and API key.
- **When data is sent**: When a DeepSeek action/tool step is executed.
- **Terms**: https://www.deepseek.com/terms-of-use
- **Privacy policy**: https://www.deepseek.com/privacy-policy

## Gemini (Google AI)

- **Service used for**: AI text/content generation.
- **Endpoint/domain**: `https://generativelanguage.googleapis.com/v1beta/`
- **What data is sent**: Prompt text, mapped workflow fields, selected model/settings, and API key.
- **When data is sent**: When a Gemini action/tool step is executed.
- **Terms**: https://ai.google.dev/terms
- **Privacy policy**: https://policies.google.com/privacy

## GoogleSheet

- **Service used for**: Reading/writing Google Sheets rows.
- **Endpoint/domain**: `https://sheets.googleapis.com/v4` and `https://oauth2.googleapis.com/token`
- **What data is sent**: OAuth tokens/refresh requests, spreadsheet identifiers, and mapped row/cell values.
- **When data is sent**: When GoogleSheet trigger/action steps execute.
- **Terms**: https://developers.google.com/terms
- **Privacy policy**: https://policies.google.com/privacy

## Groq

- **Service used for**: AI chat completions.
- **Endpoint/domain**: `https://api.groq.com/openai/v1/`
- **What data is sent**: Prompt text, mapped workflow fields, selected model/settings, and API key.
- **When data is sent**: When a Groq action/tool step is executed.
- **Terms**: https://groq.com/terms-of-use/
- **Privacy policy**: https://groq.com/privacy-policy/

## OpenAI

- **Service used for**: AI text/chat generation.
- **Endpoint/domain**: `https://api.openai.com/v1`
- **What data is sent**: Prompt text, mapped workflow fields, selected model/settings, and API key.
- **When data is sent**: When an OpenAI action/tool step is executed.
- **Terms**: https://openai.com/policies/terms-of-use/
- **Privacy policy**: https://openai.com/policies/privacy-policy/

## OpenRouter

- **Service used for**: AI model routing and chat completions.
- **Endpoint/domain**: `https://openrouter.ai/api/v1`
- **What data is sent**: Prompt text, mapped workflow fields, selected model/provider settings, and API key.
- **When data is sent**: When an OpenRouter action/tool step is executed.
- **Terms**: https://openrouter.ai/terms
- **Privacy policy**: https://openrouter.ai/privacy

## Perplexity

- **Service used for**: AI chat/completions.
- **Endpoint/domain**: `https://api.perplexity.ai/chat`
- **What data is sent**: Prompt text, mapped workflow fields, selected model/settings, and API key.
- **When data is sent**: When a Perplexity action/tool step is executed.
- **Terms**: https://www.perplexity.ai/hub/legal/terms-of-service
- **Privacy policy**: https://www.perplexity.ai/hub/legal/privacy-policy

## Telegram

- **Service used for**: Sending bot messages/content.
- **Endpoint/domain**: `https://api.telegram.org/bot`
- **What data is sent**: Bot token, chat/user target identifiers, and mapped message content.
- **When data is sent**: When a Telegram action step is executed.
- **Terms**: https://telegram.org/tos
- **Privacy policy**: https://telegram.org/privacy

## WhatsApp (Meta Graph API)

- **Service used for**: Sending WhatsApp template/text/media messages.
- **Endpoint/domain**: `https://graph.facebook.com/v20.0/`
- **What data is sent**: Access token, phone number IDs, recipient identifiers, and mapped message/template payload.
- **When data is sent**: When a WhatsApp action step is executed.
- **Terms**: https://www.whatsapp.com/legal/business-terms/
- **Privacy policy**: https://www.whatsapp.com/legal/privacy-policy/

## Telemetry (Optional)

### WP-Telemetry
- **Service used for**: Collects basic, anonymous usage data (e.g., active features, WordPress/PHP version) to help improve the plugin.
- **What data is sent**: Non-personally-identifiable site and plugin usage statistics.
- **Endpoint/domain**: https://wp-api.bitapps.pro/public/
- **When data is sent**: Only after explicit consent is given by the site administrator.
- **Opt-out**: You may opt out at any time from the plugin settings.
- **Privacy Policy:** :https://bitapps.pro/privacy-policy/
