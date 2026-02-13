import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Firecrawl SDK
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY
const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY

interface RepurposedContent {
  linkedinPosts: string[]
  twitterThreads: string[]
  metaDescription: string
  youtubeTitle: string
  youtubeDescription: string
}

async function extractBlogContent(url: string): Promise<string> {
  if (!firecrawlApiKey) {
    throw new Error('FIRECRAWL_API_KEY is not configured')
  }

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Firecrawl error: ${errorData.error || 'Failed to extract content'}`
      )
    }

    const data = await response.json()

    if (!data.success || !data.data?.markdown) {
      throw new Error('Could not extract content from the provided URL')
    }

    // Limit content to first 3500 characters for better reliability
    return data.data.markdown.slice(0, 3500)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Content extraction failed: ${error.message}`)
    }
    throw error
  }
}

async function generateRepurposedContent(
  blogContent: string
): Promise<RepurposedContent> {
  if (!geminiApiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not configured')
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey)
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash-lite',
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    }
  })

  const prompt = `You're a growth marketer who's spent 5+ years writing social content that actually performs. You hate generic AI writing. Your posts get saved, shared, and commented on because they sound human.

BLOG CONTENT:
---
${blogContent}
---

Your job: Transform this into platform-specific content that real people would actually engage with.

═══════════════════════════════════════════════════════════════════

1. LINKEDIN POSTS (3 different strategic angles)

🎯 POST 1: EDUCATIONAL - The "Aha Moment" Approach
Write like you're explaining something to a colleague over coffee. Not a lecture.

Rules:
• Start with a specific, counterintuitive insight from the article (not a question, not "I learned")
• Break into 2-3 micro-paragraphs (each 1-2 sentences max)
• Each paragraph = one clear point
• End with a question that makes people think, not a generic "What do you think?"
• 80-120 words total
• Use line breaks between paragraphs for readability

BAD starts: "In today's", "I want to share", "Let's talk about", "Here's why", "Have you ever"
GOOD starts: Jump straight into the insight with specifics

Example structure:
[Counterintuitive insight with specific detail]

[Why this matters / What most people miss]

[Practical implication]

[Thoughtful question that relates to reader's experience]

═══════════════════════════════════════════════════════════════════

🎯 POST 2: CONTROVERSIAL TAKE - The "Challenge Convention" Approach
Write like you're arguing a point in a meeting. Confident but backed by data.

Rules:
• Start with a bold statement that contradicts common advice (no fluff lead-in)
• Use 3-5 short, punchy sentences
• Include at least one specific number, stat, or concrete example from the blog
• Make the reader think "wait, really?" or "I disagree because..."
• No emoji in this one - pure substance
• 70-100 words total

BAD starts: "Unpopular opinion", "Hot take", "Let me be honest", "Controversial but"
GOOD starts: State the controversial claim as fact

Example structure:
[Controversial claim stated as fact]
[Why everyone gets it wrong]
[Specific data/example from blog]
[What you should do instead]
[Sharp closing statement]

═══════════════════════════════════════════════════════════════════

🎯 POST 3: PERSONAL STORY - The "Vulnerable Lesson" Approach
Write like you're sharing a lesson you learned the hard way. Real and relatable.

Rules:
• Start with "I used to [wrong belief]" or similar personal admission
• Tell a mini-story arc: what you thought → what happened → what you learned
• Connect your story to the blog's insight
• Show genuine vulnerability (admit mistake, confusion, or struggle)
• End with the lesson, not a question
• 90-130 words total

BAD starts: "Let me tell you a story", "This reminds me of", "I'll never forget when"
GOOD starts: Jump into the admission or mistake

Example structure:
[Personal admission of wrong belief/approach]
[What happened as a result]
[When/how you realized you were wrong - reference blog insight]
[What you do now instead]
[The lesson in one sentence]

═══════════════════════════════════════════════════════════════════

2. TWITTER/X THREAD HOOKS (3 different psychological triggers)

🧵 THREAD 1: PATTERN INTERRUPT
Make them stop scrolling. Shock value with credibility.

Rules:
• Lead with "Most people think X. They're wrong." OR a shocking stat with no setup
• Second sentence creates curiosity gap about why/how
• End with "Here's what actually works: 🧵" or similar thread indicator
• Must be under 260 characters (not 280 - leave room for variation)
• No hashtags

BAD: "Most people don't understand X. Let me explain."
GOOD: "Most people think X. Reality: [specific surprising thing]. Here's the data 🧵"

═══════════════════════════════════════════════════════════════════

🧵 THREAD 2: CURIOSITY GAP
Create information FOMO. Make them need to know.

Rules:
• Start with "I [action] for [specific timeframe]" or "I analyzed [specific #]"
• Follow with unexpected/surprising result
• Use specific numbers (hours, dollars, attempts, companies, etc.)
• End with preview of value: "What I learned:" or "The surprising part:"
• Under 260 characters

BAD: "I spent months researching this topic. Here's what I found."
GOOD: "I analyzed 247 performance marketing agencies. Only 3% ask this question. Thread 🧵"

═══════════════════════════════════════════════════════════════════

🧵 THREAD 3: MISTAKE FRAMEWORK
Everyone loves learning from others' mistakes. Relatable vulnerability.

Rules:
• Start with "I made [specific #] mistakes [doing X]"
• Mention the cost (time/money/opportunity)
• Promise the lesson/solution
• Under 260 characters
• Sound like confession, not bragging

BAD: "I made mistakes with SEO. Here's what I learned."
GOOD: "I wasted $12K on the wrong SEO agency. Made 4 rookie mistakes. Here's what founders should ask instead: 🧵"

═══════════════════════════════════════════════════════════════════

3. META DESCRIPTION (SEO-optimized, click-worthy)

Rules:
• STRICT 155 character limit (not 160 - give buffer for Google)
• Front-load the main keyword/topic
• Include specific benefit or outcome
• Use active voice, no fluff words
• Format: [Topic/Action] + [Specific Benefit/Outcome] + [Optional: Qualifier]

BAD: "Learn more about how to choose the right marketing agency for your business needs."
GOOD: "Questions to ask before hiring a performance marketing agency. Avoid costly mistakes & find true growth partners."

Do NOT use: "discover", "explore", "learn more", "click here", "find out"
DO use: Specific outcomes, numbers, "avoid", "get", "choose", "build"

═══════════════════════════════════════════════════════════════════

4. YOUTUBE VIDEO ASSETS

📺 TITLE (70 characters max - mobile cutoff)
Rules:
• Front-load keyword (what people search for)
• Include number OR specific outcome OR timeframe from the BLOG CONTENT
• Create curiosity with "unexpected method" angle if possible
• No clickbait - must deliver on promise
• Frame the title fully based on the shared BLOG CONTENT

BAD: "How to Choose the Best Marketing Agency"
GOOD: "Essential Questions Before Hiring Marketing Agency (Most Miss #4)"
BETTER: "Avoid Bad Marketing Agencies: 7 Questions Founders Skip"

📝 DESCRIPTION (200-300 characters)
Rules:
• Sentence 1: Expand on title hook with specific benefit
• Sentence 2-3: What exactly they'll learn (be specific)
• Final sentence: Clear CTA (subscribe/watch/apply)
• Write for someone deciding whether to click
• No fluff, every word earns its place

═══════════════════════════════════════════════════════════════════

CRITICAL ANTI-PATTERNS (If you write ANY of these, I will reject your output):

LinkedIn:
❌ "In today's rapidly evolving landscape"
❌ "I'm excited to share"
❌ "Let's dive in"
❌ "Here's the thing"
❌ "At the end of the day"
❌ "Game-changing insights"
❌ "Thrilled to announce"
❌ "Proud to say"
❌ "Delighted to share"

Twitter:
❌ "Here are X things about Y"
❌ "A thread 🧵" as the only hook
❌ "Let me explain"
❌ "Quick thread on"
❌ "Some thoughts on"

All platforms:
❌ "Leverage"
❌ "Unlock"
❌ "Tap into"
❌ "Deep dive"
❌ "Ecosystem"
❌ "Synergy"
❌ Generic questions: "What do you think?", "Agree?", "Thoughts?"

═══════════════════════════════════════════════════════════════════

VARIATION REQUIREMENTS:
Each LinkedIn post must be GENUINELY DIFFERENT in:
• Opening hook style
• Sentence structure  
• Tone (educational vs confrontational vs vulnerable)
• Content angle (not just reworded same point)

If posts 1, 2, and 3 sound like the same thing rewritten, you failed.

═══════════════════════════════════════════════════════════════════

OUTPUT FORMAT:
Return ONLY this JSON structure (no markdown, no explanation, no backticks):

{
  "linkedinPosts": ["post1", "post2", "post3"],
  "twitterThreads": ["thread1", "thread2", "thread3"],
  "metaDescription": "description",
  "youtubeTitle": "title",
  "youtubeDescription": "description"
}

Each field must meet the exact specifications above. Quality over speed.`

  try {
    console.log('[AI] Generating content with enhanced prompts...')
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    console.log('[AI] Response received, length:', responseText.length)

    // Clean response - be aggressive about removing markdown
    let cleanedText = responseText.trim()
    cleanedText = cleanedText.replace(/```json\s*/gi, '')
    cleanedText = cleanedText.replace(/```\s*/g, '')
    cleanedText = cleanedText.replace(/^json\s*/i, '')
    
    // Extract JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[AI] Could not extract JSON from response')
      console.error('[AI] Response preview:', cleanedText.substring(0, 300))
      throw new Error('AI did not return valid JSON format')
    }

    console.log('[AI] Parsing JSON...')
    const generatedContent = JSON.parse(jsonMatch[0]) as RepurposedContent

    // Strict validation
    if (
      !generatedContent.linkedinPosts ||
      !Array.isArray(generatedContent.linkedinPosts) ||
      generatedContent.linkedinPosts.length !== 3
    ) {
      throw new Error('Invalid LinkedIn posts structure')
    }

    if (
      !generatedContent.twitterThreads ||
      !Array.isArray(generatedContent.twitterThreads) ||
      generatedContent.twitterThreads.length !== 3
    ) {
      throw new Error('Invalid Twitter threads structure')
    }

    if (
      !generatedContent.metaDescription ||
      typeof generatedContent.metaDescription !== 'string' ||
      generatedContent.metaDescription.length > 160
    ) {
      throw new Error('Invalid meta description (must be string under 160 chars)')
    }

    if (
      !generatedContent.youtubeTitle ||
      typeof generatedContent.youtubeTitle !== 'string' ||
      generatedContent.youtubeTitle.length > 80
    ) {
      throw new Error('Invalid YouTube title (must be string under 80 chars)')
    }

    if (
      !generatedContent.youtubeDescription ||
      typeof generatedContent.youtubeDescription !== 'string'
    ) {
      throw new Error('Invalid YouTube description')
    }

    console.log('[AI] Validation successful - all content generated')
    return generatedContent
  } catch (error) {
    console.error('[AI] Generation failed:', error)
    
    if (error instanceof Error) {
      throw new Error(`AI generation failed: ${error.message}`)
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    console.log('[API] Processing URL:', url)

    // Extract blog content
    const blogContent = await extractBlogContent(url)
    console.log('[API] Content extracted, length:', blogContent.length)

    // Generate repurposed content
    const repurposedContent = await generateRepurposedContent(blogContent)

    return NextResponse.json(repurposedContent)
  } catch (error) {
    console.error('[API] Error:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'

    // Provide more specific error messages
    if (errorMessage.includes('FIRECRAWL_API_KEY')) {
      return NextResponse.json(
        {
          error:
            'Firecrawl API key is not configured. Please add FIRECRAWL_API_KEY to environment variables.',
        },
        { status: 500 }
      )
    }

    if (errorMessage.includes('GOOGLE_GEMINI_API_KEY')) {
      return NextResponse.json(
        {
          error:
            'Google Gemini API key is not configured. Please add GOOGLE_GEMINI_API_KEY to environment variables.',
        },
        { status: 500 }
      )
    }

    if (errorMessage.includes('Failed to extract content')) {
      return NextResponse.json(
        {
          error:
            'Could not extract content from the provided URL. Please ensure it is a valid blog post URL.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}