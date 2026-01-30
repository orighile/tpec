import { Calendar, User, Clock, ArrowRight } from "phosphor-react";
import NewsletterSubscription from "../components/NewsletterSubscription";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Planning a Beautiful Wedding on a Budget in Nigeria",
    excerpt: "Smart strategies to create your dream wedding without breaking the bank. From venue selection to vendor negotiations, we've got you covered.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    category: "Wedding Planning",
    author: "Adaeze Nwosu",
    date: "December 15, 2025",
    readTime: "7 min read"
  },
  {
    id: 2,
    title: "The Rise of Micro Weddings in Nigeria: Intimate Celebrations That Make a Big Impact",
    excerpt: "Discover why more Nigerian couples are choosing smaller, more meaningful celebrations over large traditional weddings.",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800",
    category: "Wedding Trends",
    author: "Folake Adeleke",
    date: "January 10, 2026",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "How to Identify a Reliable Event Planner: 7 Key Signs to Look For",
    excerpt: "Hiring the right event planner can make or break your celebration. Learn the essential qualities that separate professionals from amateurs.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    category: "Planning Tips",
    author: "Tunde Okonkwo",
    date: "January 25, 2026",
    readTime: "8 min read"
  }
];

const BlogPage = () => {
  return (
    <>
      <main className="flex-1">
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Event planning tips, industry insights, and expert advice for Nigerian celebrations
            </p>
          </div>
        </div>

        {/* Featured Post */}
        <div className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="relative h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-xl">
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {blogPosts[0].category}
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {blogPosts[0].author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {blogPosts[0].date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {blogPosts[0].readTime}
                  </div>
                </div>
                <h2 className="text-3xl font-bold">{blogPosts[0].title}</h2>
                <p className="text-lg text-muted-foreground">{blogPosts[0].excerpt}</p>
                <Link to={`/blog/${blogPosts[0].id}`} className="inline-flex items-center font-medium text-primary hover:text-primary/80">
                  Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* All Blog Posts */}
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map(post => (
                <div key={post.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <User className="h-3 w-3 inline mr-1" />
                        {post.author}
                      </div>
                      <Link to={`/blog/${post.id}`} className="text-primary font-medium text-sm hover:text-primary/80">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <NewsletterSubscription variant="blog" />
      </main>
    </>
  );
};

export default BlogPage;
