from django.db import models
from django.utils import timezone
from django.utils.text import slugify

class Opportunity(models.Model):
    TYPE_CHOICES = (
        ('job', 'Job'),
        ('internship', 'Internship'),
        ('offcampus', 'Off-campus'),
        ('wfh', 'Work from Home'),
    )

    JOB_TYPE_CHOICES = (
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
    )

    WORK_MODE_CHOICES = (
        ('remote', 'Remote'),
        ('onsite', 'On-site'),
        ('hybrid', 'Hybrid'),
    )

    SALARY_TYPE_CHOICES = (
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('stipend', 'Stipend'),
        ('unpaid', 'Unpaid'),
    )

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('expired', 'Expired'),
    )

    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='job', db_index=True)
    
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='opportunities',
        db_index=True
    )
    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.CASCADE,
        related_name='opportunities',
        db_index=True
    )

    description = models.TextField()
    responsibilities = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)

    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='full-time')
    work_mode = models.CharField(max_length=20, choices=WORK_MODE_CHOICES, default='onsite')
    location = models.CharField(max_length=255, blank=True, default='')

    salary_min = models.FloatField(default=0)
    salary_max = models.FloatField(default=0)
    salary_type = models.CharField(max_length=20, choices=SALARY_TYPE_CHOICES, default='monthly')
    salary_currency = models.CharField(max_length=10, default='INR')
    is_paid = models.BooleanField(default=True)

    education = models.CharField(max_length=255, blank=True, default='')
    experience = models.CharField(max_length=50, default='fresher')
    application_url = models.CharField(max_length=500)
    deadline = models.DateTimeField(null=True, blank=True, db_index=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published', db_index=True)
    featured = models.BooleanField(default=False, db_index=True)

    seo_title = models.CharField(max_length=255, blank=True, default='')
    seo_description = models.TextField(blank=True, default='')
    seo_keywords = models.JSONField(default=list, blank=True)

    published_at = models.DateTimeField(default=timezone.now, null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Opportunity'
        verbose_name_plural = 'Opportunities'
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['type', 'status', '-published_at']),
            models.Index(fields=['category', 'status', '-published_at']),
            models.Index(fields=['featured', 'status', '-published_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.company.name if self.company_id else 'No Company'}"

    def is_expired(self):
        if self.deadline and timezone.now() > self.deadline:
            return True
        return False

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-at-{self.company.name if self.company_id else 'jobs'}")
            slug = base_slug
            counter = 1
            while Opportunity.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
