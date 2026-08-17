from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.authentication.models import User
from apps.companies.models import Company
from apps.categories.models import Category
from apps.opportunities.models import Opportunity
from apps.blog.models import BlogPost

class Command(BaseCommand):
    help = 'Seeds initial database data (Admin user, Categories, Companies, Opportunities, Blog posts)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting JobsOrbit database seed...'))

        # 1. Admin user
        admin_email = 'admin@jobsorbit.com'
        admin_user, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'name': 'JobsOrbit Admin',
                'role': 'superadmin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123456')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'Created SuperAdmin: {admin_email} (password: admin123456)'))
        else:
            self.stdout.write(f'SuperAdmin already exists: {admin_email}')

        # 2. Categories
        categories_data = [
            {"name": "Software Development", "slug": "software-development", "description": "Software engineering, coding, and programming roles."},
            {"name": "Web Development", "slug": "web-development", "description": "Frontend, backend, and full-stack web development."},
            {"name": "AI & Machine Learning", "slug": "ai-ml", "description": "Artificial intelligence, machine learning, and deep learning roles."},
            {"name": "Data Analytics", "slug": "data-analytics", "description": "Data analysis, BI, and reporting roles."},
            {"name": "Data Science", "slug": "data-science", "description": "Data science, statistics, and advanced analytics."},
            {"name": "Digital Marketing", "slug": "digital-marketing", "description": "SEO, social media, content, and performance marketing."},
            {"name": "UI/UX Design", "slug": "ui-ux-design", "description": "User interface design, user experience, and product design."},
            {"name": "Quality Assurance", "slug": "quality-assurance", "description": "Testing, QA, and quality engineering roles."},
            {"name": "DevOps & Cloud", "slug": "devops-cloud", "description": "Cloud computing, DevOps, and infrastructure roles."},
            {"name": "Other", "slug": "other", "description": "Roles that don't fit other categories."},
        ]

        cat_objs = {}
        for c_data in categories_data:
            cat, _ = Category.objects.get_or_create(
                slug=c_data['slug'],
                defaults={
                    'name': c_data['name'],
                    'description': c_data['description'],
                    'seo_title': f"{c_data['name']} Jobs & Internships | JobsOrbit",
                    'seo_description': f"Find latest {c_data['name']} jobs and internships for freshers and students."
                }
            )
            cat_objs[cat.slug] = cat
        self.stdout.write(self.style.SUCCESS(f'Initialized {len(cat_objs)} categories.'))

        # 3. Companies
        companies_data = [
            {
                "name": "Google",
                "slug": "google",
                "logo": "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80",
                "website": "https://careers.google.com",
                "description": "Leading global tech company specializing in internet-related services and products."
            },
            {
                "name": "Microsoft",
                "slug": "microsoft",
                "logo": "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=200&auto=format&fit=crop&q=80",
                "website": "https://careers.microsoft.com",
                "description": "Empowering every person and organization on the planet to achieve more."
            },
            {
                "name": "Amazon",
                "slug": "amazon",
                "logo": "https://images.unsplash.com/photo-1523474253246-f3be9082974e?w=200&auto=format&fit=crop&q=80",
                "website": "https://amazon.jobs",
                "description": "Earth's most customer-centric company, leader in e-commerce and AWS cloud."
            },
            {
                "name": "Razorpay",
                "slug": "razorpay",
                "logo": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80",
                "website": "https://razorpay.com/jobs",
                "description": "India's premier full-stack payments and financial solutions company."
            },
            {
                "name": "Zomato",
                "slug": "zomato",
                "logo": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&auto=format&fit=crop&q=80",
                "website": "https://zomato.com/careers",
                "description": "Connecting millions of customers with top food delivery and dining experiences."
            },
        ]

        comp_objs = {}
        for comp_data in companies_data:
            comp, _ = Company.objects.get_or_create(
                slug=comp_data['slug'],
                defaults=comp_data
            )
            comp_objs[comp.slug] = comp
        self.stdout.write(self.style.SUCCESS(f'Initialized {len(comp_objs)} companies.'))

        # 4. Opportunities
        now = timezone.now()
        opportunities_data = [
            {
                "title": "Software Development Engineer - Fresher",
                "slug": "google-sde-fresher-2026",
                "type": "job",
                "company": comp_objs.get("google"),
                "category": cat_objs.get("software-development"),
                "description": "Join Google as a Software Development Engineer. You will work on massive scale distributed systems and modern web technologies.",
                "responsibilities": [
                    "Design and implement scalable microservices.",
                    "Collaborate with product and UX design teams.",
                    "Write robust unit and integration tests."
                ],
                "requirements": [
                    "B.Tech/B.E in Computer Science, IT, or related fields (2025/2026 batch).",
                    "Proficiency in Data Structures, Algorithms, and Object Oriented Design.",
                    "Knowledge of C++, Java, Python, or Go."
                ],
                "skills": ["C++", "Java", "Data Structures", "Algorithms", "System Design"],
                "job_type": "full-time",
                "work_mode": "hybrid",
                "location": "Bengaluru, India",
                "salary_min": 1800000,
                "salary_max": 2400000,
                "salary_type": "yearly",
                "salary_currency": "INR",
                "is_paid": True,
                "education": "B.Tech / B.E. / M.C.A",
                "experience": "fresher",
                "application_url": "https://careers.google.com/jobs/results/",
                "deadline": now + timedelta(days=30),
                "status": "published",
                "featured": True,
                "seo_title": "Google SDE 1 Off Campus Drive 2026 | JobsOrbit",
                "seo_description": "Apply for Google Software Development Engineer fresher position in Bengaluru.",
                "seo_keywords": ["Google Jobs", "SDE Fresher", "Off Campus 2026"],
                "published_at": now,
            },
            {
                "title": "Frontend Engineering Intern (React / Next.js)",
                "slug": "microsoft-frontend-intern",
                "type": "internship",
                "company": comp_objs.get("microsoft"),
                "category": cat_objs.get("web-development"),
                "description": "Microsoft is seeking high-energy Frontend Engineering interns to build delightful user experiences across Microsoft 365 apps.",
                "responsibilities": [
                    "Develop responsive web interfaces with React and TypeScript.",
                    "Optimize bundle sizes and Core Web Vitals.",
                    "Participate in design sprints and code reviews."
                ],
                "requirements": [
                    "Pre-final year or final year undergraduate student.",
                    "Strong foundation in HTML5, CSS3, Modern JavaScript, and React.",
                    "Familiarity with Git and version control."
                ],
                "skills": ["React", "TypeScript", "Next.js", "Tailwind CSS", "REST APIs"],
                "job_type": "full-time",
                "work_mode": "remote",
                "location": "Remote / Hyderabad",
                "salary_min": 80000,
                "salary_max": 100000,
                "salary_type": "stipend",
                "salary_currency": "INR",
                "is_paid": True,
                "education": "Any Degree",
                "experience": "fresher",
                "application_url": "https://careers.microsoft.com/",
                "deadline": now + timedelta(days=20),
                "status": "published",
                "featured": True,
                "seo_title": "Microsoft React Intern Hiring 2026 | JobsOrbit",
                "seo_description": "Microsoft 6-month internship for frontend engineering freshers.",
                "seo_keywords": ["Microsoft Internship", "React Intern", "WFH Internship"],
                "published_at": now,
            },
            {
                "title": "Graduate Trainee Engineer - Off Campus Drive",
                "slug": "amazon-graduate-trainee-2026",
                "type": "offcampus",
                "company": comp_objs.get("amazon"),
                "category": cat_objs.get("software-development"),
                "description": "Amazon is hiring Graduate Trainee Engineers across multiple tech locations in India. Great opportunity for 2025/2026 graduates.",
                "responsibilities": [
                    "Assist in automated testing and cloud deployment pipelines.",
                    "Monitor production systems and investigate software issues.",
                    "Write documentation and technical specs."
                ],
                "requirements": [
                    "Degree in CS/IT/ECE/EE with 60%+ throughout academics.",
                    "Good communication and problem solving skills."
                ],
                "skills": ["Python", "AWS", "SQL", "Linux", "Git"],
                "job_type": "full-time",
                "work_mode": "onsite",
                "location": "Hyderabad / Chennai / Pune",
                "salary_min": 1200000,
                "salary_max": 1600000,
                "salary_type": "yearly",
                "salary_currency": "INR",
                "is_paid": True,
                "education": "B.Tech / B.E / B.Sc / BCA",
                "experience": "fresher",
                "application_url": "https://amazon.jobs",
                "deadline": now + timedelta(days=15),
                "status": "published",
                "featured": False,
                "seo_title": "Amazon Off Campus Drive 2026 | Graduate Trainee",
                "seo_description": "Direct application link for Amazon Graduate Trainee Engineer off-campus drive.",
                "seo_keywords": ["Amazon Off Campus", "Fresher Hiring"],
                "published_at": now,
            },
            {
                "title": "Backend Developer - Python / Django (WFH)",
                "slug": "razorpay-backend-django-wfh",
                "type": "wfh",
                "company": comp_objs.get("razorpay"),
                "category": cat_objs.get("web-development"),
                "description": "Work with Razorpay's high-speed core banking and payout systems from anywhere in India.",
                "responsibilities": [
                    "Build high-throughput REST APIs and webhook ingestion engines.",
                    "Write resilient database queries in PostgreSQL.",
                    "Implement security and authentication best practices."
                ],
                "requirements": [
                    "0–1 years of hands-on experience in Python & Django / FastAPI.",
                    "Solid understanding of relational databases and ORMs."
                ],
                "skills": ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
                "job_type": "full-time",
                "work_mode": "remote",
                "location": "Remote (India)",
                "salary_min": 900000,
                "salary_max": 1400000,
                "salary_type": "yearly",
                "salary_currency": "INR",
                "is_paid": True,
                "education": "Graduate",
                "experience": "0-1",
                "application_url": "https://razorpay.com/jobs",
                "deadline": now + timedelta(days=25),
                "status": "published",
                "featured": True,
                "seo_title": "Razorpay WFH Python Backend Developer Hiring",
                "seo_description": "Full-time Remote backend developer position at Razorpay.",
                "seo_keywords": ["Django Jobs", "Python Remote", "Razorpay Careers"],
                "published_at": now,
            },
        ]

        for op_data in opportunities_data:
            Opportunity.objects.get_or_create(
                slug=op_data['slug'],
                defaults=op_data
            )
        self.stdout.write(self.style.SUCCESS(f'Initialized sample Opportunities.'))

        # 5. Blog posts
        blog_data = [
            {
                "title": "How to Crack Tech Off-Campus Placements in 2026: The Complete Roadmap",
                "slug": "how-to-crack-off-campus-placements-2026",
                "excerpt": "A step-by-step master guide for college students and freshers to land high-paying software jobs without relying on tier-1 college tags.",
                "content": """# The Off-Campus Placement Playbook

Getting placed through off-campus drives can feel overwhelming, but with the right preparation strategy, you can stand out among thousands of candidates.

## 1. Master Data Structures and Algorithms
Focus on core problem solving:
- Arrays, Hashing, Two Pointers
- Trees & Graphs
- Dynamic Programming & Recursion

## 2. Build 2 Outstanding Full-Stack Projects
Avoid generic todo apps. Build applications with:
- Full authentication & authorization
- Real database indexing & caching
- Clear documentation and live demo link

## 3. Optimize Your Resume for ATS
- Single page layout
- Quantify accomplishments (e.g. "Improved query performance by 40%")
- Highlight verified skills and GitHub links

Good luck with your applications!
""",
                "cover_image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
                "category": "Career Advice",
                "tags": ["Placements", "Resume", "Off Campus", "Interview Preparation"],
                "author": admin_user,
                "status": "published",
                "seo_title": "Off-Campus Placement Roadmap 2026 | JobsOrbit",
                "seo_description": "Complete guide on preparing for software engineering off-campus hiring drives.",
                "published_at": now,
            },
            {
                "title": "Top 10 Resume Mistakes Freshers Make (And How to Fix Them)",
                "slug": "top-10-resume-mistakes-freshers-make",
                "excerpt": "Discover the most common mistakes that get fresher resumes rejected by recruiters and ATS scanners.",
                "content": """# Top Resume Fixes for College Students

Recruiters spend an average of 6 seconds reviewing a fresher resume. Here are the top mistakes you must avoid:

1. **Unformatted Contact Info**: Keep email, LinkedIn, and GitHub clickable and at the top.
2. **Missing Tech Stack Specifics**: Don't just write "Web Development" — list "React, Next.js, Django, PostgreSQL".
3. **Overusing Generic Hobbies**: Keep space for technical coursework, hackathons, and certifications.
""",
                "cover_image": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80",
                "category": "Resume Guide",
                "tags": ["Resume", "Career Tips", "Hiring"],
                "author": admin_user,
                "status": "published",
                "seo_title": "Top 10 Resume Mistakes Freshers Make | JobsOrbit",
                "seo_description": "Learn how to optimize your resume for recruiters and ATS filters.",
                "published_at": now,
            }
        ]

        for b in blog_data:
            BlogPost.objects.get_or_create(
                slug=b['slug'],
                defaults=b
            )
        self.stdout.write(self.style.SUCCESS(f'Initialized sample Blog Posts.'))

        self.stdout.write(self.style.SUCCESS('[SUCCESS] JobsOrbit database seed completed successfully!'))
