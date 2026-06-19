const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Profile Information
    bio: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    
    // Educational Background
    department: { 
        type: String, 
        enum: ['CSE', 'ECE', 'Mechanical', 'Civil', 'Other'], 
        default: 'Other' 
    },
    graduation_year: { type: Number },
    experience_level: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
    },
    
    // Skills Management
    skills: { 
        type: [
            {
                name: String,
                proficiency: { 
                    type: String, 
                    enum: ['Beginner', 'Intermediate', 'Advanced'],
                    default: 'Intermediate'
                },
                yearsOfExperience: { type: Number, default: 0 },
                category: String
            }
        ], 
        default: [] 
    },
    learning: { 
        type: [
            {
                name: String,
                targetProficiency: String,
                priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
            }
        ], 
        default: [] 
    },
    
    // Learning Preferences
    timezone: { type: String, default: '' },
    preferred_learning_format: { 
        type: [String], 
        enum: ['Video', 'Text', '1-on-1 Chat', 'Projects', 'Pair Programming'],
        default: ['1-on-1 Chat'] 
    },
    
    // Social & Credibility
    verified_skills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    github_profile: { type: String, default: '' },
    linkedin_profile: { type: String, default: '' },
    
    // Ratings & Reviews
    average_rating: { type: Number, default: 0 },
    total_reviews: { type: Number, default: 0 },
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
