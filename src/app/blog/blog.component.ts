import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import {
  BlogService,
  BlogPost,
  BlogFilters,
  BlogSortBy,
} from "../services/blog.service";
import { AnalyticsService } from "../services/analytics.service";

@Component({
  selector: "app-blog",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="blog-section section">
      <div class="container">
        <!-- Hero Section -->
        <div class="blog-hero">
          <h1 class="blog-title">Technical Blog</h1>
          <p class="blog-subtitle">
            Insights on modern web development, cloud technologies, and software
            engineering best practices.
          </p>
          <div class="blog-stats">
            <div class="stat">
              <span class="stat-value">{{ blogService.totalPosts() }}</span>
              <span class="stat-label">Articles</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ getTotalViews() }}</span>
              <span class="stat-label">Views</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{
                blogService.categories().length
              }}</span>
              <span class="stat-label">Categories</span>
            </div>
          </div>

          <div class="blog-cta">
            <button
              class="btn btn-primary"
              type="button"
              (click)="openRailsBlog()"
              [attr.aria-label]="'View full blog on GitHub'"
            >
              View Full Blog
            </button>
            <a
              class="btn btn-outline"
              [href]="railsBlogUrl"
              target="_blank"
              rel="noopener"
              [attr.aria-label]="'Open rails_blog repository'"
            >
              rails_blog Repo
            </a>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="blog-controls" *ngIf="!previewMode">
          <div class="search-container">
            <div class="search-input-wrapper">
              <input
                type="text"
                class="search-input"
                placeholder="Search articles..."
                [(ngModel)]="searchQuery"
                (input)="onSearchChange($event)"
                [attr.aria-label]="'Search blog posts'"
              />
              <button
                class="search-btn"
                type="button"
                [attr.aria-label]="'Search'"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="filter-controls">
            <!-- Category Filter -->
            <div class="filter-group">
              <label class="filter-label">Category</label>
              <select
                class="filter-select"
                [(ngModel)]="selectedCategory"
                (change)="onCategoryChange()"
              >
                <option value="">All Categories</option>
                <option
                  *ngFor="let category of blogService.categories()"
                  [value]="category.category.slug"
                >
                  {{ category.category.name }} ({{ category.count }})
                </option>
              </select>
            </div>

            <!-- Sort Options -->
            <div class="filter-group">
              <label class="filter-label">Sort by</label>
              <select
                class="filter-select"
                [(ngModel)]="selectedSort"
                (change)="onSortChange()"
              >
                <option value="publishedAt">Latest</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="readingTime">Reading Time</option>
                <option value="title">Title</option>
              </select>
            </div>

            <!-- Featured Filter -->
            <button
              class="featured-toggle"
              [class.active]="showFeaturedOnly()"
              (click)="toggleFeaturedFilter()"
              type="button"
            >
              <span class="toggle-icon">⭐</span>
              <span class="toggle-label">Featured Only</span>
            </button>
          </div>
        </div>

        <!-- Featured Posts (when no filters applied) -->
        <div class="featured-section" *ngIf="shouldShowFeatured()">
          <h2 class="section-title">
            <span class="title-icon">✨</span>
            Featured Articles
          </h2>
          <div class="featured-grid">
            <article
              *ngFor="
                let post of blogService.featuredPosts();
                trackBy: trackPost
              "
              class="featured-post card"
              (click)="openPost(post)"
            >
              <div class="post-image" *ngIf="post.coverImage">
                <img
                  [src]="post.coverImage"
                  [alt]="post.title"
                  loading="lazy"
                  (error)="handleImageError($event)"
                />
                <div class="post-overlay">
                  <span class="read-time">{{ post.readingTime }} min read</span>
                </div>
              </div>
              <div class="post-content">
                <div class="post-meta">
                  <span
                    class="post-category"
                    [style.background]="post.category.color + '20'"
                    [style.color]="post.category.color"
                  >
                    <span
                      class="category-icon"
                      [innerHTML]="post.category.icon"
                    ></span>
                    {{ post.category.name }}
                  </span>
                  <time
                    class="post-date"
                    [attr.datetime]="post.publishedAt.toISOString()"
                  >
                    {{ formatDate(post.publishedAt) }}
                  </time>
                </div>
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-excerpt">{{ post.excerpt }}</p>
                <div class="post-tags">
                  <span
                    *ngFor="let tag of post.tags.slice(0, 3)"
                    class="post-tag"
                    (click)="filterByTag(tag, $event)"
                  >
                    #{{ tag }}
                  </span>
                </div>
                <div class="post-stats">
                  <div class="stat-item">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-text">{{
                      formatNumber(post.analytics.views)
                    }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-text">{{
                      formatNumber(post.analytics.likes)
                    }}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- All Posts Grid -->
        <div class="posts-section">
          <div class="posts-header">
            <h2 class="section-title">
              {{ getPostsTitle() }}
              <span class="post-count"
                >({{ getDisplayedCount() }})</span
              >
            </h2>

            <!-- Active Filters -->
            <div class="active-filters" *ngIf="hasActiveFilters() && !previewMode">
              <span class="filter-label">Active filters:</span>
              <button
                *ngIf="searchQuery"
                class="filter-chip"
                (click)="clearSearch()"
                type="button"
              >
                Search: "{{ searchQuery }}"
                <span class="chip-remove">×</span>
              </button>
              <button
                *ngIf="selectedCategory"
                class="filter-chip"
                (click)="clearCategoryFilter()"
                type="button"
              >
                {{ getCategoryName(selectedCategory) }}
                <span class="chip-remove">×</span>
              </button>
              <button
                *ngIf="showFeaturedOnly()"
                class="filter-chip"
                (click)="clearFeaturedFilter()"
                type="button"
              >
                Featured Only
                <span class="chip-remove">×</span>
              </button>
              <button
                class="clear-all-btn"
                (click)="clearAllFilters()"
                type="button"
              >
                Clear All
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div class="loading-state" *ngIf="blogService.loading()">
            <div class="skeleton-grid">
              <div class="skeleton-post" *ngFor="let i of [1, 2, 3, 4, 5, 6]">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-content">
                  <div class="skeleton skeleton-text-sm"></div>
                  <div class="skeleton skeleton-text-lg"></div>
                  <div class="skeleton skeleton-text-md"></div>
                  <div class="skeleton skeleton-tags"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div class="error-state" *ngIf="blogService.error()">
            <div class="error-content">
              <span class="error-icon">😕</span>
              <h3 class="error-title">Something went wrong</h3>
              <p class="error-message">{{ blogService.error() }}</p>
              <button
                class="btn btn-primary"
                (click)="retryLoading()"
                type="button"
              >
                Try Again
              </button>
            </div>
          </div>

          <!-- Posts Grid -->
          <div
            class="posts-grid"
            *ngIf="!blogService.loading() && !blogService.error()"
          >
            <article
              *ngFor="
                let post of getDisplayedPosts();
                trackBy: trackPost;
                let i = index
              "
              class="post-card card"
              [class.featured]="post.featured"
              (click)="openPost(post)"
              [style.animation-delay]="i * 100 + 'ms'"
            >
              <div class="post-image" *ngIf="post.coverImage">
                <img
                  [src]="post.coverImage"
                  [alt]="post.title"
                  loading="lazy"
                  (error)="handleImageError($event)"
                />
                <div class="post-overlay">
                  <span class="read-time">{{ post.readingTime }} min read</span>
                  <button
                    class="like-btn"
                    [class.liked]="isPostLiked(post.id)"
                    (click)="toggleLike(post.id, $event)"
                    [attr.aria-label]="
                      isPostLiked(post.id) ? 'Unlike post' : 'Like post'
                    "
                    type="button"
                  >
                    <span class="like-icon">{{
                      isPostLiked(post.id) ? "❤️" : "🤍"
                    }}</span>
                  </button>
                </div>
              </div>
              <div class="post-content">
                <div class="post-meta">
                  <span
                    class="post-category"
                    [style.background]="post.category.color + '20'"
                    [style.color]="post.category.color"
                  >
                    <span
                      class="category-icon"
                      [innerHTML]="post.category.icon"
                    ></span>
                    {{ post.category.name }}
                  </span>
                  <time
                    class="post-date"
                    [attr.datetime]="post.publishedAt.toISOString()"
                  >
                    {{ formatDate(post.publishedAt) }}
                  </time>
                </div>
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-excerpt">{{ post.excerpt }}</p>
                <div class="post-tags">
                  <span
                    *ngFor="let tag of post.tags.slice(0, 3)"
                    class="post-tag"
                    (click)="filterByTag(tag, $event)"
                  >
                    #{{ tag }}
                  </span>
                  <span *ngIf="post.tags.length > 3" class="post-tag-more">
                    +{{ post.tags.length - 3 }} more
                  </span>
                </div>
                <div class="post-footer">
                  <div class="post-stats">
                    <div class="stat-item">
                      <span class="stat-icon">👁️</span>
                      <span class="stat-text">{{
                        formatNumber(post.analytics.views)
                      }}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-icon">❤️</span>
                      <span class="stat-text">{{
                        formatNumber(post.analytics.likes)
                      }}</span>
                    </div>
                  </div>
                  <button class="read-more-btn" type="button">
                    Read More
                    <span class="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Empty State -->
          <div
            class="empty-state"
            *ngIf="
              !blogService.loading() &&
              !blogService.error() &&
              getDisplayedPosts().length === 0
            "
          >
            <div class="empty-content">
              <span class="empty-icon">📝</span>
              <h3 class="empty-title">No articles found</h3>
              <p class="empty-message">
                Try adjusting your filters or search terms to find what you're
                looking for.
              </p>
              <button
                class="btn btn-outline"
                (click)="clearAllFilters()"
                type="button"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div class="blog-preview-cta" *ngIf="previewMode">
            <p class="preview-note">
              Want the full archive? Visit the Rails blog for all posts.
            </p>
            <button
              class="btn btn-primary"
              type="button"
              (click)="openRailsBlog()"
              [attr.aria-label]="'View all posts on the Rails blog'"
            >
              View All Posts
            </button>
          </div>
        </div>

        <!-- Newsletter Signup -->
        <div class="newsletter-section" *ngIf="!hasActiveFilters()">
          <div class="newsletter-content">
            <h3 class="newsletter-title">Stay Updated</h3>
            <p class="newsletter-description">
              Get notified when I publish new articles about web development and
              technology.
            </p>
            <form
              class="newsletter-form"
              (ngSubmit)="subscribeToNewsletter($event)"
            >
              <div class="form-group">
                <input
                  type="email"
                  class="form-input"
                  placeholder="Enter your email"
                  [(ngModel)]="newsletterEmail"
                  name="email"
                  required
                  [attr.aria-label]="'Email address for newsletter'"
                />
                <button
                  class="btn btn-primary"
                  type="submit"
                  [disabled]="!newsletterEmail"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .blog-section {
        min-height: 100vh;
        padding-top: 2rem;
      }

      /* Hero Section */
      .blog-hero {
        text-align: center;
        margin-bottom: 4rem;
        padding: 3rem 0;
        background: var(--gradient-hero);
        border-radius: 2rem;
        color: white;
        position: relative;
        overflow: hidden;
      }

      .blog-hero::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--color-hero-overlay);
        backdrop-filter: blur(1px);
      }

      .blog-hero > * {
        position: relative;
        z-index: 2;
      }

      .blog-title {
        font-size: var(--font-size-5xl);
        font-weight: var(--font-weight-extrabold);
        margin-bottom: 1rem;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }

      .blog-subtitle {
        font-size: var(--font-size-xl);
        margin-bottom: 2rem;
        opacity: 0.9;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .blog-stats {
        display: flex;
        justify-content: center;
        gap: 3rem;
        margin-top: 2rem;
      }

      .blog-cta {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
      }

      .stat {
        text-align: center;
      }

      .stat-value {
        display: block;
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: white;
      }

      .stat-label {
        font-size: var(--font-size-sm);
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .blog-preview-cta {
        text-align: center;
        margin-top: 2rem;
      }

      .preview-note {
        color: var(--color-text-secondary);
        margin-bottom: 1rem;
      }

      /* Controls Section */
      .blog-controls {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-bottom: 3rem;
        padding: 2rem;
        background: var(--color-surface);
        border-radius: 1rem;
        border: 1px solid var(--color-border);
      }

      .search-container {
        flex: 1;
      }

      .search-input-wrapper {
        position: relative;
        max-width: 400px;
        width: 100%;
      }

      .search-input {
        width: 100%;
        padding: 0.75rem 3rem 0.75rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        background: var(--color-background);
        color: var(--color-text-primary);
        font-size: var(--font-size-base);
        transition: var(--transition-fast);
      }

      .search-input:focus {
        outline: none;
        border-color: var(--color-primary-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .search-btn {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--color-text-tertiary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: var(--transition-fast);
      }

      .search-btn:hover {
        color: var(--color-primary-600);
      }

      .filter-controls {
        display: flex;
        gap: 1.5rem;
        align-items: flex-end;
        flex-wrap: wrap;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 150px;
      }

      .filter-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-secondary);
      }

      .filter-select {
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        background: var(--color-background);
        color: var(--color-text-primary);
        font-size: var(--font-size-sm);
        cursor: pointer;
        transition: var(--transition-fast);
      }

      .filter-select:focus {
        outline: none;
        border-color: var(--color-primary-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .featured-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: var(--transition-fast);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
      }

      .featured-toggle:hover,
      .featured-toggle.active {
        background: var(--color-primary-50);
        border-color: var(--color-primary-500);
        color: var(--color-primary-700);
      }

      [data-theme="dark"] .featured-toggle:hover,
      [data-theme="dark"] .featured-toggle.active {
        background: rgba(59, 130, 246, 0.1);
        color: var(--color-primary-300);
      }

      /* Featured Section */
      .featured-section {
        margin-bottom: 4rem;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: 2rem;
        color: var(--color-text-primary);
      }

      .title-icon {
        font-size: 1.5rem;
      }

      .featured-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
      }

      .featured-post {
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
      }

      .featured-post:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
      }

      /* Posts Section */
      .posts-section {
        margin-bottom: 4rem;
      }

      .posts-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .post-count {
        color: var(--color-text-tertiary);
        font-weight: var(--font-weight-normal);
      }

      .active-filters {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .filter-chip {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        background: var(--color-primary-100);
        color: var(--color-primary-700);
        border: 1px solid var(--color-primary-200);
        border-radius: 1rem;
        font-size: var(--font-size-xs);
        cursor: pointer;
        transition: var(--transition-fast);
      }

      .filter-chip:hover {
        background: var(--color-primary-200);
      }

      [data-theme="dark"] .filter-chip {
        background: rgba(59, 130, 246, 0.2);
        color: var(--color-primary-300);
        border-color: rgba(59, 130, 246, 0.3);
      }

      .chip-remove {
        font-weight: bold;
        margin-left: 0.25rem;
      }

      .clear-all-btn {
        padding: 0.25rem 0.75rem;
        background: var(--color-error);
        color: white;
        border: none;
        border-radius: 1rem;
        font-size: var(--font-size-xs);
        cursor: pointer;
        transition: var(--transition-fast);
      }

      .clear-all-btn:hover {
        background: #dc2626;
      }

      /* Posts Grid */
      .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
      }

      .post-card {
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
      }

      .post-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .post-card.featured {
        border: 2px solid var(--color-primary-200);
        position: relative;
      }

      .post-card.featured::before {
        content: "✨ Featured";
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--color-primary-500);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        z-index: 2;
      }

      .post-image {
        position: relative;
        aspect-ratio: 16/9;
        overflow: hidden;
        background: var(--color-surface-secondary);
      }

      .post-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .post-card:hover .post-image img {
        transform: scale(1.05);
      }

      .post-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.3) 0%,
          transparent 50%,
          rgba(0, 0, 0, 0.7) 100%
        );
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .post-card:hover .post-overlay {
        opacity: 1;
      }

      .read-time {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
      }

      .like-btn {
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .like-btn:hover {
        background: white;
        transform: scale(1.1);
      }

      .like-btn.liked {
        background: #fef2f2;
        border: 2px solid #ef4444;
      }

      .post-content {
        padding: 1.5rem;
      }

      .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;
      }

      .post-category {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .category-icon {
        font-size: 1rem;
      }

      .post-date {
        color: var(--color-text-tertiary);
        font-size: var(--font-size-sm);
      }

      .post-title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: 0.75rem;
        color: var(--color-text-primary);
        line-height: var(--line-height-tight);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .post-excerpt {
        color: var(--color-text-secondary);
        line-height: var(--line-height-relaxed);
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .post-tag {
        background: var(--color-surface-secondary);
        color: var(--color-text-secondary);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: var(--font-size-xs);
        cursor: pointer;
        transition: var(--transition-fast);
      }

      .post-tag:hover {
        background: var(--color-primary-100);
        color: var(--color-primary-700);
      }

      [data-theme="dark"] .post-tag:hover {
        background: rgba(59, 130, 246, 0.2);
        color: var(--color-primary-300);
      }

      .post-tag-more {
        color: var(--color-text-tertiary);
        font-size: var(--font-size-xs);
        font-style: italic;
      }

      .post-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
      }

      .post-stats {
        display: flex;
        gap: 1rem;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--color-text-tertiary);
        font-size: var(--font-size-sm);
      }

      .stat-icon {
        font-size: 1rem;
      }

      .read-more-btn {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--color-primary-600);
        background: none;
        border: none;
        cursor: pointer;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        transition: var(--transition-fast);
      }

      .read-more-btn:hover {
        color: var(--color-primary-700);
      }

      .btn-arrow {
        transition: transform 0.2s ease;
      }

      .read-more-btn:hover .btn-arrow {
        transform: translateX(2px);
      }

      /* Loading States */
      .loading-state {
        margin: 2rem 0;
      }

      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
      }

      .skeleton-post {
        background: var(--color-surface);
        border-radius: 1rem;
        overflow: hidden;
        padding: 0;
      }

      .skeleton {
        background: linear-gradient(
          90deg,
          var(--color-surface) 25%,
          var(--color-surface-secondary) 50%,
          var(--color-surface) 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }

      .skeleton-image {
        height: 200px;
        width: 100%;
      }

      .skeleton-content {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .skeleton-text-sm {
        height: 1rem;
        width: 60%;
        border-radius: 0.25rem;
      }

      .skeleton-text-lg {
        height: 1.5rem;
        width: 90%;
        border-radius: 0.25rem;
      }

      .skeleton-text-md {
        height: 1rem;
        width: 100%;
        border-radius: 0.25rem;
      }

      .skeleton-tags {
        height: 1.5rem;
        width: 40%;
        border-radius: 0.25rem;
      }

      /* Error and Empty States */
      .error-state,
      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      .error-content,
      .empty-content {
        max-width: 400px;
        margin: 0 auto;
      }

      .error-icon,
      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        display: block;
      }

      .error-title,
      .empty-title {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: 1rem;
        color: var(--color-text-primary);
      }

      .error-message,
      .empty-message {
        color: var(--color-text-secondary);
        margin-bottom: 2rem;
      }

      /* Newsletter Section */
      .newsletter-section {
        background: var(--gradient-primary);
        border-radius: 2rem;
        padding: 3rem 2rem;
        text-align: center;
        color: white;
        margin-top: 3rem;
      }

      .newsletter-title {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: 1rem;
      }

      .newsletter-description {
        font-size: var(--font-size-lg);
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .newsletter-form .form-group {
        display: flex;
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
      }

      .newsletter-form .form-input {
        flex: 1;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
      }

      .newsletter-form .form-input::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }

      .newsletter-form .btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        backdrop-filter: blur(10px);
      }

      .newsletter-form .btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .blog-hero {
          padding: 2rem 1rem;
          margin-bottom: 2rem;
        }

        .blog-title {
          font-size: var(--font-size-3xl);
        }

        .blog-subtitle {
          font-size: var(--font-size-lg);
        }

        .blog-stats {
          gap: 1.5rem;
        }

        .blog-controls {
          padding: 1rem;
        }

        .filter-controls {
          flex-direction: column;
          align-items: stretch;
        }

        .filter-group {
          min-width: auto;
        }

        .featured-grid,
        .posts-grid,
        .skeleton-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .posts-header {
          flex-direction: column;
          align-items: stretch;
        }

        .newsletter-form .form-group {
          flex-direction: column;
        }
      }

      @media (max-width: 480px) {
        .post-content {
          padding: 1rem;
        }

        .blog-controls {
          margin-bottom: 2rem;
        }

        .search-input-wrapper {
          max-width: none;
        }
      }
    `,
  ],
})
export class BlogComponent implements OnInit {
  public blogService = inject(BlogService);
  private analytics = inject(AnalyticsService);
  private router = inject(Router);

  // Component state
  searchQuery = "";
  selectedCategory = "";
  selectedSort: BlogSortBy = "publishedAt";
  newsletterEmail = "";

  // Preview mode (show top posts only)
  previewMode = true;
  previewLimit = 3;
  railsBlogUrl = "https://github.com/bhaktaravin/rails_blog";

  private _showFeaturedOnly = signal(false);
  readonly showFeaturedOnly = this._showFeaturedOnly.asReadonly();

  // Computed properties
  readonly likedPosts = computed(() => {
    const liked = new Set<string>();
    this.blogService.posts().forEach((post) => {
      if (this.blogService.isPostLiked(post.id)) {
        liked.add(post.id);
      }
    });
    return liked;
  });

  ngOnInit(): void {
    this.blogService.loadPosts();
    this.analytics.trackPageView("/blog", "Blog - Technical Articles");
  }

  // Event handlers
  onSearchChange(event: any): void {
    const query = event.target.value;
    this.blogService.setFilters({ search: query });

    if (query) {
      this.analytics.trackEvent({
        name: "blog_search",
        category: "Blog",
        action: "search",
        label: query,
      });
    }
  }

  onCategoryChange(): void {
    this.blogService.setFilters({
      category: this.selectedCategory || undefined,
    });

    if (this.selectedCategory) {
      this.analytics.trackEvent({
        name: "blog_filter_category",
        category: "Blog",
        action: "filter",
        label: this.selectedCategory,
      });
    }
  }

  onSortChange(): void {
    this.blogService.setSorting(this.selectedSort);

    this.analytics.trackEvent({
      name: "blog_sort",
      category: "Blog",
      action: "sort",
      label: this.selectedSort,
    });
  }

  toggleFeaturedFilter(): void {
    const showFeatured = !this._showFeaturedOnly();
    this._showFeaturedOnly.set(showFeatured);

    this.blogService.setFilters({
      featured: showFeatured || undefined,
    });

    this.analytics.trackEvent({
      name: "blog_filter_featured",
      category: "Blog",
      action: "filter",
      label: showFeatured ? "show_featured" : "show_all",
    });
  }

  filterByTag(tag: string, event: Event): void {
    event.stopPropagation();

    this.searchQuery = tag;
    this.blogService.setFilters({ search: tag });

    this.analytics.trackEvent({
      name: "blog_filter_tag",
      category: "Blog",
      action: "filter",
      label: tag,
    });
  }

  openPost(post: BlogPost): void {
    this.blogService.recordView(post.id);

    this.analytics.trackEvent({
      name: "blog_post_click",
      category: "Blog",
      action: "click",
      label: post.slug,
      customParameters: {
        postId: post.id,
        postTitle: post.title,
        category: post.category.slug,
      },
    });

    // Open Rails blog (full content hosted externally)
    window.open(this.railsBlogUrl, "_blank", "noopener");
  }

  openRailsBlog(): void {
    this.analytics.trackEvent({
      name: "blog_open_full_blog",
      category: "Blog",
      action: "click",
      label: "rails_blog",
    });

    window.open(this.railsBlogUrl, "_blank", "noopener");
  }

  toggleLike(postId: string, event: Event): void {
    event.stopPropagation();

    const wasLiked = this.blogService.isPostLiked(postId);
    const isNowLiked = this.blogService.toggleLike(postId);

    this.analytics.trackEvent({
      name: "blog_post_like",
      category: "Blog",
      action: isNowLiked ? "like" : "unlike",
      label: postId,
    });
  }

  isPostLiked(postId: string): boolean {
    return this.blogService.isPostLiked(postId);
  }

  subscribeToNewsletter(event: Event): void {
    event.preventDefault();

    if (!this.newsletterEmail) return;

    this.analytics.trackEvent({
      name: "newsletter_subscribe",
      category: "Blog",
      action: "subscribe",
      label: "blog_page",
    });

    // In a real app, this would make an API call
    alert(`Thank you for subscribing with: ${this.newsletterEmail}`);
    this.newsletterEmail = "";
  }

  // Filter management
  clearSearch(): void {
    this.searchQuery = "";
    this.blogService.setFilters({ search: undefined });
  }

  clearCategoryFilter(): void {
    this.selectedCategory = "";
    this.blogService.setFilters({ category: undefined });
  }

  clearFeaturedFilter(): void {
    this._showFeaturedOnly.set(false);
    this.blogService.setFilters({ featured: undefined });
  }

  clearAllFilters(): void {
    this.searchQuery = "";
    this.selectedCategory = "";
    this._showFeaturedOnly.set(false);
    this.blogService.clearFilters();

    this.analytics.trackEvent({
      name: "blog_filters_clear",
      category: "Blog",
      action: "clear_filters",
      label: "all",
    });
  }

  retryLoading(): void {
    this.blogService.loadPosts();
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xODcuNSAxMTIuNUMyMDEuNzUgMTEyLjUgMjEzLjMzMyAxMDAuOTE3IDIxMy4zMzMgODYuNjY2N0MyMTMuMzMzIDcyLjQxNjcgMjAxLjc1IDYwLjgzMzMgMTg3LjUgNjAuODMzM0MxNzMuMjUgNjAuODMzMyAxNjEuNjY3IDcyLjQxNjcgMTYxLjY2NyA4Ni42NjY3QzE2MS42NjcgMTAwLjkxNyAxNzMuMjUgMTEyLjUgMTg3LjUgMTEyLjVaIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0xMzcuNSAxNjQuMTY3TDMzMC44MzMgNjQuMTY2N0MzMzYgNjAuOTMzIDM0MS4zMzMgNjEuNzUgMzQ1LjUgNjUuNzVMMzc5LjE2NyAxMDEuNzVDMzgzLjMzMyAxMDUuOTU5IDM4My4zMzMgMTEyLjMwOSAzNzkuMTY3IDExNi41TDMzMC44MzMgMTY0LjE2N0MzMjYuNjY3IDE2OC4zNzQgMzE5LjMzMyAxNjkuOTk0IDMxNCAxNjcuOTk0TDEzNy41IDE2NC4xNjdaIiBmaWxsPSIjRTVFN0VCIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOUM5Qzk0Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==";
  }

  // Utility methods
  shouldShowFeatured(): boolean {
    return (
      !this.hasActiveFilters() && this.blogService.featuredPosts().length > 0
    );
  }

  hasActiveFilters(): boolean {
    const filters = this.blogService.filters();
    return !!(filters.search || filters.category || filters.featured);
  }

  getDisplayedPosts(): BlogPost[] {
    const posts = this.blogService.filteredPosts();
    return this.previewMode ? posts.slice(0, this.previewLimit) : posts;
  }

  getDisplayedCount(): number {
    return this.getDisplayedPosts().length;
  }

  getPostsTitle(): string {
    const filters = this.blogService.filters();

    if (!this.hasActiveFilters() && this.previewMode) {
      return "Top Posts";
    }

    if (filters.search) {
      return `Search Results for "${filters.search}"`;
    }

    if (filters.category) {
      const categoryName = this.getCategoryName(filters.category);
      return `${categoryName} Articles`;
    }

    if (filters.featured) {
      return "Featured Articles";
    }

    return "All Articles";
  }

  getCategoryName(slug: string): string {
    const category = this.blogService
      .categories()
      .find((c) => c.category.slug === slug);
    return category?.category.name || slug;
  }

  getTotalViews(): string {
    const total = this.blogService
      .posts()
      .reduce((sum, post) => sum + post.analytics.views, 0);
    return this.formatNumber(total);
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  trackPost(index: number, post: BlogPost): string {
    return post.id;
  }
}
