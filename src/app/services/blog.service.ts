import { Injectable, signal, computed } from '@angular/core';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category: BlogCategory;
  publishedAt: Date;
  updatedAt?: Date;
  readingTime: number;
  author: BlogAuthor;
  featured: boolean;
  published: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  analytics: {
    views: number;
    likes: number;
    shares: number;
  };
}

export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export type BlogSortBy = 'publishedAt' | 'views' | 'likes' | 'readingTime' | 'title';
export type BlogSortOrder = 'asc' | 'desc';

export interface BlogFilters {
  category?: string;
  tags?: string[];
  search?: string;
  featured?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly POSTS_KEY = 'blog-posts';
  private readonly VIEWS_KEY = 'blog-views';
  private readonly LIKES_KEY = 'blog-likes';

  // Signals for reactive state
  private _posts = signal<BlogPost[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);
  private _filters = signal<BlogFilters>({});
  private _sortBy = signal<BlogSortBy>('publishedAt');
  private _sortOrder = signal<BlogSortOrder>('desc');

  // Public readonly signals
  readonly posts = this._posts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();
  readonly sortOrder = this._sortOrder.asReadonly();

  // Computed signals
  readonly filteredPosts = computed(() => {
    const posts = this._posts();
    const filters = this._filters();
    const sortBy = this._sortBy();
    const sortOrder = this._sortOrder();

    let filtered = posts.filter(post => post.published);

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(post => post.category.slug === filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(post =>
        filters.tags!.some(tag => post.tags.includes(tag))
      );
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search) ||
        post.excerpt.toLowerCase().includes(search) ||
        post.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(post => post.featured === filters.featured);
    }

    if (filters.dateRange) {
      filtered = filtered.filter(post =>
        post.publishedAt >= filters.dateRange!.start &&
        post.publishedAt <= filters.dateRange!.end
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'publishedAt':
          aValue = a.publishedAt.getTime();
          bValue = b.publishedAt.getTime();
          break;
        case 'views':
          aValue = a.analytics.views;
          bValue = b.analytics.views;
          break;
        case 'likes':
          aValue = a.analytics.likes;
          bValue = b.analytics.likes;
          break;
        case 'readingTime':
          aValue = a.readingTime;
          bValue = b.readingTime;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  });

  readonly featuredPosts = computed(() =>
    this._posts().filter(post => post.featured && post.published).slice(0, 3)
  );

  readonly recentPosts = computed(() =>
    this._posts()
      .filter(post => post.published)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 5)
  );

  readonly categories = computed(() => {
    const posts = this._posts().filter(post => post.published);
    const categoryMap = new Map<string, { category: BlogCategory; count: number }>();

    posts.forEach(post => {
      const existing = categoryMap.get(post.category.id);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(post.category.id, { category: post.category, count: 1 });
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
  });

  readonly tags = computed(() => {
    const posts = this._posts().filter(post => post.published);
    const tagMap = new Map<string, number>();

    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({
        id: this.slugify(name),
        name,
        slug: this.slugify(name),
        count
      }))
      .sort((a, b) => b.count - a.count);
  });

  readonly totalPosts = computed(() =>
    this._posts().filter(post => post.published).length
  );

  constructor() {
    this.initializeMockData();
    this.loadAnalytics();
  }

  // Public API
  async loadPosts(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      // In a real app, this would be an HTTP request
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Data is already initialized in constructor
      this._loading.set(false);
    } catch (error) {
      this._error.set('Failed to load blog posts');
      this._loading.set(false);
    }
  }

  getPostBySlug(slug: string): BlogPost | null {
    return this._posts().find(post => post.slug === slug && post.published) || null;
  }

  getPostById(id: string): BlogPost | null {
    return this._posts().find(post => post.id === id) || null;
  }

  searchPosts(query: string): BlogPost[] {
    if (!query) return [];

    const search = query.toLowerCase();
    return this._posts()
      .filter(post => post.published)
      .filter(post =>
        post.title.toLowerCase().includes(search) ||
        post.excerpt.toLowerCase().includes(search) ||
        post.content.toLowerCase().includes(search) ||
        post.tags.some(tag => tag.toLowerCase().includes(search))
      );
  }

  getRelatedPosts(postId: string, limit: number = 3): BlogPost[] {
    const post = this.getPostById(postId);
    if (!post) return [];

    const otherPosts = this._posts()
      .filter(p => p.id !== postId && p.published);

    // Score posts based on shared tags and category
    const scored = otherPosts.map(p => {
      let score = 0;

      // Same category gets higher score
      if (p.category.id === post.category.id) {
        score += 10;
      }

      // Shared tags increase score
      const sharedTags = p.tags.filter(tag => post.tags.includes(tag));
      score += sharedTags.length * 5;

      return { post: p, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
  }

  // Filters and sorting
  setFilters(filters: Partial<BlogFilters>): void {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters(): void {
    this._filters.set({});
  }

  setSorting(sortBy: BlogSortBy, sortOrder: BlogSortOrder = 'desc'): void {
    this._sortBy.set(sortBy);
    this._sortOrder.set(sortOrder);
  }

  // Analytics
  recordView(postId: string): void {
    const views = this.getStoredViews();
    views[postId] = (views[postId] || 0) + 1;
    this.saveViews(views);

    // Update post analytics
    this._posts.update(posts =>
      posts.map(post =>
        post.id === postId
          ? { ...post, analytics: { ...post.analytics, views: views[postId] } }
          : post
      )
    );
  }

  toggleLike(postId: string): boolean {
    const likes = this.getStoredLikes();
    const isLiked = likes.includes(postId);

    if (isLiked) {
      const index = likes.indexOf(postId);
      likes.splice(index, 1);
    } else {
      likes.push(postId);
    }

    this.saveLikes(likes);

    // Update post analytics
    this._posts.update(posts =>
      posts.map(post => {
        if (post.id === postId) {
          const likeCount = isLiked
            ? post.analytics.likes - 1
            : post.analytics.likes + 1;

          return {
            ...post,
            analytics: { ...post.analytics, likes: Math.max(0, likeCount) }
          };
        }
        return post;
      })
    );

    return !isLiked;
  }

  isPostLiked(postId: string): boolean {
    const likes = this.getStoredLikes();
    return likes.includes(postId);
  }

  getReadingProgress(postId: string): number {
    const stored = localStorage.getItem(`blog-progress-${postId}`);
    return stored ? parseFloat(stored) : 0;
  }

  saveReadingProgress(postId: string, progress: number): void {
    localStorage.setItem(`blog-progress-${postId}`, progress.toString());
  }

  // Utility methods
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private getStoredViews(): Record<string, number> {
    try {
      const stored = localStorage.getItem(this.VIEWS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private saveViews(views: Record<string, number>): void {
    try {
      localStorage.setItem(this.VIEWS_KEY, JSON.stringify(views));
    } catch (error) {
      console.warn('Failed to save views:', error);
    }
  }

  private getStoredLikes(): string[] {
    try {
      const stored = localStorage.getItem(this.LIKES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveLikes(likes: string[]): void {
    try {
      localStorage.setItem(this.LIKES_KEY, JSON.stringify(likes));
    } catch (error) {
      console.warn('Failed to save likes:', error);
    }
  }

  private loadAnalytics(): void {
    const views = this.getStoredViews();
    const likes = this.getStoredLikes();

    this._posts.update(posts =>
      posts.map(post => ({
        ...post,
        analytics: {
          ...post.analytics,
          views: views[post.id] || post.analytics.views,
          likes: likes.includes(post.id) ? post.analytics.likes + 1 : post.analytics.likes
        }
      }))
    );
  }

  // Mock data initialization
  private initializeMockData(): void {
    const mockAuthor: BlogAuthor = {
      name: 'Ravin Bhakta',
      avatar: 'assets/avatar.jpg',
      bio: 'Full-Stack Engineer with expertise in Angular, React, Java Spring, and cloud technologies.',
      social: {
        twitter: '@ravinbhakta',
        linkedin: 'ravin-rohitbhai-bhakta',
        github: 'bhaktaravin'
      }
    };

    const categories: BlogCategory[] = [
      {
        id: 'frontend',
        name: 'Frontend Development',
        slug: 'frontend',
        description: 'Modern frontend technologies and best practices',
        color: '#3b82f6',
        icon: '⚛️'
      },
      {
        id: 'backend',
        name: 'Backend Development',
        slug: 'backend',
        description: 'Server-side technologies and architecture',
        color: '#10b981',
        icon: '🔧'
      },
      {
        id: 'cloud',
        name: 'Cloud & DevOps',
        slug: 'cloud',
        description: 'Cloud platforms and deployment strategies',
        color: '#f59e0b',
        icon: '☁️'
      },
      {
        id: 'career',
        name: 'Career & Growth',
        slug: 'career',
        description: 'Professional development and career insights',
        color: '#8b5cf6',
        icon: '📈'
      }
    ];

    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Building Scalable Angular Applications with Standalone Components',
        slug: 'scalable-angular-standalone-components',
        excerpt: 'Learn how to leverage Angular\'s standalone components to build more maintainable and performant applications.',
        content: `
# Building Scalable Angular Applications with Standalone Components

Angular's standalone components represent a paradigm shift in how we structure Angular applications. This comprehensive guide will walk you through implementing standalone components for better scalability and maintainability.

## What are Standalone Components?

Standalone components are a feature introduced in Angular 14 that allows components to exist independently without being declared in NgModules. This approach simplifies the component architecture and reduces boilerplate code.

## Benefits of Standalone Components

1. **Simplified Architecture**: No need for feature modules
2. **Better Tree Shaking**: Improved bundle optimization
3. **Lazy Loading**: Components can be lazy-loaded individually
4. **Testing**: Easier unit testing without module setup

## Implementation Guide

### Basic Standalone Component

\`\`\`typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="user-profile">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  \`,
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  user = { name: 'John Doe', email: 'john@example.com' };
}
\`\`\`

### Lazy Loading Standalone Components

\`\`\`typescript
// routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./user-profile/user-profile.component')
      .then(c => c.UserProfileComponent)
  }
];
\`\`\`

## Best Practices

1. **Keep Components Focused**: Each standalone component should have a single responsibility
2. **Optimize Imports**: Only import what you need to keep bundles small
3. **Use Dependency Injection**: Leverage Angular's DI system for better testability
4. **Consider Performance**: Use OnPush change detection strategy when appropriate

## Conclusion

Standalone components offer a cleaner, more maintainable approach to Angular development. By following these patterns, you can build applications that are easier to understand, test, and maintain.
        `,
        coverImage: 'assets/blog/angular-standalone.jpg',
        tags: ['Angular', 'Standalone Components', 'Architecture', 'Performance'],
        category: categories[0],
        publishedAt: new Date('2024-01-15'),
        readingTime: 8,
        author: mockAuthor,
        featured: true,
        published: true,
        seo: {
          metaTitle: 'Angular Standalone Components: Complete Guide',
          metaDescription: 'Learn how to build scalable Angular applications using standalone components. Complete guide with examples and best practices.',
          keywords: ['Angular', 'Standalone Components', 'Frontend', 'Architecture']
        },
        analytics: {
          views: 1250,
          likes: 89,
          shares: 23
        }
      },
      {
        id: '2',
        title: 'Optimizing Java Spring Boot Performance for Enterprise Applications',
        slug: 'spring-boot-performance-optimization',
        excerpt: 'Deep dive into performance optimization techniques for Spring Boot applications in enterprise environments.',
        content: `
# Optimizing Java Spring Boot Performance for Enterprise Applications

Performance optimization is crucial for enterprise Spring Boot applications. This guide covers advanced techniques to maximize your application's efficiency and scalability.

## Database Optimization

### Connection Pooling
Configure HikariCP for optimal database connections:

\`\`\`yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      max-lifetime: 600000
\`\`\`

### Query Optimization
Use JPA efficiently with proper indexing and query optimization.

## Caching Strategies

Implement multi-level caching for better performance:

\`\`\`java
@Service
@CacheConfig(cacheNames = "users")
public class UserService {

    @Cacheable(key = "#userId")
    public User findById(Long userId) {
        return userRepository.findById(userId);
    }
}
\`\`\`

## JVM Tuning

Configure JVM parameters for optimal performance:
- Heap sizing
- Garbage collection tuning
- Memory management

## Monitoring and Profiling

Use tools like Micrometer and Actuator for comprehensive monitoring.

## Conclusion

Performance optimization is an ongoing process that requires careful monitoring and continuous improvement.
        `,
        coverImage: 'assets/blog/spring-boot-performance.jpg',
        tags: ['Java', 'Spring Boot', 'Performance', 'Enterprise'],
        category: categories[1],
        publishedAt: new Date('2024-01-10'),
        readingTime: 12,
        author: mockAuthor,
        featured: true,
        published: true,
        seo: {
          metaTitle: 'Spring Boot Performance Optimization Guide',
          metaDescription: 'Complete guide to optimizing Spring Boot applications for enterprise use. Learn advanced techniques and best practices.',
          keywords: ['Spring Boot', 'Java', 'Performance', 'Enterprise']
        },
        analytics: {
          views: 980,
          likes: 67,
          shares: 18
        }
      },
      {
        id: '3',
        title: 'AWS Deployment Strategies for Modern Web Applications',
        slug: 'aws-deployment-strategies',
        excerpt: 'Comprehensive guide to deploying web applications on AWS using modern practices and tools.',
        content: `
# AWS Deployment Strategies for Modern Web Applications

Deploying applications to AWS requires careful planning and the right tools. This guide covers modern deployment strategies for scalable web applications.

## Container-Based Deployments

### Using Amazon ECS
Deploy containerized applications with ECS for better scalability and management.

### Kubernetes with EKS
For complex applications requiring orchestration, EKS provides managed Kubernetes.

## Serverless Deployments

### AWS Lambda
Perfect for microservices and event-driven architectures:

\`\`\`javascript
exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
\`\`\`

## CI/CD Pipelines

Implement automated deployments with AWS CodePipeline and CodeBuild.

## Monitoring and Logging

Use CloudWatch and X-Ray for comprehensive application monitoring.

## Best Practices

1. Infrastructure as Code with CloudFormation
2. Blue/Green deployments for zero-downtime
3. Auto-scaling for handling traffic spikes
4. Security best practices with IAM

## Conclusion

AWS provides powerful tools for modern application deployment. Choose the right strategy based on your application's needs.
        `,
        coverImage: 'assets/blog/aws-deployment.jpg',
        tags: ['AWS', 'Deployment', 'Cloud', 'DevOps'],
        category: categories[2],
        publishedAt: new Date('2024-01-05'),
        readingTime: 10,
        author: mockAuthor,
        featured: true,
        published: true,
        seo: {
          metaTitle: 'AWS Deployment Strategies for Web Apps',
          metaDescription: 'Learn modern deployment strategies for AWS. Complete guide covering containers, serverless, and CI/CD best practices.',
          keywords: ['AWS', 'Deployment', 'Cloud', 'DevOps', 'CI/CD']
        },
        analytics: {
          views: 756,
          likes: 54,
          shares: 12
        }
      },
      {
        id: '4',
        title: 'Career Growth Tips for Software Engineers',
        slug: 'career-growth-software-engineers',
        excerpt: 'Practical advice for advancing your career as a software engineer in today\'s competitive tech landscape.',
        content: `
# Career Growth Tips for Software Engineers

Growing your career as a software engineer requires more than just technical skills. Here's practical advice for advancing in today's tech landscape.

## Technical Skills Development

### Stay Current with Technology
- Follow industry trends and emerging technologies
- Contribute to open-source projects
- Build side projects to experiment with new tools

### Specialize vs. Generalize
Find the right balance between deep specialization and broad knowledge.

## Soft Skills Matter

### Communication
Learn to explain technical concepts to non-technical stakeholders.

### Leadership
Take initiative on projects and mentor junior developers.

## Building Your Network

### Industry Events
Attend conferences, meetups, and tech talks.

### Online Presence
Maintain a professional online presence through LinkedIn, GitHub, and technical blogs.

## Career Planning

### Set Clear Goals
Define short-term and long-term career objectives.

### Seek Feedback
Regular feedback helps identify areas for improvement.

## Continuous Learning

The tech industry evolves rapidly. Embrace lifelong learning to stay relevant.

## Conclusion

Career growth is a journey that requires intentional effort in both technical and soft skills development.
        `,
        coverImage: 'assets/blog/career-growth.jpg',
        tags: ['Career', 'Software Engineering', 'Professional Development', 'Leadership'],
        category: categories[3],
        publishedAt: new Date('2023-12-28'),
        readingTime: 6,
        author: mockAuthor,
        featured: false,
        published: true,
        seo: {
          metaTitle: 'Software Engineer Career Growth Guide',
          metaDescription: 'Practical career advice for software engineers. Learn how to advance your career with technical and soft skills development.',
          keywords: ['Career Growth', 'Software Engineering', 'Professional Development']
        },
        analytics: {
          views: 432,
          likes: 38,
          shares: 9
        }
      },
      {
        id: '5',
        title: 'React Performance Optimization: Advanced Techniques',
        slug: 'react-performance-optimization',
        excerpt: 'Master advanced React performance optimization techniques for building fast and efficient applications.',
        content: `
# React Performance Optimization: Advanced Techniques

Building performant React applications requires understanding advanced optimization techniques. This guide covers the most effective strategies.

## Rendering Optimizations

### React.memo
Prevent unnecessary re-renders with React.memo:

\`\`\`jsx
const UserCard = React.memo(({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
\`\`\`

### useMemo and useCallback
Optimize expensive calculations and prevent function recreations.

## Code Splitting

### Dynamic Imports
Split your code for better loading performance:

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));
\`\`\`

## State Management

### Context Optimization
Avoid performance pitfalls with React Context.

### State Colocation
Keep state as close to where it's needed as possible.

## Bundle Optimization

Use tools like webpack-bundle-analyzer to identify and eliminate dead code.

## Performance Monitoring

Implement monitoring to track real-world performance metrics.

## Conclusion

Performance optimization is an ongoing process. Use these techniques judiciously based on your application's specific needs.
        `,
        coverImage: 'assets/blog/react-performance.jpg',
        tags: ['React', 'Performance', 'Optimization', 'Frontend'],
        category: categories[0],
        publishedAt: new Date('2023-12-20'),
        readingTime: 9,
        author: mockAuthor,
        featured: false,
        published: true,
        seo: {
          metaTitle: 'React Performance Optimization Guide',
          metaDescription: 'Learn advanced React performance optimization techniques. Complete guide with code examples and best practices.',
          keywords: ['React', 'Performance', 'Optimization', 'Frontend Development']
        },
        analytics: {
          views: 623,
          likes: 45,
          shares: 15
        }
      }
    ];

    this._posts.set(mockPosts);
  }
}
