'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Copy, CheckCircle, Sparkles, ArrowRight, Linkedin, Twitter, Youtube, Search } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface RepurposedContent {
  linkedinPosts: string[]
  twitterThreads: string[]
  metaDescription: string
  youtubeTitle: string
  youtubeDescription: string
}

const linkedinLabels = ['Educational', 'Controversial', 'Personal Story']
const linkedinDescriptions = [
  'Counterintuitive insight approach',
  'Challenge conventional wisdom',
  'Vulnerable personal lesson'
]

const twitterLabels = ['Pattern Interrupt', 'Curiosity Gap', 'Mistake Framework']
const twitterDescriptions = [
  'Shock value opener',
  'Data-driven hook',
  'Relatable learning moment'
]

// Enhanced animated loader
function EnhancedLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      {/* Animated loader ring */}
      <div className="relative">
        <div className="w-24 h-24 border-4 border-indigo-500/20 rounded-full animate-spin" 
             style={{ borderTopColor: '#6366f1', borderRightColor: '#6366f1' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-full animate-pulse" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
      </div>

      {/* Loading stages with better visibility */}
      <div className="space-y-3 text-center max-w-md">
        <div className="flex items-center justify-center gap-3 text-sm font-medium text-indigo-300">
          <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse shadow-lg shadow-indigo-500/50" />
          <span className="animate-pulse">Extracting blog content...</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
          <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
          <span>Generating LinkedIn posts...</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
          <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
          <span>Creating Twitter hooks...</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
          <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
          <span>Optimizing SEO & YouTube...</span>
        </div>
      </div>

      <p className="text-sm text-slate-500 font-medium">AI is crafting human-sounding content...</p>
    </div>
  )
}

export default function Page() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState<RepurposedContent | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setContent(null)

    if (!url.trim()) {
      setError('Please enter a blog URL')
      return
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (starting with http:// or https://)')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to repurpose content')
      }

      const data = await response.json()
      setContent(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      
      if (errorMessage.includes('FIRECRAWL_API_KEY')) {
        setError('⚠️ API Configuration Error: Firecrawl API key is missing. Please contact support.')
      } else if (errorMessage.includes('GOOGLE_GEMINI_API_KEY')) {
        setError('⚠️ API Configuration Error: Google Gemini API key is missing. Please contact support.')
      } else if (errorMessage.includes('Failed to extract content')) {
        setError('🚫 Could not access this URL. Try a different blog post or check if the site blocks scrapers.')
      } else if (errorMessage.includes('AI generation failed')) {
        setError('🤖 AI processing failed. The blog content might be too long or complex. Try a shorter article.')
      } else {
        setError(`❌ ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(id)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }

  const copyAllSection = (items: string[], sectionName: string) => {
    const labels = sectionName === 'LinkedIn' ? linkedinLabels : twitterLabels
    const text = items.map((item, idx) => 
      `--- ${labels[idx]} ---\n${item}\n`
    ).join('\n')
    
    copyToClipboard(text, `all-${sectionName}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header Section */}
          <div className="mb-10 text-center space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300 font-semibold">AI-Powered Content Engine</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-slate-100 via-indigo-200 to-slate-100 bg-clip-text text-transparent">
                Blog Content Repurposer
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transform your blog posts into engaging social media content in seconds.{' '}
              <span className="text-indigo-400 font-semibold">Human-sounding</span>, platform-optimized, ready to post.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Badge className="bg-indigo-500/15 border-indigo-400/30 text-indigo-200 hover:bg-indigo-500/20">
                <Linkedin className="w-3 h-3 mr-1.5" />
                3 LinkedIn Styles
              </Badge>
              <Badge className="bg-sky-500/15 border-sky-400/30 text-sky-200 hover:bg-sky-500/20">
                <Twitter className="w-3 h-3 mr-1.5" />
                3 Twitter Hooks
              </Badge>
              <Badge className="bg-emerald-500/15 border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/20">
                <Search className="w-3 h-3 mr-1.5" />
                SEO Optimized
              </Badge>
              <Badge className="bg-rose-500/15 border-rose-400/30 text-rose-200 hover:bg-rose-500/20">
                <Youtube className="w-3 h-3 mr-1.5" />
                YouTube Ready
              </Badge>
            </div>
          </div>

          {/* Input Card */}
          <Card className="mb-8 border-slate-700/50 bg-slate-800/50 backdrop-blur-xl shadow-2xl shadow-black/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2.5 text-slate-100">
                <div className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-400/30">
                  <ArrowRight className="w-5 h-5 text-indigo-400" />
                </div>
                Enter Your Blog URL
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-slate-400">
                Paste any blog post URL and watch AI transform it into multiple content formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="url"
                    placeholder="https://example.com/your-amazing-blog-post"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    className="h-12 border-slate-600 bg-slate-900/80 text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-6 sm:px-8 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Repurpose
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-8 border-red-700/50 bg-red-950/50 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <AlertDescription className="text-sm sm:text-base text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && <EnhancedLoader />}

          {/* Results */}
          {!loading && content && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Tabs defaultValue="linkedin" className="w-full">
                {/* Tabs List */}
                <TabsList className="grid w-full grid-cols-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 h-auto sm:h-14 p-1 gap-1">
                  <TabsTrigger 
                    value="linkedin" 
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/30 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base font-medium transition-all py-2.5 sm:py-0"
                  >
                    <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">LinkedIn</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="twitter"
                    className="data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-sky-500/30 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base font-medium transition-all py-2.5 sm:py-0"
                  >
                    <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Twitter</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="seo"
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/30 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base font-medium transition-all py-2.5 sm:py-0"
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">SEO</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="youtube"
                    className="data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-rose-500/30 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base font-medium transition-all py-2.5 sm:py-0"
                  >
                    <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">YouTube</span>
                  </TabsTrigger>
                </TabsList>

                {/* Helper Text */}
                <div className="mt-4 text-center">
                  <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Each variation uses a different strategic approach
                  </p>
                </div>

                {/* LinkedIn Posts Tab */}
                <TabsContent value="linkedin" className="space-y-4 mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
                      <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                      LinkedIn Posts
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyAllSection(content.linkedinPosts, 'LinkedIn')}
                      className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm"
                    >
                      <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                      Copy All
                    </Button>
                  </div>
                  
                  {content.linkedinPosts.map((post, idx) => (
                    <Card key={`linkedin-${idx}`} className="border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-indigo-500/40 transition-all group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <Badge className="bg-indigo-500/15 border-indigo-400/30 text-indigo-200 text-xs">
                              {linkedinLabels[idx]}
                            </Badge>
                            <CardDescription className="text-xs text-slate-500">
                              {linkedinDescriptions[idx]}
                            </CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(post, `linkedin-${idx}`)}
                            className="hover:bg-slate-700/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                          >
                            {copiedIndex === `linkedin-${idx}` ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                          {post}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-700/50">
                          <span className="flex items-center gap-1">
                            📝 {post.split(/\s+/).length} words
                          </span>
                          <span>•</span>
                          <span>{post.length} chars</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Twitter Threads Tab */}
                <TabsContent value="twitter" className="space-y-4 mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
                      <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
                      Thread Hooks
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyAllSection(content.twitterThreads, 'Twitter')}
                      className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm"
                    >
                      <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                      Copy All
                    </Button>
                  </div>
                  
                  {content.twitterThreads.map((thread, idx) => (
                    <Card key={`twitter-${idx}`} className="border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-sky-500/40 transition-all group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <Badge className="bg-sky-500/15 border-sky-400/30 text-sky-200 text-xs">
                              {twitterLabels[idx]}
                            </Badge>
                            <CardDescription className="text-xs text-slate-500">
                              {twitterDescriptions[idx]}
                            </CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(thread, `twitter-${idx}`)}
                            className="hover:bg-slate-700/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                          >
                            {copiedIndex === `twitter-${idx}` ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                          {thread}
                        </p>
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                          <span className={`text-xs font-medium ${thread.length > 280 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {thread.length}/280 characters
                            {thread.length <= 280 && ' ✓'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* SEO Meta Description Tab */}
                <TabsContent value="seo" className="space-y-4 mt-6">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                      SEO Meta Description
                    </h3>
                  </div>
                  
                  <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-emerald-500/40 transition-all group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <Badge className="bg-emerald-500/15 border-emerald-400/30 text-emerald-200 text-xs">
                            Search Optimized
                          </Badge>
                          <CardDescription className="text-xs text-slate-500">
                            Perfect for Google search results
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(content.metaDescription, 'meta-desc')}
                          className="hover:bg-slate-700/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                        >
                          {copiedIndex === 'meta-desc' ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                        {content.metaDescription}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <span className={`text-xs font-medium ${content.metaDescription.length > 160 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {content.metaDescription.length}/160 characters
                          {content.metaDescription.length <= 160 && ' ✓ Optimized'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* YouTube Tab */}
                <TabsContent value="youtube" className="space-y-4 mt-6">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
                      <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                      YouTube Assets
                    </h3>
                  </div>
                  
                  <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-rose-500/40 transition-all group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <Badge className="bg-rose-500/15 border-rose-400/30 text-rose-200 text-xs">
                            Video Title
                          </Badge>
                          <CardDescription className="text-xs text-slate-500">
                            Optimized for clicks & mobile
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(content.youtubeTitle, 'yt-title')}
                          className="hover:bg-slate-700/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                        >
                          {copiedIndex === 'yt-title' ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200 font-medium">
                        {content.youtubeTitle}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <span className={`text-xs font-medium ${content.youtubeTitle.length > 70 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {content.youtubeTitle.length}/70 characters
                          {content.youtubeTitle.length > 70 && ' ⚠ May be cut on mobile'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-rose-500/40 transition-all group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <Badge className="bg-rose-500/15 border-rose-400/30 text-rose-200 text-xs">
                            Video Description
                          </Badge>
                          <CardDescription className="text-xs text-slate-500">
                            Compelling preview with CTA
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(content.youtubeDescription, 'yt-desc')}
                          className="hover:bg-slate-700/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
                        >
                          {copiedIndex === 'yt-desc' ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                        {content.youtubeDescription}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <span className="text-xs text-slate-500">
                          {content.youtubeDescription.length} characters
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Footer - only show when not loading and no content */}
          {!loading && !content && (
            <div className="mt-12 text-center space-y-3">
              <p className="text-sm text-slate-500">
                Powered by AI • Human-sounding content • Platform-optimized
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}