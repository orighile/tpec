import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, User, Calendar, Clock, Share, BookOpen } from "phosphor-react";

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Tips for Planning a Nigerian Wedding",
    excerpt: "Discover the key elements to create a memorable Nigerian wedding celebration that honors traditions while embracing modern touches.",
    content: `
      Planning a Nigerian wedding can be both exciting and overwhelming. With rich traditions to honor and modern elements to incorporate, couples often find themselves navigating a complex landscape of cultural expectations and personal preferences.

      ## Understanding Traditional Elements

      Nigerian weddings are deeply rooted in tradition, with each ethnic group bringing unique customs to the celebration. The Yoruba, Igbo, and Hausa cultures each have distinct wedding traditions that add depth and meaning to the ceremony.

      ### 1. Choose Your Venue Wisely

      The venue sets the tone for your entire celebration. Consider spaces that can accommodate both traditional ceremonies and modern receptions. Many couples opt for outdoor venues that allow for the flexibility needed for cultural performances.

      ### 2. Honor Your Heritage

      Incorporate traditional attire, music, and customs that reflect your cultural background. This might include the breaking of kola nut, traditional drumming, or specific ceremonial practices unique to your ethnic group.

      ### 3. Plan for Multiple Ceremonies

      Nigerian weddings often involve multiple ceremonies - from the traditional wedding to the white wedding and sometimes additional religious or cultural ceremonies. Plan your timeline accordingly.

      ### 4. Food and Catering Excellence

      Nigerian cuisine should be the star of your wedding feast. Work with caterers who understand traditional dishes and can present them beautifully for your guests.

      ### 5. Photography and Videography

      Document every moment of your celebration. Nigerian weddings are rich with photogenic moments, from the colorful attire to the energetic dances.

      ## Modern Touches

      While honoring tradition is important, don't be afraid to add personal touches that reflect your unique story as a couple. This balance between old and new creates truly memorable celebrations.

      ### 6. Technology Integration

      Consider live streaming for family members who cannot attend, or create a wedding hashtag for social media sharing.

      ### 7. Sustainable Choices

      Make environmentally conscious decisions where possible, from digital invitations to locally-sourced decorations.

      ### 8. Guest Experience

      Think about your guests' comfort and enjoyment throughout the extended celebration. Provide clear schedules and comfortable accommodations.

      ### 9. Budget Management

      Nigerian weddings can be elaborate affairs. Set a realistic budget and prioritize elements that are most important to you as a couple.

      ### 10. Professional Planning

      Consider hiring a wedding planner who understands both traditional requirements and modern wedding trends. They can help navigate the complexities while ensuring nothing is overlooked.

      ## Conclusion

      Your Nigerian wedding should be a beautiful reflection of your love story, cultural heritage, and personal style. With careful planning and attention to both traditional and modern elements, you can create a celebration that honors the past while embracing the future.
    `,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    category: "Wedding Planning",
    author: "Chioma Okonkwo",
    date: "June 15, 2023",
    readTime: "8 min read",
    tags: ["Wedding", "Nigerian Culture", "Planning", "Traditions"]
  },
  {
    id: 2,
    title: "How to Create an Event Budget That Actually Works",
    excerpt: "Learn practical strategies for creating and sticking to an event budget that ensures financial success without compromising on quality.",
    content: `
      Creating a realistic event budget is one of the most crucial aspects of successful event planning. Whether you're organizing a wedding, corporate event, or birthday celebration, a well-planned budget serves as your roadmap to financial success.

      ## Understanding Budget Fundamentals

      Before diving into specific numbers, it's important to understand the key components that make up any event budget. These include fixed costs, variable costs, and contingency funds.

      ### Setting Your Overall Budget

      Start by determining your total available funds. This should be money you can comfortably spend without affecting your essential expenses or long-term financial goals.

      ### The 50-30-20 Rule for Events

      Consider allocating your budget using this modified approach:
      - 50% for venue and catering
      - 30% for entertainment, decoration, and services
      - 20% for contingency and miscellaneous expenses

      ## Major Budget Categories

      ### Venue and Catering (40-50% of budget)

      This is typically your largest expense. Research multiple venues and get detailed quotes that include all fees, taxes, and service charges.

      ### Entertainment and Music (10-15% of budget)

      Whether it's a DJ, live band, or traditional performers, entertainment is crucial for guest experience.

      ### Photography and Videography (8-12% of budget)

      Don't compromise on capturing memories. These are investments that provide lasting value.

      ### Decorations and Flowers (8-10% of budget)

      Create ambiance without overspending. Consider DIY options for certain decorative elements.

      ### Attire and Beauty (5-10% of budget)

      Include outfits, accessories, hair, and makeup in your calculations.

      ## Cost-Saving Strategies

      ### Off-Peak Timing

      Schedule your event during off-peak seasons or days of the week for significant savings.

      ### Multi-Purpose Items

      Choose decorations and arrangements that can serve multiple functions throughout your event.

      ### Local Sourcing

      Support local vendors and reduce transportation costs by sourcing locally.

      ### Group Negotiations

      Bundle services with the same vendor for potential discounts.

      ## Tracking and Management

      ### Use Technology

      Leverage budgeting apps and spreadsheets to track expenses in real-time.

      ### Regular Reviews

      Schedule weekly budget reviews to ensure you're staying on track.

      ### Vendor Communication

      Maintain clear communication with all vendors about budget constraints and expectations.

      ## Emergency Planning

      Always set aside 10-15% of your total budget for unexpected expenses. This contingency fund will save you from stress when surprises arise.

      ## Final Tips

      Remember that a successful event isn't necessarily the most expensive one. Focus on creating meaningful experiences for your guests while staying within your financial comfort zone.

      With careful planning, realistic expectations, and disciplined tracking, you can create memorable events that don't break the bank.
    `,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    category: "Event Management",
    author: "Tunde Adeleke",
    date: "May 22, 2023",
    readTime: "5 min read",
    tags: ["Budget", "Planning", "Finance", "Tips"]
  },
  // Add more blog posts as needed...
];

const BlogPostPage = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id || "0"));

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
            <Link to="/blog" className="text-primary hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
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
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts
                  .filter(p => p.id !== post.id)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group">
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-40 overflow-hidden">
                          <img 
                            src={relatedPost.image} 
                            alt={relatedPost.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                            {relatedPost.category}
                          </span>
                          <h4 className="text-lg font-bold mt-3 mb-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;