

# Implementation Plan: TPEC Updates

## Summary

This plan addresses four key updates:
1. Make Chief chatbot more concise and conversational
2. Add Benin City and Ibadan mentions to Chief's knowledge
3. Add Blog page with 3 new blog posts on requested topics
4. Create testimonials carousel on homepage

---

## 1. Chief Chatbot - Concise Responses

**Current Issue:** The system prompt says "2-4 paragraphs max" which can feel too long for simple questions.

**Changes to `supabase/functions/chief-chat/index.ts`:**

Update the system prompt to be more conversational:

```text
Guidelines:
- Answer ONLY what is asked - no unsolicited information
- Keep responses short and direct (1-2 sentences for simple questions, 2-3 for complex ones)
- Be conversational, not formal or lecture-like
- Only expand if the user asks follow-up questions
- Use relevant emojis sparingly
```

**Add emphasis on Benin City and Ibadan:**

Update the Venues section to include:
- **Benin City** - Described as the "Center of African Culture" with its historical significance, Royal Court, and Edo cultural ceremonies
- **Ibadan** - Nigeria's largest city by land mass with key venues like Jogor Centre, Premier Hotel, and Bodija residential venues

---

## 2. Blog Page with 3 New Posts

**Current State:** BlogPage.tsx exists with outdated 2023 dates and generic topics.

**Changes to `src/pages/BlogPage.tsx`:**

Replace existing blog posts with 3 focused articles:

| # | Title | Category | Author | Date |
|---|-------|----------|--------|------|
| 1 | "Planning a Beautiful Wedding on a Budget in Nigeria" | Wedding Planning | Adaeze Nwosu | December 15, 2025 |
| 2 | "The Rise of Micro Weddings in Nigeria: Intimate Celebrations That Make a Big Impact" | Wedding Trends | Folake Adeleke | January 10, 2026 |
| 3 | "How to Identify a Reliable Event Planner: 7 Key Signs to Look For" | Planning Tips | Tunde Okonkwo | January 25, 2026 |

Each post will include:
- Nigerian-focused stock imagery
- Relevant excerpts
- Proper read times (5-8 mins)
- Recent dates (late 2025 - early 2026)

**Add Blog link to Footer:**

Update `src/components/Footer.tsx` to include "Blog" in Quick Links section.

---

## 3. Homepage Testimonials Carousel

**Create new component `src/components/TestimonialsCarousel.tsx`:**

A simple, elegant carousel/grid featuring 6 beta user testimonials:

| Name | Quote | Event Type | Location |
|------|-------|------------|----------|
| Ada Okonkwo | "TPEC made finding a reliable DJ stress-free! Booked in 2 days." | Lagos Bride 2025 | Lagos |
| Emeka Nwachukwu | "The vendor marketplace saved us weeks of research. Found our caterer and photographer in one evening." | Groom, January 2026 | Abuja |
| Blessing Okafor | "Chief AI gave me budget tips I never thought of. Saved over 30% on decorations!" | Birthday Planner | Benin City |
| Chidi Eze | "As a first-time event planner, the checklist feature kept me on track. Our corporate launch was flawless." | Event Coordinator | Ibadan |
| Ngozi Adebayo | "I found three amazing vendors from my village in Edo State. TPEC truly covers Nigeria." | Traditional Wedding | Edo State |
| Kunle Fashola | "The seating chart tool made our 400-guest owambe seamless. No confusion at all!" | Wedding Host | Lagos |

**Design:**
- Use Embla carousel (already installed) for horizontal scrolling
- Each testimonial card includes: quote, name, event type, and a Nigerian event stock image avatar
- Responsive: 1 card on mobile, 2 on tablet, 3 on desktop

**Update `src/pages/Index.tsx`:**

Import and add `<TestimonialsCarousel />` between `<VendorHighlights />` and `<CTA />` sections.

---

## Technical Details

### Files to Create
- `src/components/TestimonialsCarousel.tsx` - New testimonials component

### Files to Modify
| File | Changes |
|------|---------|
| `supabase/functions/chief-chat/index.ts` | Update system prompt for concise responses + add Benin City/Ibadan knowledge |
| `src/pages/BlogPage.tsx` | Replace blog posts with 3 new articles + update dates |
| `src/pages/BlogPostPage.tsx` | Update with full content for new blog posts |
| `src/components/Footer.tsx` | Add "Blog" to Quick Links |
| `src/pages/Index.tsx` | Import and add TestimonialsCarousel component |

### Dependencies
No new dependencies required. Will use:
- `embla-carousel-react` (already installed)
- Existing UI components (Card, Avatar, Badge)

---

## Visual Flow After Implementation

```text
Homepage Layout:
┌─────────────────────────────────┐
│           Hero                  │
├─────────────────────────────────┤
│     Inspiring Caption           │
├─────────────────────────────────┤
│     Browse Categories           │
├─────────────────────────────────┤
│   Book Consultation CTA         │
├─────────────────────────────────┤
│      Featured Events            │
├─────────────────────────────────┤
│     Vendor Highlights           │
├─────────────────────────────────┤
│   ★ Testimonials Carousel ★     │  <-- NEW
├─────────────────────────────────┤
│           CTA                   │
├─────────────────────────────────┤
│        JaraBot                  │
└─────────────────────────────────┘
```

