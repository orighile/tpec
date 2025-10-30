import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Star, ThumbsUp, ThumbsDown, Flag, Filter, Calendar,
  User, Camera, CheckCircle, AlertTriangle, MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  images?: string[];
  response?: {
    content: string;
    date: Date;
  };
  eventType?: string;
  eventDate?: Date;
}

interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface ReviewRatingSystemProps {
  vendorId: string;
  vendorName: string;
  currentRating: number;
  totalReviews: number;
  canReview?: boolean;
}

const ReviewRatingSystem: React.FC<ReviewRatingSystemProps> = ({
  vendorId,
  vendorName,
  currentRating,
  totalReviews,
  canReview = false
}) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      title: 'Exceptional Photography Service!',
      content: 'Amazing work! The photographer was professional, creative, and delivered stunning photos. Highly recommend for any event.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      verified: true,
      helpful: 12,
      notHelpful: 1,
      images: ['/api/placeholder/200/150', '/api/placeholder/200/150'],
      eventType: 'Wedding',
      eventDate: new Date('2024-12-15'),
      response: {
        content: 'Thank you Sarah! It was a pleasure working with you on your special day.',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    },
    {
      id: '2',
      userId: '2',
      userName: 'Michael Chen',
      userAvatar: '/api/placeholder/40/40',
      rating: 4,
      title: 'Great service, minor delays',
      content: 'Overall excellent service. The team was professional and the food quality was outstanding. There were some minor delays in setup but nothing major.',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      verified: true,
      helpful: 8,
      notHelpful: 0,
      eventType: 'Corporate Event',
      eventDate: new Date('2024-11-20')
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emma Wilson',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      title: 'Perfect for our birthday party',
      content: 'Everything was exactly as promised. Great communication, timely delivery, and exceeded our expectations!',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      verified: false,
      helpful: 5,
      notHelpful: 2,
      eventType: 'Birthday Party',
      eventDate: new Date('2024-11-05')
    }
  ]);

  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    eventType: '',
    eventDate: ''
  });
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  const { toast } = useToast();

  const ratingBreakdown: RatingBreakdown = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRatingClick = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmitReview = () => {
    if (!newReview.rating || !newReview.title || !newReview.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: 'current_user',
      userName: 'You',
      userAvatar: '/api/placeholder/40/40',
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      date: new Date(),
      verified: false,
      helpful: 0,
      notHelpful: 0,
      eventType: newReview.eventType,
      eventDate: newReview.eventDate ? new Date(newReview.eventDate) : undefined
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, title: '', content: '', eventType: '', eventDate: '' });
    setShowWriteReview(false);

    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            helpful: isHelpful ? review.helpful + 1 : review.helpful,
            notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ));
  };

  const filteredReviews = reviews
    .filter(review => filterRating === 0 || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return a.date.getTime() - b.date.getTime();
        case 'highest': return b.rating - a.rating;
        case 'lowest': return a.rating - b.rating;
        case 'helpful': return b.helpful - a.helpful;
        default: return b.date.getTime() - a.date.getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Reviews & Ratings
          </CardTitle>
          <CardDescription>Customer feedback for {vendorName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{currentRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(currentRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-muted-foreground">
                Based on {totalReviews} reviews
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Progress 
                    value={(ratingBreakdown[rating as keyof RatingBreakdown] / totalReviews) * 100} 
                    className="flex-1 h-2" 
                  />
                  <span className="text-sm w-8 text-muted-foreground">
                    {ratingBreakdown[rating as keyof RatingBreakdown]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {canReview && (
            <div className="mt-6 pt-4 border-t">
              <Button onClick={() => setShowWriteReview(true)}>
                Write a Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Write Review Form */}
      {showWriteReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
            <CardDescription>Share your experience with {vendorName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Rating *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(rating => (
                  <Star
                    key={rating}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      rating <= newReview.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                    onClick={() => handleRatingClick(rating)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Review Title *</Label>
                <Input
                  placeholder="Summarize your experience"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Input
                  placeholder="Wedding, Birthday, etc."
                  value={newReview.eventType}
                  onChange={(e) => setNewReview({ ...newReview, eventType: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your Review *</Label>
              <Textarea
                placeholder="Tell others about your experience..."
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Event Date</Label>
              <Input
                type="date"
                value={newReview.eventDate}
                onChange={(e) => setNewReview({ ...newReview, eventDate: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview}>Submit Review</Button>
              <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRating === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRating(0)}
              >
                All
              </Button>
              {[5, 4, 3, 2, 1].map(rating => (
                <Button
                  key={rating}
                  variant={filterRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRating(rating)}
                >
                  {rating} ⭐
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.userAvatar} />
                    <AvatarFallback>{review.userName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(review.date)}</span>
                      {review.eventType && (
                        <>
                          <span>•</span>
                          <span>{review.eventType}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Rating and Title */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.rating}/5
                  </span>
                </div>
                <h4 className="font-semibold">{review.title}</h4>
              </div>

              {/* Review Content */}
              <p className="text-muted-foreground mb-4">{review.content}</p>

              {/* Review Images */}
              {review.images && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(review.id, true)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                  <button
                    onClick={() => handleHelpful(review.id, false)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Not Helpful ({review.notHelpful})
                  </button>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>

              {/* Vendor Response */}
              {review.response && (
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Response from {vendorName}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.response.date)}
                    </span>
                  </div>
                  <p className="text-sm">{review.response.content}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
            <p className="text-muted-foreground">
              {filterRating > 0 
                ? `No reviews with ${filterRating} stars yet`
                : 'Be the first to leave a review!'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewRatingSystem;
