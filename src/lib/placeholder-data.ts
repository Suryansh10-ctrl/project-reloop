import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    if (!image) {
        // Return a default or throw an error
        return { imageUrl: 'https://picsum.photos/seed/default/400/300', imageHint: 'image' };
    }
    return { imageUrl: image.imageUrl, imageHint: image.imageHint };
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  impactScore: number;
  bio: string;
  type: 'Giver' | 'Maker' | 'Buyer';
  rating: number;
};

export type Product = {
  id: string;
  name: string;
  story: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  makerId: string;
  material: string;
  wasteDiverted: number; // in kgs
};

export type Material = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  giverId: string;
  location: string;
  status: 'Free' | 'For Sale' | 'For Customization';
  price?: number;
};

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Anika Sharma',
    avatarUrl: findImage('maker-avatar-1').imageUrl,
    impactScore: 12.5,
    bio: 'I turn forgotten fabrics into fashion. Let\'s create something beautiful together!',
    type: 'Maker',
    rating: 4.8
  },
  {
    id: 'user-2',
    name: 'Rohan Verma',
    avatarUrl: findImage('giver-avatar-1').imageUrl,
    impactScore: 5.2,
    bio: 'Decluttering my home, one item at a time. Happy to see my old things get a new life.',
    type: 'Giver',
    rating: 5.0
  },
  {
    id: 'user-3',
    name: 'Priya Mehta',
    avatarUrl: findImage('buyer-avatar-1').imageUrl,
    impactScore: 7.8,
    bio: 'Conscious consumer looking for unique, sustainable pieces for my home.',
    type: 'Buyer',
    rating: 4.9
  },
    {
    id: 'user-4',
    name: 'Vikram Singh',
    avatarUrl: findImage('maker-avatar-2').imageUrl,
    impactScore: 25.1,
    bio: 'Reclaimed wood and metal are my canvas. I build furniture that tells a story.',
    type: 'Maker',
    rating: 4.9
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Upcycled Denim Cushion',
    story: 'This cushion cover was once a pair of discarded denim jeans. By giving it a new form, we saved it from the landfill and created a stylish, durable piece for your home.',
    price: 250.0,
    imageUrl: findImage('denim-cushion').imageUrl,
    imageHint: findImage('denim-cushion').imageHint,
    makerId: 'user-1',
    material: 'Denim',
    wasteDiverted: 0.5,
  },
  {
    id: 'prod-2',
    name: 'Vintage Saree Tote Bag',
    story: 'Crafted from a beautiful old silk saree, this one-of-a-kind tote bag carries a legacy of Indian textile art. It\'s spacious, vibrant, and eco-friendly.',
    price: 450.0,
    imageUrl: findImage('saree-tote-bag').imageUrl,
    imageHint: findImage('saree-tote-bag').imageHint,
    makerId: 'user-1',
    material: 'Silk Saree',
    wasteDiverted: 0.3,
  },
  {
    id: 'prod-3',
    name: 'Reclaimed Wood Shelf',
    story: 'Built from sturdy pallet wood that was destined for disposal. This rustic shelf adds character and sustainable storage to any room.',
    price: 500.0,
    imageUrl: findImage('wood-shelf').imageUrl,
    imageHint: findImage('wood-shelf').imageHint,
    makerId: 'user-4',
    material: 'Wood',
    wasteDiverted: 5.0,
  },
  {
    id: 'prod-4',
    name: 'Recycled Bottle Lamp',
    story: 'This elegant table lamp was created from a discarded wine bottle. Its warm glow is a reminder that even simple objects can be transformed into something magical.',
    price: 350.0,
    imageUrl: findImage('bottle-lamps').imageUrl,
    imageHint: findImage('bottle-lamps').imageHint,
    makerId: 'user-4',
    material: 'Glass',
    wasteDiverted: 0.7,
  },
];

export const materials: Material[] = [
    {
        id: 'mat-1',
        name: 'Old Sarees',
        description: 'A collection of 5 colorful cotton and silk sarees. Some have minor tears but are perfect for quilting, bags, or other fabric crafts.',
        imageUrl: findImage('pile-of-sarees').imageUrl,
        imageHint: findImage('pile-of-sarees').imageHint,
        giverId: 'user-2',
        location: 'Koramangala, Bangalore',
        status: 'Free',
    },
    {
        id: 'mat-2',
        name: 'Scrap Denim',
        description: '3 pairs of old denim jeans. Worn out but plenty of good fabric left for patches, bags, or upholstery projects.',
        imageUrl: findImage('old-jeans').imageUrl,
        imageHint: findImage('old-jeans').imageHint,
        giverId: 'user-2',
        location: 'Indiranagar, Bangalore',
        status: 'For Customization',
    },
    {
        id: 'mat-3',
        name: 'Old Furniture Wood',
        description: 'An old wooden chair, broken but with good quality teak wood pieces. Ideal for small shelves or decorative items.',
        imageUrl: findImage('scrap-wood').imageUrl,
        imageHint: findImage('scrap-wood').imageHint,
        giverId: 'user-3',
        location: 'Jayanagar, Bangalore',
        status: 'For Sale',
        price: 150,
    },
    {
        id: 'mat-4',
        name: 'Plastic Bottles',
        description: 'About 20 PET plastic bottles of 1 liter capacity. Clean and ready for creative projects like planters or vertical gardens.',
        imageUrl: findImage('plastic-bottles').imageUrl,
        imageHint: findImage('plastic-bottles').imageHint,
        giverId: 'user-2',
        location: 'HSR Layout, Bangalore',
        status: 'Free',
    }
];
