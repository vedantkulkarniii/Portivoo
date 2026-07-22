const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    portfolioType: {
      type: String,
      enum: [
        'Developer',
        'UI/UX Designer',
        'Graphic Designer',
        'Digital Marketer',
        'Content Writer',
        'Photographer',
      ],
      default: 'Developer',
    },
    identity: {
      name: { type: String, default: '' },
      avatar: { type: String, default: '' },
      bio: { type: String, default: '' },
      tagline: { type: String, default: '' },
      location: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      resumeFiles: [{ name: String, url: String, type: String }],
      viewProjectsLabel: { type: String, default: 'View Projects' },
      hireMeLabel: { type: String, default: 'Hire Me' },
      downloadResumeLabel: { type: String, default: 'Download Resume' },
      contactMessage: { type: String, default: '' },
      calendlyLink: { type: String, default: '' },
    },
    socials: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    // Developer fields - Enhanced for Premium
    // About Me Section
    about: {
      summary: { type: String, default: '' },
      yearsOfExperience: { type: String, default: '' },
      currentStatus: { type: String, default: '' }, // Student/Freelancer/Professional/Open to opportunities
      domainExpertise: { type: [String], default: [] }, // SaaS, AI, FinTech, etc.
      workPreference: { type: [String], default: [] }, // Remote/Freelance/Full-time
    },
    // Skills & Tech Stack - Structured
    skills: [
      {
        name: String,
        category: String, // Languages, Frontend, Backend, Database, DevOps, AI/ML, Tools
        level: String, // Beginner, Intermediate, Advanced, Expert
        yearsOfExperience: Number,
      },
    ],
    currentlyLearning: { type: [String], default: [] },
    // Enhanced Projects
    projects: [
      {
        title: String,
        description: String,
        techStack: [String],
        role: String,
        keyFeatures: [String],
        metrics: String, // e.g., "10K+ users", "50% performance improvement"
        liveLink: String,
        githubLink: String,
        screenshots: [String],
        demoVideo: String,
        featured: Boolean,
      },
    ],
    // Case Studies (detailed project breakdowns)
    caseStudies: [
      {
        title: String,
        problem: String,
        approach: String,
        architecture: String,
        decisions: String,
        results: String,
        images: [String],
        techStack: [String],
      },
    ],
    // Enhanced Experience
    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
        techStack: [String],
        impact: String, // Quantified results
        current: Boolean,
      },
    ],
    // Enhanced Education
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        gpa: String,
        current: Boolean,
      },
    ],
    // Enhanced Certifications
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        credentialLink: String,
        certificateImage: String,
      },
    ],
    // Open Source & GitHub Activity
    openSource: {
      githubUsername: String,
      topRepositories: [
        {
          name: String,
          description: String,
          stars: Number,
          forks: Number,
          url: String,
        },
      ],
      contributions: [
        {
          project: String,
          description: String,
          prUrl: String,
        },
      ],
      contributionGraph: String, // URL to contribution heatmap image
    },
    // Achievements & Proof
    achievements: [
      {
        title: String,
        type: String, // Hackathon, Award, Feature, Community
        issuer: String,
        date: String,
        description: String,
        proofLink: String,
      },
    ],
    // Testimonials
    testimonials: [
      {
        name: String,
        role: String,
        company: String,
        text: String,
        photo: String,
        date: String,
      },
    ],
    // Services/What I Offer
    services: [
      {
        title: String,
        description: String,
        icon: String, // Icon name or emoji
      },
    ],
    // Availability & Pricing
    availability: {
      openToWork: Boolean,
      workTypes: [String], // Freelance, Full-time, Contract, Part-time
      hourlyRate: String,
      projectRate: String,
      ndaReady: Boolean,
      calendlyLink: String,
    },
    // Blogs/Knowledge Sharing
    blogs: [
      {
        title: String,
        excerpt: String,
        link: String,
        readTime: String,
        date: String,
        featured: Boolean,
      },
    ],
    references: [
      {
        name: String,
        position: String,
        company: String,
        email: String,
        phone: String,
      },
    ],
    // Photographer fields
    galleryPortfolio: [
      {
        image: String,
        title: String,
        description: String,
        category: String, // Landscape, Portrait, etc.
      },
    ],
    clients: [
      {
        name: String,
        project: String,
        date: String,
        feedback: String,
      },
    ],
    equipment: { type: [String], default: [] },
    exhibitions: [
      {
        event: String,
        date: String,
        location: String,
        description: String,
      },
    ],
    publications: [
      {
        title: String,
        publisher: String,
        date: String,
        link: String,
      },
    ],
    styleSpecialties: { type: [String], default: [] },
    // UI/UX Designer fields
    about: {
      summary: { type: String, default: '' },
      yearsOfExperience: { type: String, default: '' },
      currentStatus: { type: String, default: '' },
      designPhilosophy: { type: [String], default: [] },
      industries: { type: [String], default: [] },
      workPreference: { type: [String], default: [] },
    },
    designProcess: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    tools: [
      {
        name: String,
        proficiency: String, // Beginner, Intermediate, Advanced, Expert
        years: Number,
      },
    ],
    caseStudies: [
      {
        title: String,
        client: String,
        projectType: String,
        duration: String,
        team: String,
        role: String,
        problem: String,
        userResearch: String,
        personaImages: [String],
        userFlows: [String],
        journeyMaps: [String],
        wireframes: [String],
        highFiDesigns: [String],
        prototypeLink: String,
        usabilityTesting: String,
        keyDecisions: String,
        tradeoffs: String,
        outcomes: String,
        metrics: String,
        beforeAfterImages: [String],
        liveLink: String,
        lessonsLearned: String,
        images: [String], // General images
      },
    ],
    visualPortfolio: [
      {
        image: String,
        title: String,
        caption: String,
        caseStudyLink: String,
      },
    ],
    designSystems: [
      {
        name: String,
        link: String,
        description: String,
      },
    ],
    // Graphic Designer fields
    visualPortfolio: [
      {
        image: String,
        title: String,
        description: String,
        category: String,
      },
    ],
    brandIdentities: [
      {
        client: String,
        description: String,
        images: [String],
      },
    ],
    illustrations: [
      {
        image: String,
        title: String,
        description: String,
      },
    ],
    printDigitalWork: [
      {
        image: String,
        title: String,
        type: String, // Print or Digital
        description: String,
      },
    ],
    specialties: { type: [String], default: [] },
    // Content Writer fields
    writingSamples: [
      {
        title: String,
        excerpt: String,
        link: String,
        category: String,
        date: String,
        tags: [String],
      },
    ],
    topics: { type: [String], default: [] },
    seoSkills: [
      {
        tool: String,
        keywords: [String],
      },
    ],
    ghostwritingExp: { type: String, default: '' },
    // Digital Marketer fields
    campaigns: [
      {
        name: String,
        platform: String,
        results: String,
        images: [String],
        date: String,
        link: String,
        description: String,
      },
    ],
    metrics: {
      roi: String,
      ctr: String,
      impressions: String,
      conversions: String,
      other: String,
    },
    contentStrategy: { type: String, default: '' },
    socialMediaGrowth: {
      followers: String,
      engagement: String,
      platforms: [String],
    },
    // Architect fields
    projectGallery: [
      {
        image: String,
        title: String,
        description: String,
        type: String, // Blueprint, Render, Photo
      },
    ],
    builtWorks: [
      {
        name: String,
        location: String,
        year: String,
        image: String,
        description: String,
      },
    ],
    sustainabilityFocus: { type: String, default: '' },
    professionalLicenses: [
      {
        name: String,
        issuer: String,
        date: String,
        number: String,
      },
    ],
    // Musician/Artist fields
    audioVideoPortfolio: [
      {
        title: String,
        type: String, // audio or video
        embedUrl: String,
        description: String,
        date: String,
      },
    ],
    releases: [
      {
        title: String,
        type: String, // album, single, EP
        date: String,
        link: String,
        image: String,
        description: String,
      },
    ],
    performances: [
      {
        venue: String,
        date: String,
        location: String,
        description: String,
      },
    ],
    instruments: { type: [String], default: [] },
    collaborations: [
      {
        artist: String,
        project: String,
        date: String,
        link: String,
      },
    ],
    // Teacher/Educator fields
    coursesTaught: [
      {
        name: String,
        institution: String,
        level: String,
        description: String,
        platform: String,
      },
    ],
    studentsImpact: {
      stats: String,
      testimonials: [String],
    },
    subjects: { type: [String], default: [] },
    institutions: [
      {
        name: String,
        role: String,
        period: String,
        description: String,
      },
    ],
    teachingMaterials: [
      {
        title: String,
        type: String,
        link: String,
        description: String,
      },
    ],
    // Custom portfolio type - dynamic fields
    customFields: [
      {
        sectionName: String,
        fieldType: String, // text, textarea, list, upload
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    // Deployment and activation
    subdomain: {
      type: String,
      unique: true,
      sparse: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    template: {
      type: String,
      enum: ['dark', 'light', 'modern'],
      default: 'dark',
    },
    deployment: {
      isDeployed: {
        type: Boolean,
        default: false,
      },
      templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
      },
      deployedAt: {
        type: Date,
      },
    },
    profileStrength: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
profileSchema.index({ userId: 1 });
profileSchema.index({ subdomain: 1 });

// Calculate profile strength before saving
profileSchema.pre('save', function (next) {
  let strength = 0;
  let totalFields = 0;

  // Common fields (all types)
  totalFields += 2; // identity.name, identity.bio
  if (this.identity?.name) strength += 1;
  if (this.identity?.bio) strength += 1;

  totalFields += 1; // socials
  if (this.socials && this.socials.length > 0) strength += 1;

  // Type-specific fields
  switch (this.portfolioType) {
    case 'Developer':
      totalFields += 8;
      if (this.skills && this.skills.length > 0) strength += 1;
      if (this.projects && this.projects.length > 0) strength += 1;
      if (this.experience && this.experience.length > 0) strength += 1;
      if (this.education && this.education.length > 0) strength += 1;
      if (this.certifications && this.certifications.length > 0) strength += 1;
      if (this.openSource && this.openSource.githubUsername) strength += 1;
      if (this.about && this.about.summary) strength += 1;
      if (this.testimonials && this.testimonials.length > 0) strength += 1;
      break;
    case 'Photographer':
      totalFields += 7;
      if (this.galleryPortfolio && this.galleryPortfolio.length > 0) strength += 1;
      if (this.clients && this.clients.length > 0) strength += 1;
      if (this.equipment && this.equipment.length > 0) strength += 1;
      if (this.exhibitions && this.exhibitions.length > 0) strength += 1;
      if (this.publications && this.publications.length > 0) strength += 1;
      if (this.styleSpecialties && this.styleSpecialties.length > 0) strength += 1;
      if (this.education && this.education.length > 0) strength += 1;
      break;
    case 'UI/UX Designer':
      totalFields += 14; // Updated for complete UI/UX requirements
      if (this.identity?.name) strength += 0.20; // 20% weight
      if (this.identity?.bio) strength += 0.20; // 20% weight
      if (this.caseStudies && this.caseStudies.length > 0) strength += 0.40; // 40% weight
      if (this.tools && this.tools.length > 0) strength += 0.10; // 10% weight
      if (this.visualPortfolio && this.visualPortfolio.length > 0) strength += 0.15; // 15% weight
      if (this.about && this.about.summary) strength += 0.05; // 5% weight
      if (this.experience && this.experience.length > 0) strength += 0.05; // 5% weight
      if (this.education && this.education.length > 0) strength += 0.05; // 5% weight
      if (this.designProcess && this.designProcess.length > 0) strength += 0.05; // 5% weight
      if (this.certifications && this.certifications.length > 0) strength += 0.05; // 5% weight
      if (this.achievements && this.achievements.length > 0) strength += 0.05; // 5% weight
      if (this.testimonials && this.testimonials.length > 0) strength += 0.05; // 5% weight
      if (this.services && this.services.length > 0) strength += 0.05; // 5% weight
      if (this.availability) strength += 0.05; // 5% weight
      break;
    case 'Graphic Designer':
      totalFields += 6;
      if (this.visualPortfolio && this.visualPortfolio.length > 0) strength += 1;
      if (this.clients && this.clients.length > 0) strength += 1;
      if (this.tools && this.tools.length > 0) strength += 1;
      if (this.brandIdentities && this.brandIdentities.length > 0) strength += 1;
      if (this.awards && this.awards.length > 0) strength += 1;
      if (this.specialties && this.specialties.length > 0) strength += 1;
      break;
    case 'Content Writer':
      totalFields += 6;
      if (this.writingSamples && this.writingSamples.length > 0) strength += 1;
      if (this.publications && this.publications.length > 0) strength += 1;
      if (this.topics && this.topics.length > 0) strength += 1;
      if (this.seoSkills && this.seoSkills.length > 0) strength += 1;
      if (this.education && this.education.length > 0) strength += 1;
      if (this.awards && this.awards.length > 0) strength += 1;
      break;
    case 'Digital Marketer':
      totalFields += 6;
      if (this.campaigns && this.campaigns.length > 0) strength += 1;
      if (this.metrics && (this.metrics.roi || this.metrics.ctr)) strength += 1;
      if (this.tools && this.tools.length > 0) strength += 1;
      if (this.clients && this.clients.length > 0) strength += 1;
      if (this.certifications && this.certifications.length > 0) strength += 1;
      if (this.education && this.education.length > 0) strength += 1;
      break;
    case 'Architect':
      totalFields += 6;
      if (this.projectGallery && this.projectGallery.length > 0) strength += 1;
      if (this.builtWorks && this.builtWorks.length > 0) strength += 1;
      if (this.tools && this.tools.length > 0) strength += 1;
      if (this.awards && this.awards.length > 0) strength += 1;
      if (this.education && this.education.length > 0) strength += 1;
      if (this.professionalLicenses && this.professionalLicenses.length > 0) strength += 1;
      break;
    case 'Musician / Artist':
      totalFields += 6;
      if (this.audioVideoPortfolio && this.audioVideoPortfolio.length > 0) strength += 1;
      if (this.releases && this.releases.length > 0) strength += 1;
      if (this.performances && this.performances.length > 0) strength += 1;
      if (this.instruments && this.instruments.length > 0) strength += 1;
      if (this.collaborations && this.collaborations.length > 0) strength += 1;
      if (this.education && this.education.length > 0) strength += 1;
      break;
    case 'Teacher / Educator':
      totalFields += 6;
      if (this.coursesTaught && this.coursesTaught.length > 0) strength += 1;
      if (this.studentsImpact && (this.studentsImpact.stats || this.studentsImpact.testimonials?.length > 0)) strength += 1;
      if (this.subjects && this.subjects.length > 0) strength += 1;
      if (this.certifications && this.certifications.length > 0) strength += 1;
      if (this.institutions && this.institutions.length > 0) strength += 1;
      if (this.education && this.education.length > 0) strength += 1;
      break;
    case 'Custom':
      totalFields += 1;
      if (this.customFields && this.customFields.length > 0) strength += 1;
      break;
  }

  this.profileStrength = totalFields > 0 ? Math.round((strength / totalFields) * 100) : 0;
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
