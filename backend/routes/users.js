const express = require('express');
const User = require('../models/User');
const Review = require('../models/Review');
const router = express.Router();

router.get('/profile/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
});

// GET: Get user profile with reviews and stats
router.get('/profile-full/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const reviews = await Review.find({ reviewed_user_id: req.params.id })
            .populate('reviewer_id', 'username profilePicture');
        
        res.json({
            ...user.toObject(),
            reviews,
            stats: {
                total_reviews: user.total_reviews,
                average_rating: user.average_rating,
                skills_teaching: user.skills.length,
                skills_learning: user.learning.length
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT: Update user profile
router.put('/profile/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, updatedAt: Date.now() }, 
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST: Add a skill to user
router.post('/profile/:id/add-skill', async (req, res) => {
    try {
        const { name, proficiency, yearsOfExperience, category } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.skills.push({
            name,
            proficiency: proficiency || 'Intermediate',
            yearsOfExperience: yearsOfExperience || 0,
            category: category || 'Other'
        });

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST: Add a learning goal
router.post('/profile/:id/add-learning', async (req, res) => {
    try {
        const { name, targetProficiency, priority } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.learning.push({
            name,
            targetProficiency: targetProficiency || 'Intermediate',
            priority: priority || 'Medium'
        });

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: Get users by filters (department, experience level, etc)
router.get('/search/filters', async (req, res) => {
    try {
        const { department, experience_level, skill } = req.query;
        
        let query = {};
        if (department) query.department = department;
        if (experience_level) query.experience_level = experience_level;
        
        let users = await User.find(query);
        
        // Filter by skill if provided
        if (skill) {
            users = users.filter(user => 
                user.skills.some(s => s.name.toLowerCase().includes(skill.toLowerCase()))
            );
        }

        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: Get top-rated mentors
router.get('/mentors/top-rated', async (req, res) => {
    try {
        const mentors = await User.find()
            .sort({ average_rating: -1, total_reviews: -1 })
            .limit(10);
        
        res.json(mentors);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: Get mentors by department
router.get('/mentors/department/:department', async (req, res) => {
    try {
        const mentors = await User.find({ department: req.params.department })
            .sort({ average_rating: -1 })
            .limit(20);
        
        res.json(mentors);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
