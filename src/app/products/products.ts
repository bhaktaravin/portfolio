import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface GumroadProduct {
  name: string;
  price: string;
  url: string;
  description: string;
  format?: string;
  image?: string;
  tagline?: string;
  category: "fiction" | "tech";
}

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./products.html",
  styleUrls: ["./products.css"],
})
export class ProductsComponent {
  storeUrl = "https://ravinspire34.gumroad.com/";

  products: GumroadProduct[] = [
    {
      name: "Witness Protection In Small Town",
      price: "$2",
      url: "https://ravinspire34.gumroad.com/l/cabbc",
      format: "PDF · 12 chapters",
      image: "assets/witness-protection-cover.png",
      tagline: "A mystery romance with hidden motives",
      description:
        "By Ravin Bhakta. Lena wakes with a new name, a handler’s rules she can’t question, and a small town that remembers too much—while her past starts calling back. PDF novel; instant Gumroad download.",
      category: "fiction",
    },
    {
      name: "Arthurian Legend Adventure Novel",
      price: "$2.99",
      url: "https://ravinspire34.gumroad.com/l/llfsq",
      format: "PDF · ebook",
      image: "assets/arthurian-legend-cover.png",
      tagline: "A quest through myth and chivalry",
      description:
        "By Ravin Bhakta. An Arthurian legend adventure—knights, myth, and chivalry in a full-length digital novel. Instant Gumroad download.",
      category: "fiction",
    },
    {
      name: "Blast From The Past — Self-host kit",
      price: "$5",
      url: "https://ravinspire34.gumroad.com/l/qotujr",
      image: "assets/instant-messenger.png",
      description:
        "Self-host kit for Instant Messenger (Blast From The Past)—Rust + egui + WASM retro chat you can deploy on your own infrastructure.",
      category: "tech",
    },
  ];
}
