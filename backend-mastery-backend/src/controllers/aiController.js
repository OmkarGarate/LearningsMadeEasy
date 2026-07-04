import { CURRICULUM } from '../data/curriculum.js';

/**
 * Build a knowledge base string from the entire curriculum.
 * This gets sent as context to the AI so it can answer questions accurately.
 */
function buildCurriculumContext() {
  const lines = [];
  CURRICULUM.forEach(phase => {
    lines.push(`# ${phase.title} (Phase ${phase.num})`);
    phase.concepts.forEach(c => {
      lines.push(`\n## ${c.title}`);
      lines.push(`Summary: ${c.summary}`);
      if (c.keyPoints) lines.push(`Key points: ${c.keyPoints.join('; ')}`);
      if (c.analogy) lines.push(`Analogy: ${c.analogy}`);
      if (c.realWorldExample) lines.push(`Real-world example: ${c.realWorldExample}`);
    });
  });
  return lines.join('\n');
}

const CURRICULUM_CONTEXT = buildCurriculumContext();

/**
 * AI tutor endpoint. Calls an OpenAI-compatible chat completion API.
 * Set AI_API_KEY and AI_BASE_URL and AI_MODEL in .env.
 *
 * If no API key is set, returns a smart pattern-based fallback response
 * (same as the frontend's local chatbot).
 */
export async function aiChat(req, res) {
  try {
    const { messages, conceptId } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' });
    }

    const apiKey = process.env.AI_API_KEY;
    const baseURL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.AI_MODEL || 'gpt-4o-mini';

    // Build system prompt with curriculum context
    let conceptContext = '';
    if (conceptId) {
      const concept = CURRICULUM.flatMap(p => p.concepts).find(c => c.id === conceptId);
      if (concept) {
        conceptContext = `\n\nThe user is currently learning about: "${concept.title}". Focus your answer on this concept when relevant.\n${concept.summary}\nKey points: ${(concept.keyPoints || []).join('; ')}${concept.analogy ? '\nAnalogy: ' + concept.analogy : ''}`;
      }
    }

    const systemPrompt = `You are the AI tutor for "Backend Mastery", an app that teaches backend system design and architecture. Your job is to help the user understand concepts, answer their questions, give examples, and clarify doubts.

Be friendly, concise, and educational. Use real-world examples (Amazon, Netflix, Uber, Stripe, etc.) when relevant. Use formatting (lists, code blocks) when helpful. If you don't know something, say so — don't make up facts.

Here's the curriculum you're teaching:\n\n${CURRICULUM_CONTEXT}${conceptContext}`;

    if (!apiKey) {
      // Fallback: pattern-based response (no AI)
      return res.json({
        reply: generateFallbackResponse(messages[messages.length - 1].content, conceptId),
        source: 'fallback',
      });
    }

    // Sanitize messages: keep only role+content (and optional name/function_call/tool_calls).
    // OpenAI-compatible APIs (Groq, etc.) reject unknown fields like `source`, `warning`, etc.
    const sanitizedMessages = messages
      .filter(m => m && typeof m === 'object' && (m.role === 'user' || m.role === 'assistant' || m.role === 'system'))
      .map(m => {
        const clean = { role: m.role, content: String(m.content || '') };
        if (m.name) clean.name = m.name;
        if (m.tool_calls) clean.tool_calls = m.tool_calls;
        return clean;
      });

    if (sanitizedMessages.length === 0) {
      return res.status(400).json({ error: 'At least one valid user/assistant message is required' });
    }

    // Call OpenAI-compatible API
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...sanitizedMessages,
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsed = {};
      try { parsed = JSON.parse(errText); } catch {}
      const groqMsg = parsed?.error?.message || errText;
      const isModelError = /model|decommissioned|deprecated|not found|not supported/i.test(groqMsg);
      console.error('❌ AI API error:', response.status, baseURL, '| model:', model);
      console.error('   response body:', errText.slice(0, 500));

      let hint = `AI API failed (${response.status}).`;
      if (isModelError) {
        hint = `Model "${model}" is no longer supported. Update AI_MODEL in your backend .env to a current one. See https://console.groq.com/docs/deprecations — current free options: llama-3.3-70b-versatile, llama-3.1-8b-instant, llama-4-scout-instruct, openai/gpt-oss-120b.`;
      } else if (response.status === 401) {
        hint = `Invalid AI_API_KEY. Double-check the value in your backend .env.`;
      } else if (response.status === 429) {
        hint = `Rate limit hit. Wait a minute and try again, or upgrade your Groq tier.`;
      }
      return res.json({
        reply: generateFallbackResponse(messages[messages.length - 1].content, conceptId) + `\n\n⚠️ ${hint}`,
        source: 'fallback',
        warning: hint,
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Track usage
    if (req.userId) {
      const User = (await import('../models/User.js')).default;
      await User.updateOne({ _id: req.userId }, { $inc: { chatMessages: 1 } });
    }

    res.json({ reply, source: 'ai', model });
  } catch (err) {
    console.error('aiChat error:', err);
    res.status(500).json({ error: 'AI tutor failed' });
  }
}

function generateFallbackResponse(userMessage, conceptId) {
  const msg = userMessage.toLowerCase();

  // Try to find relevant concept
  const concepts = CURRICULUM.flatMap(p => p.concepts);
  let concept = concepts.find(c => c.id === conceptId);
  if (!concept) {
    concept = concepts.find(c =>
      msg.includes(c.title.toLowerCase().split(' ')[0]) ||
      c.title.toLowerCase().includes(msg.split(' ')[0])
    );
  }

  if (!concept) {
    return "I'm your backend engineering tutor. I can help with concepts like DNS, HTTP, REST APIs, databases, caching, message queues, scaling, and system design. Try asking about a specific concept or click on a concept to focus the chat. (Note: For full AI responses, add AI_API_KEY, AI_BASE_URL, and AI_MODEL to the backend's .env file — see README.)";
  }

  if (msg.includes('simpler') || msg.includes('eli5')) {
    return `Here's a simpler way to think about **${concept.title}**:\n\n${concept.analogy || concept.summary}\n\nIn one sentence: ${concept.keyPoints[0]}`;
  }
  if (msg.includes('example')) {
    return concept.realWorldExample || `Example: ${concept.summary}`;
  }
  if (msg.includes('how') && msg.includes('work')) {
    return `**How ${concept.title} works:**\n\n${concept.summary}\n\nKey points:\n${concept.keyPoints.map(p => `• ${p}`).join('\n')}`;
  }
  if (msg.includes('why')) {
    return `**Why ${concept.title} matters:**\n\n${concept.keyPoints.join('\n')}\n\n${concept.interviewAngle ? '💡 ' + concept.interviewAngle : ''}`;
  }

  return `**${concept.title}**\n\n${concept.summary}\n\nKey points:\n${concept.keyPoints.map(p => `• ${p}`).join('\n')}\n\n${concept.analogy ? '💡 ' + concept.analogy : ''}\n\n(For richer AI responses, add AI_API_KEY to your backend .env)`;
}
