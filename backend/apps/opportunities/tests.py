from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import User
from apps.companies.models import Company
from apps.categories.models import Category
from apps.opportunities.models import Opportunity
from apps.blog.models import BlogPost

class JobsOrbitAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.admin_user = User.objects.create_superuser(
            email='admin@test.com',
            password='testpassword123',
            name='Test Admin'
        )

        self.company = Company.objects.create(
            name='Tech Corp',
            slug='tech-corp',
            website='https://techcorp.com'
        )

        self.category = Category.objects.create(
            name='Engineering',
            slug='engineering'
        )

        self.opportunity = Opportunity.objects.create(
            title='Junior Engineer',
            slug='junior-engineer-tech-corp',
            type='job',
            company=self.company,
            category=self.category,
            description='Test description',
            status='published'
        )

        self.blog_post = BlogPost.objects.create(
            title='Interview Tips',
            slug='interview-tips',
            content='Test content',
            status='published',
            author=self.admin_user
        )

    def test_login(self):
        response = self.client.post('/api/v1/auth/login/', {
            'email': 'admin@test.com',
            'password': 'testpassword123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get('success'))
        self.assertIn('token', response.data)

    def test_list_opportunities(self):
        response = self.client.get('/api/v1/opportunities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_opportunity_by_slug(self):
        response = self.client.get('/api/v1/opportunities/junior-engineer-tech-corp/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Junior Engineer')

    def test_categories_with_counts(self):
        response = self.client.get('/api/v1/categories/with_counts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['count'], 1)

    def test_stats_endpoint(self):
        response = self.client.get('/api/v1/stats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['totalOpportunities'], 1)
        self.assertEqual(response.data['publishedOpportunities'], 1)
        self.assertEqual(response.data['totalCompanies'], 1)
        self.assertEqual(response.data['totalCategories'], 1)
        self.assertEqual(response.data['totalBlogPosts'], 1)

    def test_global_search(self):
        response = self.client.get('/api/v1/search/?q=Junior')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['opportunities']), 1)
