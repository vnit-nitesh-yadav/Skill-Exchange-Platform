import React, { useState } from 'react';
import API_URL from '../api';
import axios from 'axios';
import './ProfileTemplates.css';

function ProfileTemplates({ userId, onTemplateApply }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  const templates = [
    {
      id: 'web-developer',
      title: 'Full Stack Web Developer',
      description: 'For students interested in web development from frontend to backend',
      icon: '🌐',
      profile: {
        experience_level: 'Beginner',
        bio: 'Aspiring full-stack developer passionate about building web applications. Learning modern web technologies and best practices.',
        department: 'CSE',
        skills: [
          { name: 'HTML/CSS', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'Frontend' },
          { name: 'JavaScript', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'Frontend' },
          { name: 'Git & GitHub', proficiency: 'Beginner', yearsOfExperience: 1, category: 'DevOps' }
        ],
        learning: [
          { name: 'React.js', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'Node.js & Express', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'MongoDB', targetProficiency: 'Intermediate', priority: 'Medium' },
          { name: 'SQL', targetProficiency: 'Intermediate', priority: 'Medium' }
        ],
        preferred_learning_format: ['Video', '1-on-1 Chat', 'Projects']
      }
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist / ML Engineer',
      description: 'For students focusing on machine learning and data science',
      icon: '📊',
      profile: {
        experience_level: 'Intermediate',
        bio: 'Data science enthusiast interested in machine learning, data analysis, and AI. Love solving real-world problems with data.',
        department: 'CSE',
        skills: [
          { name: 'Python', proficiency: 'Advanced', yearsOfExperience: 2, category: 'Backend' },
          { name: 'Data Structures', proficiency: 'Advanced', yearsOfExperience: 2, category: 'DSA' },
          { name: 'SQL', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'Backend' }
        ],
        learning: [
          { name: 'TensorFlow', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'Machine Learning', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'Deep Learning', targetProficiency: 'Intermediate', priority: 'High' },
          { name: 'Pandas & NumPy', targetProficiency: 'Advanced', priority: 'Medium' }
        ],
        preferred_learning_format: ['Video', '1-on-1 Chat', 'Projects', 'Pair Programming']
      }
    },
    {
      id: 'competitive-programmer',
      title: 'Competitive Programmer',
      description: 'For students interested in coding contests and algorithms',
      icon: '🎯',
      profile: {
        experience_level: 'Advanced',
        bio: 'Competitive programmer passionate about algorithms and problem-solving. Active on Codeforces and CodeChef.',
        department: 'CSE',
        skills: [
          { name: 'C++', proficiency: 'Advanced', yearsOfExperience: 3, category: 'Backend' },
          { name: 'Data Structures & Algorithms', proficiency: 'Advanced', yearsOfExperience: 2, category: 'DSA' },
          { name: 'Problem Solving', proficiency: 'Advanced', yearsOfExperience: 2, category: 'DSA' }
        ],
        learning: [
          { name: 'Advanced Algorithms', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'Graph Theory', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'Dynamic Programming', targetProficiency: 'Advanced', priority: 'Medium' },
          { name: 'Interview Preparation', targetProficiency: 'Advanced', priority: 'Medium' }
        ],
        preferred_learning_format: ['1-on-1 Chat', 'Text', 'Pair Programming']
      }
    },
    {
      id: 'cloud-devops',
      title: 'Cloud & DevOps Engineer',
      description: 'For students interested in cloud computing and DevOps',
      icon: '☁️',
      profile: {
        experience_level: 'Intermediate',
        bio: 'DevOps enthusiast learning cloud technologies, containerization, and infrastructure automation.',
        department: 'CSE',
        skills: [
          { name: 'Linux', proficiency: 'Advanced', yearsOfExperience: 2, category: 'DevOps' },
          { name: 'Docker', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'DevOps' },
          { name: 'Git', proficiency: 'Advanced', yearsOfExperience: 2, category: 'DevOps' }
        ],
        learning: [
          { name: 'Kubernetes', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'AWS', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'CI/CD Pipelines', targetProficiency: 'Intermediate', priority: 'High' },
          { name: 'Terraform', targetProficiency: 'Intermediate', priority: 'Medium' }
        ],
        preferred_learning_format: ['Video', '1-on-1 Chat', 'Projects']
      }
    },
    {
      id: 'mobile-developer',
      title: 'Mobile App Developer',
      description: 'For students interested in iOS, Android, or cross-platform development',
      icon: '📱',
      profile: {
        experience_level: 'Intermediate',
        bio: 'Mobile app developer interested in creating innovative applications for iOS and Android platforms.',
        department: 'CSE',
        skills: [
          { name: 'Java', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'Backend' },
          { name: 'JavaScript', proficiency: 'Intermediate', yearsOfExperience: 1, category: 'Frontend' },
          { name: 'React', proficiency: 'Beginner', yearsOfExperience: 1, category: 'Frontend' }
        ],
        learning: [
          { name: 'React Native', targetProficiency: 'Intermediate', priority: 'High' },
          { name: 'Flutter', targetProficiency: 'Intermediate', priority: 'High' },
          { name: 'Mobile UI/UX Design', targetProficiency: 'Intermediate', priority: 'Medium' },
          { name: 'Firebase', targetProficiency: 'Intermediate', priority: 'Medium' }
        ],
        preferred_learning_format: ['Video', '1-on-1 Chat', 'Projects', 'Pair Programming']
      }
    },
    {
      id: 'ai-researcher',
      title: 'AI/ML Researcher',
      description: 'For students interested in advanced AI research and cutting-edge ML',
      icon: '🤖',
      profile: {
        experience_level: 'Advanced',
        bio: 'AI researcher interested in NLP, computer vision, and advanced neural network architectures.',
        department: 'CSE',
        skills: [
          { name: 'Python', proficiency: 'Advanced', yearsOfExperience: 3, category: 'Backend' },
          { name: 'Machine Learning', proficiency: 'Advanced', yearsOfExperience: 2, category: 'ML/AI' },
          { name: 'Deep Learning', proficiency: 'Advanced', yearsOfExperience: 2, category: 'ML/AI' }
        ],
        learning: [
          { name: 'NLP', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'Computer Vision', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'PyTorch', targetProficiency: 'Advanced', priority: 'High' },
          { name: 'Research Paper Writing', targetProficiency: 'Intermediate', priority: 'Medium' }
        ],
        preferred_learning_format: ['1-on-1 Chat', 'Text', 'Pair Programming']
      }
    }
  ];

  const handleApplyTemplate = async (template) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await axios.put(
        `${API_URL}/api/users/profile/${userId}`,
        template.profile,
        config
      );

      alert(`✓ ${template.title} template applied successfully!`);
      if (onTemplateApply) {
        onTemplateApply(response.data);
      }
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error applying template:', error);
      alert(error.response?.data?.error || 'Failed to apply template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <h2>📚 CSE Career Templates</h2>
        <p>Choose a template that matches your interests and goals. You can always customize it later!</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="template-icon">{template.icon}</div>
            <h3>{template.title}</h3>
            <p>{template.description}</p>

            {selectedTemplate?.id === template.id && (
              <div className="template-details">
                <div className="details-section">
                  <h4>Teaching Skills:</h4>
                  <ul>
                    {template.profile.skills.map((skill, idx) => (
                      <li key={idx}>
                        {skill.name} • {skill.proficiency}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="details-section">
                  <h4>Learning Goals:</h4>
                  <ul>
                    {template.profile.learning.map((goal, idx) => (
                      <li key={idx}>
                        {goal.name} • Priority: {goal.priority}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className="btn-apply-template"
                  onClick={() => handleApplyTemplate(template)}
                  disabled={loading}
                >
                  {loading ? 'Applying...' : 'Apply This Template'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="templates-info">
        <h3>💡 Why Use Templates?</h3>
        <ul>
          <li><strong>Quick Setup:</strong> Get your profile ready in seconds</li>
          <li><strong>Best Practices:</strong> Pre-populated with recommended skills for your track</li>
          <li><strong>Guidance:</strong> Clear learning path based on CSE industry standards</li>
          <li><strong>Flexibility:</strong> Fully customizable after application</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileTemplates;
