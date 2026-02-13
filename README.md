# AI Blog Content Repurposer

**Live Demo**: [Add your Vercel URL here after deployment]

Transform blog posts into platform-optimized social media content in seconds.

## What It Does

Takes any blog URL and generates:
- **3 LinkedIn post variations** (Educational, Controversial Take, Personal Story)
- **3 Twitter/X thread hooks** (Pattern Interrupt, Curiosity Gap, Mistake Framework)
- **1 SEO-optimized meta description** (under 160 characters)
- **1 YouTube title + description** (optimized for CTR)

Each output is tailored to platform best practices and sounds human, not AI-generated.

---

## Tech Stack & Reasoning

### Frontend: Next.js 16 (App Router)
**Why**: 
- Built-in API routes eliminate need for separate backend
- Server components reduce client-side JavaScript
- Vercel deployment is zero-config


---

### AI Model: Google Gemini 2.5 Flash Lite
**Why**: 
- Free tier available (60 requests/min, 1500 requests/day)
- Fast response times (~2-3 seconds for content generation)
- Strong at creative writing tasks and following structured prompts


---

### Content Extraction: Firecrawl API
**Why**:
- Free tier available to use
- Handles JavaScript-rendered sites (uses Puppeteer under the hood)
- Returns clean markdown (no HTML parsing headaches)
- Simple API - just POST the URL, get markdown back


---

### UI: shadcn/ui + Tailwind CSS
**Why**: 
- shadcn/ui components are copy-paste, not an npm dependency - no runtime overhead
- Accessible out of the box (keyboard navigation, ARIA labels)
- Tailwind's utility classes are faster than writing custom CSS
- Components are customizable - could theme them if needed



---

## AI Tools Used During Development

- **v0.dev**: Creating the first version
- **Claude 3.5 Sonnet**: Prompt engineering iteration , Debugging Firecrawl API response issues and  improving the backend struture.
---

## Local Setup

```bash
# Clone the repo
git clone [your-repo-url]
cd ai-content-repurposer

# Install dependencies
npm install
# or
pnpm install

# Add API keys
echo "FIRECRAWL_API_KEY=fc-your_key_here" > .env.local
echo "GOOGLE_GEMINI_API_KEY=your_key_here" >> .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Getting API Keys

**Firecrawl**: 
1. Go to https://firecrawl.dev
2. Sign up (free tier: 500 scrapes/month)
3. Copy API key from dashboard

**Google Gemini**: 
1. Go to https://aistudio.google.com/app/apikey
2. Create API key (free tier: 60 req/min)
3. Copy key

---

## What I'd Improve With 2 More Hours
 1. Improve the UI of the website
 2. Improvement in the Prompt Structure based on more testing.

---

## Deployment

**Platform**: Vercel

**Why Vercel**: 
- Zero-config Next.js deployment
- Environment variables in dashboard
- Free tier is generous



## License

MIT - Feel free to use this as a portfolio piece or starting point for your own projects.

---

