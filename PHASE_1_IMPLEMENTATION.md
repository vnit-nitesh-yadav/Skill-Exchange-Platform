# 🔧 Phase 1 Implementation Guide - For Developers

## What's New in Phase 1?

### ✨ New Features
1. ✅ Enhanced User Profiles (bio, department, experience level, etc.)
2. ✅ Skill Categories & Difficulty Levels
3. ✅ Review & Rating System
4. ✅ CSE Student Career Templates
5. ✅ Improved Profile Discovery

---

## 📊 Database Schema Changes

### User Model (Enhanced)

```javascript
{
  // Existing fields
  username: String,
  email: String,
  password: String,
  
  // NEW: Profile Information
  bio: String,
  profilePicture: String,
  
  // NEW: Educational Background
  department: String, // 'CSE', 'ECE', 'Mechanical', 'Civil', 'Other'
  graduation_year: Number,
  experience_level: String, // 'Beginner', 'Intermediate', 'Advanced', 'Expert'
  
  // ENHANCED: Skills with proficiency
  skills: [
    {
      name: String,
      proficiency: String, // 'Beginner', 'Intermediate', 'Advanced'
      yearsOfExperience: Number,
      category: String
    }
  ],
  
  // ENHANCED: Learning goals with priority
  learning: [
    {
      name: String,
      targetProficiency: String,
      priority: String // 'Low', 'Medium', 'High'
    }
  ],
  
  // NEW: Learning Preferences
  timezone: String,
  preferred_learning_format: [String], // ['Video', 'Text', '1-on-1 Chat', 'Projects', 'Pair Programming']
  
  // NEW: Social & Credibility
  verified_skills: [String],
  certifications: [String],
  github_profile: String,
  linkedin_profile: String,
  
  // NEW: Ratings & Reviews
  average_rating: Number,
  total_reviews: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Skill Model (Enhanced)

```javascript
{
  name: String,
  description: String,
  
  // NEW: Skill Classification
  category: String, // 'Frontend', 'Backend', 'DevOps', 'Mobile', 'ML/AI', 'Data Science', 'Design', 'DSA', 'Other'
  difficulty_level: String, // 'Beginner', 'Intermediate', 'Advanced'
  
  // NEW: Learning Details
  estimated_learning_hours: Number,
  prerequisite_skills: [String],
  tags: [String],
  resources: [
    {
      title: String,
      url: String,
      type: String // 'Video', 'Article', 'Course', 'Documentation'
    }
  ],
  
  // Mentor Information
  userId: ObjectId (ref: User),
  mentor_name: String,
  mentor_experience_years: Number,
  
  // NEW: Ratings & Reviews
  rating_average: Number,
  review_count: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### NEW: Review Model

```javascript
{
  // User being reviewed
  reviewed_user_id: ObjectId (ref: User),
  
  // User giving review
  reviewer_id: ObjectId (ref: User),
  
  // Related skill (optional)
  skill_id: ObjectId (ref: Skill),
  
  // Review Details
  rating: Number, // 1-5
  comment: String,
  review_type: String, // 'as_mentor', 'as_student'
  
  // Detailed Ratings
  detailed_ratings: {
    communication: Number,
    teaching_quality: Number,
    reliability: Number,
    responsiveness: Number
  },
  
  // Helpfulness
  helpful_count: Number,
  unhelpful_count: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 New API Endpoints

### Reviews Endpoints

#### Create Review
```
POST /api/reviews
Content-Type: application/json

{
  "reviewed_user_id": "user_id",
  "reviewer_id": "reviewer_id",
  "skill_id": "skill_id", // optional
  "rating": 5,
  "comment": "Great mentor!",
  "review_type": "as_student", // or "as_mentor"
  "detailed_ratings": {
    "communication": 5,
    "teaching_quality": 5,
    "reliability": 4,
    "responsiveness": 5
  }
}
```

#### Get Reviews for User
```
GET /api/reviews/user/:userId

Response:
[
  {
    _id: "...",
    reviewed_user_id: {...},
    reviewer_id: {...},
    rating: 5,
    comment: "...",
    ...
  }
]
```

#### Get Specific Review
```
GET /api/reviews/:reviewId
```

#### Update Review
```
PUT /api/reviews/:reviewId
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated comment",
  ...
}
```

#### Delete Review
```
DELETE /api/reviews/:reviewId
```

#### Get Reviews by Reviewer
```
GET /api/reviews/reviews-by/:reviewerId
```

### Enhanced User Endpoints

#### Get Full Profile with Reviews
```
GET /api/users/profile-full/:userId

Response:
{
  username: "...",
  email: "...",
  bio: "...",
  department: "CSE",
  experience_level: "Intermediate",
  skills: [...],
  learning: [...],
  average_rating: 4.5,
  total_reviews: 10,
  reviews: [...],
  stats: {
    total_reviews: 10,
    average_rating: 4.5,
    skills_teaching: 5,
    skills_learning: 3
  }
}
```

#### Add Skill to User
```
POST /api/users/profile/:id/add-skill

{
  "name": "React.js",
  "proficiency": "Intermediate",
  "yearsOfExperience": 1.5,
  "category": "Frontend"
}
```

#### Add Learning Goal
```
POST /api/users/profile/:id/add-learning

{
  "name": "Machine Learning",
  "targetProficiency": "Intermediate",
  "priority": "High"
}
```

#### Search Users by Filters
```
GET /api/users/search/filters?department=CSE&experience_level=Intermediate&skill=React

Response: [user1, user2, ...]
```

#### Get Top-Rated Mentors
```
GET /api/users/mentors/top-rated

Response: [mentor1, mentor2, ...] // Top 10 mentors
```

#### Get Mentors by Department
```
GET /api/users/mentors/department/:department

Response: [mentor1, mentor2, ...]
```

---

## 🎨 New Frontend Components

### ReviewCard Component
**Path:** `/frontend/src/components/ReviewCard.jsx`

**Props:**
- `userId`: ID of user being reviewed
- `currentUserId`: ID of logged-in user

**Features:**
- Display all reviews for a user
- Form to submit new review
- Star ratings and detailed ratings
- Helpful/unhelpful voting
- Date sorting

### ProfileTemplates Component
**Path:** `/frontend/src/components/ProfileTemplates.jsx`

**Props:**
- `userId`: ID of user applying template
- `onTemplateApply`: Callback when template applied

**Features:**
- 6 pre-made CSE career templates
- Visual cards with template details
- One-click template application
- Auto-populates skills and learning goals

**Templates Available:**
1. Full Stack Web Developer
2. Data Scientist / ML Engineer
3. Competitive Programmer
4. Cloud & DevOps Engineer
5. Mobile App Developer
6. AI/ML Researcher

---

## 🔄 Migration Guide

### How to Update Existing User Data

```javascript
// MongoDB migration script (optional)
// Run if you have existing users without new fields

db.users.updateMany(
  {},
  {
    $set: {
      bio: "",
      profilePicture: "",
      department: "Other",
      experience_level: "Beginner",
      timezone: "",
      preferred_learning_format: ["1-on-1 Chat"],
      verified_skills: [],
      certifications: [],
      github_profile: "",
      linkedin_profile: "",
      average_rating: 0,
      total_reviews: 0,
      updatedAt: new Date()
    }
  }
)
```

### Update Skills for Existing Users

```javascript
// Convert simple string skills to new format
db.users.find().forEach(function(user) {
  var newSkills = user.skills.map(function(skill) {
    return {
      name: skill,
      proficiency: "Intermediate",
      yearsOfExperience: 0,
      category: "Other"
    };
  });
  
  db.users.updateOne(
    { _id: user._id },
    { $set: { skills: newSkills } }
  );
});
```

---

## 🚀 Implementation Checklist

- [x] Create Review model
- [x] Create reviews API routes
- [x] Update User model with new fields
- [x] Update Skill model with categories
- [x] Create enhanced user endpoints
- [x] Create ReviewCard component
- [x] Create ProfileTemplates component
- [x] Write comprehensive documentation
- [ ] Update existing Profile component to use ReviewCard
- [ ] Update existing registration to use ProfileTemplates
- [ ] Test all new endpoints
- [ ] Update frontend API calls to include new fields
- [ ] Deploy to production

---

## 📝 Integration Steps

### 1. Update Register Component
Add optional template selection during signup

### 2. Update Profile Component
- Import ReviewCard component
- Import ProfileTemplates component
- Add both to profile page

### 3. Update User Model in Frontend
Ensure axios calls include new fields

### 4. Update Search Component
Use new filtering endpoints

### 5. Add Mentor Discovery
Use new top-rated and department endpoints

---

## 🔐 Security Considerations

- ✅ Verify user ownership before allowing reviews
- ✅ Prevent self-reviews
- ✅ Validate input data (length, format)
- ✅ Rate limit review submissions
- ✅ Sanitize user inputs
- ✅ Check authentication on all protected endpoints

---

## 🧪 Testing Guidelines

### Test Cases for Reviews

```javascript
// Test: Create review
POST /api/reviews with valid data → 201 Created

// Test: Get user reviews
GET /api/reviews/user/:userId → 200 OK

// Test: Update review
PUT /api/reviews/:reviewId with new rating → 200 OK

// Test: Delete review
DELETE /api/reviews/:reviewId → 200 OK

// Test: Average rating recalculation
Create 3 reviews (5, 4, 3 stars) → Average = 4
```

### Test Cases for Enhanced Users

```javascript
// Test: Get full profile
GET /api/users/profile-full/:userId → 200 with reviews

// Test: Add skill
POST /api/users/profile/:id/add-skill → 200, skill added

// Test: Filter users
GET /api/users/search/filters?department=CSE → 200 array

// Test: Top rated mentors
GET /api/users/mentors/top-rated → 200 sorted by rating
```

---

## 📚 Learning Resources

### To Learn More About Features:
- See COMPLETE_USER_GUIDE.md for user documentation
- Check individual component files for code examples
- Review API routes for endpoint documentation

### Common Use Cases:

1. **Display mentor profile with reviews:**
   - GET /api/users/profile-full/:mentorId
   - Map through reviews array
   - Use ReviewCard component

2. **Let new user pick template:**
   - Show ProfileTemplates component
   - User clicks "Apply Template"
   - Component auto-populates fields

3. **Search for skill with filters:**
   - GET /api/users/search/filters?skill=React&department=CSE
   - Display results
   - Allow connection request

---

## 🐛 Known Issues & Fixes

**Issue:** Average rating not updating
**Fix:** Ensure review DELETE route recalculates average

**Issue:** Old users don't have new fields
**Fix:** Run migration script or set defaults

**Issue:** Templates not applying
**Fix:** Check userId is correct, verify PUT endpoint

---

**Phase 1 Complete! Ready for Phase 2 (AI Recommendations)** 🎉

