import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

interface GumroadProduct {
  name: string;
  price: string;
  url: string;
  description: string;
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
      description:
        "Digital fiction ebook—available for instant download on Gumroad.",
      category: "fiction",
    },
    {
      name: "Arthurian Legend Adventure Novel",
      price: "$2.99",
      url: "https://ravinspire34.gumroad.com/l/llfsq",
      description:
        "Arthurian legend adventure novel—digital ebook with instant Gumroad delivery.",
      category: "fiction",
    },
    {
      name: "Blast From The Past — Self-host kit",
      price: "$5",
      url: "https://ravinspire34.gumroad.com/l/qotujr",
      description:
        "Self-host kit—digital download to run Blast From The Past on your own infrastructure.",
      category: "tech",
    },
  ];
}
