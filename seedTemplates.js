require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('./models/Template');

const templates = [
  {
    name: 'Visualayer',
    description: 'A modern, clean template perfect for designers and creative professionals. Showcase your work with stunning visuals.',
    image: 'https://thumbs.dreamstime.com/b/modern-workspace-setup-laptop-phone-headphones-coffee-notebook-overhead-view-clean-organized-desk-smartphone-cup-394398515.jpg',
    tags: ['Modern', 'Creative', 'Design'],
    category: 'Design',
  },
  {
    name: 'Draftspace',
    description: 'Minimalist template for developers and tech professionals. Clean code, clean design.',
    image: 'https://as1.ftcdn.net/jpg/13/80/75/98/1000_F_1380759888_pmHTikKniydGrbaTaU03Rg7DQALMYbK2.jpg',
    tags: ['Minimal', 'Developer', 'Tech'],
    category: 'Developer',
  },
  {
    name: 'Pixelroom',
    description: 'Professional template for showcasing analytics, data, and business portfolios.',
    image: 'https://static.vecteezy.com/system/resources/previews/049/351/841/non_2x/male-employee-holding-laptop-pie-chart-black-and-white-2d-line-cartoon-character-arab-man-analyst-isolated-outline-person-data-analysis-sales-statistics-monochromatic-spot-illustration-vector.jpg',
    tags: ['Professional', 'Business', 'Analytics'],
    category: 'Business',
  },
];

const seedTemplates = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert templates
    await Template.insertMany(templates);
    console.log('Templates seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();

