import { Injectable, inject, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { PROFILE } from '../data/portfolio.data';

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class MetaService implements OnDestroy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  private readonly defaultTitle = `${PROFILE.fullName} - ${PROFILE.jobTitle}`;
  private readonly defaultDescription = PROFILE.siteDescription;
  private readonly siteUrl = PROFILE.siteUrl;
  private readonly defaultImage = `${PROFILE.siteUrl}/assets/og-image.png`;

  update(page: PageMeta): void {
    const fullTitle = page.title.includes(PROFILE.fullName)
      ? page.title
      : `${page.title} | ${PROFILE.fullName}`;
    const description = page.description;
    const image = page.image ?? this.defaultImage;
    const url = page.url ?? this.siteUrl;

    this.title.setTitle(fullTitle);
    this.setTag('name', 'description', description);
    this.setTag('property', 'og:title', fullTitle);
    this.setTag('property', 'og:description', description);
    this.setTag('property', 'og:image', image);
    this.setTag('property', 'og:url', url);
    this.setTag('name', 'twitter:title', fullTitle);
    this.setTag('name', 'twitter:description', description);
    this.setTag('name', 'twitter:image', image);
  }

  reset(): void {
    this.update({
      title: this.defaultTitle,
      description: this.defaultDescription,
      image: this.defaultImage,
      url: this.siteUrl,
    });
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private setTag(attr: 'name' | 'property', selector: string, content: string): void {
    const key = attr === 'name' ? 'name' : 'property';
    if (this.meta.getTag(`${key}="${selector}"`)) {
      this.meta.updateTag({ [key]: selector, content });
    } else {
      this.meta.addTag({ [key]: selector, content });
    }
  }
}
