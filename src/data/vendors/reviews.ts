
import { VendorRating } from "@/types/vendor";
import { VendorReviewsMap } from "./types";

// Sample reviews
export const vendorReviews: VendorReviewsMap = {
  "v1": [
    {
      id: "r1",
      vendorId: "v1",
      userId: "u1",
      rating: 5,
      review: "The food was amazing! Everyone at my wedding was talking about how delicious everything was.",
      createdAt: new Date("2023-10-15")
    },
    {
      id: "r2",
      vendorId: "v1",
      userId: "u2",
      rating: 4,
      review: "Great service and variety. Would have given 5 stars but they arrived a bit late.",
      createdAt: new Date("2023-09-22")
    }
  ],
  "v2": [
    {
      id: "r3",
      vendorId: "v2",
      userId: "u3",
      rating: 5,
      review: "Beautiful venue with excellent staff. Our corporate event was flawless.",
      createdAt: new Date("2023-11-05")
    }
  ],
  "v4": [
    {
      id: "r4",
      vendorId: "v4",
      userId: "u4",
      rating: 5,
      review: "DJ kept the party going all night! Great music selection and very professional.",
      createdAt: new Date("2023-08-12")
    },
    {
      id: "r5",
      vendorId: "v4",
      userId: "u5",
      rating: 5,
      review: "Excellent equipment and they were able to accommodate all our song requests.",
      createdAt: new Date("2023-07-30")
    }
  ]
};

export default vendorReviews;
