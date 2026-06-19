const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  
  // Skill Classification
  category: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'DevOps', 'Mobile', 'ML/AI', 'Data Science', 'Design', 'DSA', 'Other'],
    default: 'Other'
  },
  difficulty_level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  
  // Learning Details
  estimated_learning_hours: { type: Number, default: 0 },
  prerequisite_skills: [String],
  tags: [String],
  resources: [
    {
      title: String,
      url: String,
      type: { type: String, enum: ['Video', 'Article', 'Course', 'Documentation'], default: 'Article' }
    }
  ],
  
  // Mentor Information
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor_name: String,
  mentor_experience_years: { type: Number, default: 0 },
  
  // Ratings & Reviews
  rating_average: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', skillSchema);
