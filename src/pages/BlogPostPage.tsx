import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Calendar, Clock, Share, BookOpen } from "phosphor-react";

const blogPosts = [
  {
    id: 1,
    title: "Planning a Beautiful Wedding on a Budget in Nigeria",
    excerpt: "Smart strategies to create your dream wedding without breaking the bank. From venue selection to vendor negotiations, we've got you covered.",
    content: `
Planning a beautiful wedding in Nigeria doesn't have to drain your savings. With smart planning and the right strategies, you can create a memorable celebration that reflects your love story without financial stress.

## Set a Realistic Budget First

Before anything else, sit down with your partner and determine exactly how much you can afford to spend. Be honest about your finances and avoid the temptation to overspend just to impress guests.

### The 50-30-20 Rule for Nigerian Weddings

Consider allocating your budget this way:
- **50%** for venue, catering, and drinks
- **30%** for attire, photography, music, and decorations
- **20%** for contingency and miscellaneous expenses

## Choose Your Venue Wisely

Venue costs can make or break your budget. Consider these money-saving options:

### Off-Peak Timing

Getting married on a Friday or Sunday instead of Saturday can save you 20-40% on venue costs. Similarly, dry season months (November-February) are peak wedding season - consider the shoulder months for better rates.

### Alternative Venues

Instead of expensive event centers, consider:
- Church halls with reception space
- Family compounds (especially for traditional weddings)
- Hotel gardens during weekday afternoons
- Community centers in upscale areas

## Negotiate with Vendors

Nigerian vendors expect negotiation - it's part of the culture! Here are some tips:

### Bundle Services

Ask if vendors offer discounts when you book multiple services. A photographer who also does videography might give you a package deal.

### Book Early

Give yourself 6-12 months to plan. This gives you time to compare prices and avoid last-minute premium charges.

### Ask for Referrals

Tell vendors you were referred by a previous client - they often offer referral discounts.

## Smart Catering Strategies

Food is non-negotiable at Nigerian events, but you can be strategic:

### Right-Size Your Guest List

Be realistic about who truly needs to be there. A 200-guest wedding is significantly cheaper than 500 guests.

### Choose Local Dishes

Jollof rice, fried rice, and local delicacies are crowd favorites and more affordable than "continental" options.

### Limit the Bar

Instead of an open bar all night, consider serving drinks only during the first few hours or offering signature cocktails only.

## DIY Where Possible

Some things you can do yourself:

- **Invitations**: Use digital invitations or print locally
- **Souvenirs**: Source directly from Aba or local markets
- **Makeup trials**: Practice with YouTube tutorials before the big day

## Final Thoughts

A beautiful wedding is about the love you're celebrating, not the money you spend. Focus on what truly matters - the commitment you're making and the joy of having loved ones around you.

With careful planning and these budget-smart strategies, you can have the Nigerian wedding of your dreams without starting your marriage in debt.
    `,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    category: "Wedding Planning",
    author: "Adaeze Nwosu",
    date: "December 15, 2025",
    readTime: "7 min read",
    tags: ["Budget Wedding", "Nigerian Wedding", "Planning Tips", "Money-Saving"]
  },
  {
    id: 2,
    title: "The Rise of Micro Weddings in Nigeria: Intimate Celebrations That Make a Big Impact",
    excerpt: "Discover why more Nigerian couples are choosing smaller, more meaningful celebrations over large traditional weddings.",
    content: `
The traditional Nigerian wedding with 500+ guests is getting a modern makeover. Enter the micro wedding - an intimate celebration typically hosting 20-50 guests that's gaining popularity among Nigerian millennials and Gen Z couples.

## What is a Micro Wedding?

A micro wedding is a scaled-down celebration that maintains all the essential elements of a traditional wedding - just with fewer guests. Think of it as a wedding that prioritizes quality over quantity.

## Why Micro Weddings Are Trending in Nigeria

### Post-Pandemic Perspective Shift

The COVID-19 era changed how Nigerians view large gatherings. Many couples discovered the beauty of intimate celebrations during lockdown-era weddings.

### Financial Freedom

With rising costs of living, couples are prioritizing financial stability over impressive guest counts. A micro wedding allows you to:
- Invest more per guest for a premium experience
- Start married life without event-related debt
- Redirect savings toward a home, business, or investments

### Meaningful Connections

Large Nigerian weddings often mean the couple barely interacts with most guests. Micro weddings allow you to:
- Spend quality time with each attendee
- Have meaningful conversations
- Create deeper memories

## Planning a Micro Wedding in Nigeria

### Venue Options

Intimate venues work perfectly for micro weddings:
- Boutique hotels with private gardens
- Rooftop restaurants with city views
- Beach resorts in Lagos or Calabar
- Vineyard-style settings in Jos or Obudu

### The Guest List Challenge

This is the hardest part for Nigerian couples. Here's how to handle it:

**Be Firm**: Decide on your number and stick to it. "Immediate family and closest friends only" is a valid boundary.

**Communicate Early**: Let extended family know early that you're having an intimate celebration. Most will understand.

**Consider a Reception Later**: Some couples have a micro wedding ceremony and a larger casual reception weeks later.

## Making It Special

With fewer guests, you can splurge on:

### Elevated Dining

Instead of buffet-style serving, consider a plated multi-course meal with wine pairings.

### Premium Entertainment

Hire a live band or acoustic performers instead of a loud DJ.

### Personalized Touches

- Handwritten notes for each guest
- Customized place settings
- Unique, high-quality souvenirs

### Destination Possibility

A smaller guest list makes destination weddings feasible. Consider beautiful Nigerian locations like:
- Obudu Mountain Resort
- La Campagne Tropicana
- Transcorp Calabar

## Handling Cultural Expectations

Nigerian families can be... opinionated about weddings. Here's how to navigate:

### Present It as Intentional

Frame your micro wedding as a deliberate choice, not a budget constraint. Emphasize the intimacy and meaning.

### Include Key Family Elements

Even in a small setting, include important cultural elements - palm wine ceremony, kola nut breaking, or traditional prayers.

### Host a Separate Family Gathering

Consider hosting a casual "thank you" dinner for extended family after the wedding.

## The Bottom Line

Micro weddings aren't about having less - they're about experiencing more. More connection, more meaning, more memories, and more financial peace as you start your journey together.

Whether you choose 20 guests or 500, what matters most is that your wedding reflects your values and celebrates your love authentically.
    `,
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800",
    category: "Wedding Trends",
    author: "Folake Adeleke",
    date: "January 10, 2026",
    readTime: "6 min read",
    tags: ["Micro Wedding", "Intimate Wedding", "Wedding Trends", "Modern Nigerian Wedding"]
  },
  {
    id: 3,
    title: "How to Identify a Reliable Event Planner: 7 Key Signs to Look For",
    excerpt: "Hiring the right event planner can make or break your celebration. Learn the essential qualities that separate professionals from amateurs.",
    content: `
Choosing the right event planner is one of the most important decisions you'll make for your wedding or celebration. A great planner makes the process seamless; a bad one creates stress and disappointment. Here are seven key signs that identify a reliable event planner.

## 1. They Have a Professional Portfolio

A serious event planner can show you their work. Look for:

### Visual Evidence

- High-quality photos of past events
- Videos showing event flow and execution
- Before-and-after transformation shots

### Diversity of Work

A good portfolio shows versatility - corporate events, weddings, birthday parties, cultural celebrations. This demonstrates adaptability.

### Client Testimonials

Real reviews from real clients, ideally with names and photos. Be wary of planners who can't provide references.

## 2. They Listen More Than They Talk

The best planners prioritize understanding your vision over pushing their own ideas.

### Red Flags to Watch For

- Constantly interrupting you
- Dismissing your ideas as "not possible"
- Pushing specific vendors without explaining why

### Green Flags

- Asking detailed questions about your preferences
- Taking notes during conversations
- Repeating back your requirements to confirm understanding

## 3. They're Transparent About Pricing

Reliable planners don't hide costs or surprise you with fees later.

### What to Expect

- Clear breakdown of their service fee
- Itemized vendor quotes
- Explanation of what's included and what costs extra
- Written contracts before any money changes hands

### Warning Signs

- "We'll figure out pricing later"
- Reluctance to provide written quotes
- Vague responses about total costs

## 4. They Have Strong Vendor Relationships

Event planning is about connections. A good planner knows the best vendors and has working relationships with them.

### Ask About

- How long they've worked with their recommended vendors
- Whether they get preferential treatment or pricing
- If they have backup vendors for each category

### Benefits of Strong Relationships

- Priority booking during peak seasons
- Better negotiating power on your behalf
- Vendors who go the extra mile because of the relationship

## 5. They Handle Pressure Gracefully

Events never go exactly as planned. What matters is how your planner handles the unexpected.

### Questions to Ask

- "Tell me about a time an event had a major problem. How did you handle it?"
- "What's your backup plan if a vendor cancels last minute?"
- "How do you handle difficult guests or family members?"

### Look For

- Calm, solution-focused responses
- Examples of creative problem-solving
- Confidence without arrogance

## 6. They're Organized and Communicative

A reliable planner keeps you informed without overwhelming you.

### Expect

- Regular updates on planning progress
- Shared timelines and checklists
- Prompt responses to your questions (within 24-48 hours)
- Clear communication channels (WhatsApp, email, calls)

### Tools of the Trade

Professional planners often use:
- Project management software
- Shared planning documents
- Budget tracking tools
- Event management apps

## 7. They Know Nigerian Event Culture

If you're planning a Nigerian event, your planner must understand our unique cultural elements.

### Cultural Competence Includes

- Understanding different ethnic wedding traditions
- Knowledge of proper cultural protocols
- Familiarity with local vendor markets
- Experience with large-scale Nigerian celebrations

### Questions to Ask

- "Have you planned Yoruba/Igbo/Hausa traditional ceremonies?"
- "How do you handle extended family dynamics?"
- "What's your experience with owambe-style events?"

## Final Checklist Before Hiring

Before signing any contract, ensure you:

✅ Have seen their portfolio and verified references
✅ Received a detailed written quote
✅ Understand exactly what's included in their fee
✅ Feel comfortable communicating with them
✅ Trust their ability to handle your specific event type
✅ Have everything in a signed contract

## The Bottom Line

Your event planner should reduce your stress, not add to it. Trust your instincts - if something feels off during initial meetings, it probably is. The right planner will feel like a partner who genuinely cares about making your event special.

Take your time with this decision. Interview multiple planners, check references, and choose someone whose style and personality align with yours.
    `,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    category: "Planning Tips",
    author: "Tunde Okonkwo",
    date: "January 25, 2026",
    readTime: "8 min read",
    tags: ["Event Planner", "Hiring Tips", "Wedding Planning", "Vendor Selection"]
  },
];

const BlogPostPage = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id || "0"));

  if (!post) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="bg-primary/5 py-8">
        <div className="container mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl">
            <div className="mb-4">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readTime}
              </div>
              <button className="flex items-center text-primary hover:text-primary/80">
                <Share className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags?.map(tag => (
                <span key={tag} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map(relatedPost => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group">
                    <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          {relatedPost.category}
                        </span>
                        <h4 className="text-lg font-bold mt-3 mb-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-muted-foreground text-sm">{relatedPost.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPostPage;
