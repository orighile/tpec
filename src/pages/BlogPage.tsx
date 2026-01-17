import { Calendar, User, Clock, ArrowRight } from "phosphor-react";
import NewsletterSubscription from "../components/NewsletterSubscription";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Tips for Planning a Nigerian Wedding",
    excerpt: "Discover the key elements to create a memorable Nigerian wedding celebration that honors traditions while embracing modern touches.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    category: "Wedding Planning",
    author: "Chioma Okonkwo",
    date: "June 15, 2023",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "How to Create an Event Budget That Actually Works",
    excerpt: "Learn practical strategies for creating and sticking to an event budget that ensures financial success without compromising on quality.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    category: "Event Management",
    author: "Tunde Adeleke",
    date: "May 22, 2023",
    readTime: "5 min read"
  },
  {
    id: 3,
    title: "The Rise of Virtual Events in Africa",
    excerpt: "Explore how virtual and hybrid events are transforming the event landscape across Africa, creating new opportunities for connection.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    category: "Industry Trends",
    author: "Zainab Ibrahim",
    date: "April 10, 2023",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Corporate Event Planning: From Concept to Execution",
    excerpt: "A comprehensive guide to planning successful corporate events that strengthen brand image and achieve business objectives.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    category: "Corporate Events",
    author: "David Olawale",
    date: "March 5, 2023",
    readTime: "10 min read"
  },
  {
    id: 5,
    title: "Incorporating African Culture in Modern Events",
    excerpt: "Discover creative ways to celebrate African heritage through thoughtful cultural elements in contemporary event design.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Cultural Events",
    author: "Amara Nwosu",
    date: "February 18, 2023",
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "Sustainable Event Planning: Reducing Environmental Impact",
    excerpt: "Learn how to create eco-friendly events that minimize waste and environmental impact while maximizing guest experience.",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    category: "Sustainability",
    author: "Folake Adeyemi",
    date: "January 30, 2023",
    readTime: "9 min read"
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
              Event planning tips, industry insights, and expert advice
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
