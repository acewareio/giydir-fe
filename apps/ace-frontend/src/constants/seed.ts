import result1 from "./result1.webp";
import result2 from "./result2.webp";
import result3 from "./result3.webp";
import result4 from "./result4.png";
import ornek1 from "./ornek1.webp";
import ornek2 from "./ornek2.webp";
import ornek3 from "./ornek3.webp";
import ornek5 from "./ornek5.jpg";
import garment1 from "./garment1.webp";
import garment2 from "./garment2.webp";
import garment3 from "./garment3.webp";
import garment4 from "./garment4.webp";

import { TupleToUnion } from "type-fest";

export type Models = TupleToUnion<typeof example_models>;

export const example_models = [
  {
    photo: ornek1.src,
    result: result1.src,
    source: "local",
    product: {
      url: "https://www.trendyol.com/avones/kadin-kare-yaka-kisa-kol-bluz-body-p-736000970?boutiqueId=61&merchantId=609908&sav=true",
      provider: "TRENDYOL",
      title: "Seçtiğiniz Ürün",
      thumbnail: garment1.src,
      created_date: null,
      rate: {
        count: 3,
        point: 4.5,
      },
    },
  },
  {
    photo: ornek5.src,
    result: result4.src,
    source: "remote",
    product: {
      url: "https://www.trendyol.com/uyguntarz/unisex-barbie-tasarim-tshirt-p-789080657?boutiqueId=61&merchantId=409382&filterOverPriceListings=false&sav=true",
      provider: "Trendyol",
      title: "Unisex BARBIE Tasarım Tshirt",
      thumbnail: garment4.src,
      created_date: "12.12.12",
      rate: {
        count: 5,
        point: 3.8,
      },
    },
  },
  {
    photo: ornek3.src,
    result: result3.src,
    source: "remote",
    product: {
      url: "https://www.trendyol.com/quzu/tek-dugmeli-crop-ceket-p-795833776",
      provider: "Trendyol",
      title: "Tek Düğmeli Crop Ceket",
      thumbnail: garment3.src,
      created_date: "12.12.12",
      rate: {
        count: 5,
        point: 3.8,
      },
    },
  },
  {
    photo: ornek2.src,
    source: "remote",
    result: result2.src,
    product: {
      url: "https://www.trendyol.com/quzu/kruvaze-crop-blazer-ceket-lacivert-p-675702143?boutiqueId=61&merchantId=155201&filterOverPriceListings=false&sav=true",
      provider: "Trendyol",
      title: "Kruvaze Crop Blazer Ceket Lacivert",
      thumbnail: garment2.src,
      created_date: null,
      rate: {
        count: 5,
        point: 3.8,
      },
    },
  },
];
