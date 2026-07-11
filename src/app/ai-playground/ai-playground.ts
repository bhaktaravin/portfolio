import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Tone = 'professional' | 'friendly' | 'bold';

interface PlaygroundInput {
  business: string;
  audience: string;
  offering: string;
  tone: Tone;
}

@Component({
  selector: 'app-ai-playground',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-playground.html',
  styleUrls: ['./ai-playground.css'],
})
export class AiPlaygroundComponent {
  input: PlaygroundInput = {
    business: '',
    audience: '',
    offering: '',
    tone: 'professional',
  };

  readonly tones: { value: Tone; label: string }[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'bold', label: 'Bold' },
  ];

  readonly seed = signal(0);
  readonly copied = signal<string | null>(null);

  readonly hasInput = computed(
    () =>
      this.input.business.trim().length > 0 &&
      this.input.audience.trim().length > 0 &&
      this.input.offering.trim().length > 0,
  );

  readonly headlines = computed(() => this.generateHeadlines());
  readonly socialPosts = computed(() => this.generateSocialPosts());
  readonly adCopy = computed(() => this.generateAdCopy());

  regenerate(): void {
    this.seed.update((s) => s + 1);
  }

  async copyText(text: string, key: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(key);
      setTimeout(() => this.copied.set(null), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  private pick<T>(items: T[]): T {
    const index = (this.seed() + items.length) % items.length;
    return items[index];
  }

  private toneOpener(): string {
    const { business, audience, tone } = this.input;
    const openers: Record<Tone, string[]> = {
      professional: [
        `${business} helps ${audience} achieve measurable results.`,
        `Built for ${audience} who need a reliable partner in ${business}.`,
      ],
      friendly: [
        `Hey ${audience} — ${business} is here to make your life easier.`,
        `${business} gets what ${audience} are juggling every day.`,
      ],
      bold: [
        `${audience}: stop settling. ${business} changes the game.`,
        `${business} — built different for ${audience} who demand more.`,
      ],
    };
    return this.pick(openers[tone]);
  }

  private generateHeadlines(): string[] {
    if (!this.hasInput()) return [];
    const { business, offering } = this.input;
    const variants = [
      `${business}: ${offering} — without the usual hassle`,
      `The smarter way to ${offering.toLowerCase()} | ${business}`,
      `${offering} for teams that move fast — ${business}`,
      `Why ${business}? Because ${offering.toLowerCase()} should just work.`,
    ];
    const offset = this.seed() % variants.length;
    return [...variants.slice(offset), ...variants.slice(0, offset)].slice(0, 3);
  }

  private generateSocialPosts(): string[] {
    if (!this.hasInput()) return [];
    const { business, offering, audience } = this.input;
    return [
      `${this.toneOpener()}\n\n→ ${offering}\n→ Made for ${audience}\n\nLearn more: [your-link] #${business.replace(/\s+/g, '')}`,
      `Quick win for ${audience}: ${offering.toLowerCase()} with ${business}.\n\nNo fluff — just results you can share with your team. DM or book a call.`,
    ];
  }

  private generateAdCopy(): string[] {
    if (!this.hasInput()) return [];
    const { business, offering, audience } = this.input;
    return [
      `Headline: ${offering} — done right\nBody: ${this.toneOpener()} ${offering} tailored for ${audience}. Start with ${business} today.\nCTA: Book a free consult`,
      `Headline: ${audience} choose ${business}\nBody: From first draft to live campaign — ${offering.toLowerCase()} with AI-assisted iteration and human review.\nCTA: Get a quote`,
    ];
  }
}
