import type { WebsiteConfig } from "./types";

export const samplePressureWashingWebsite: WebsiteConfig = {
  businessName: "Apex Pressure Washing",
  tagline: "Spotless. Every time.",
  stylePack: "bold-contractor",
  sections: [
    {
      type: "HeroAnimated",
      props: {
        headline: "We Make Your Property Look Brand New",
        subheadline:
          "Professional pressure washing for driveways, roofs, decks, and homes. Same-day quotes. Fully insured.",
        ctaText: "Get a Free Quote",
        ctaPhone: "(555) 280-4700",
        badgeText: "5★ Rated · Licensed & Insured · Same-Day Quotes",
      },
    },
    {
      type: "AnimatedStats",
      props: {
        dark: true,
        stats: [
          { value: "1,200+", label: "Jobs Completed" },
          { value: "4.9★", label: "Average Rating" },
          { value: "8 yrs", label: "In Business" },
          { value: "100%", label: "Satisfaction Guaranteed" },
        ],
      },
    },
    {
      type: "ServicesShowcase",
      props: {
        heading: "What We Clean",
        subheading: "Every surface. Every time. Done right the first time.",
        services: [
          {
            icon: "🏠",
            title: "House Washing",
            description:
              "Soft-wash your home's siding, trim, and fascia. Removes mold, algae, and years of grime without damaging paint.",
            price: "From $199",
          },
          {
            icon: "🚗",
            title: "Driveway & Concrete",
            description:
              "High-pressure surface cleaning restores concrete driveways, walkways, and patios to like-new condition.",
            price: "From $99",
          },
          {
            icon: "🌿",
            title: "Deck & Fence Cleaning",
            description:
              "Safely remove embedded dirt, mold, and weathering from wood and composite decks before they rot.",
            price: "From $149",
          },
          {
            icon: "🏗️",
            title: "Roof Soft Washing",
            description:
              "Low-pressure bio-wash kills algae and lichen at the root so your roof stays clean 4–5× longer than standard washing.",
            price: "From $299",
          },
          {
            icon: "🪟",
            title: "Window & Gutter Flush",
            description:
              "Flush clogged gutters and clean exterior windows in one visit. Ladder work included.",
            price: "From $129",
          },
          {
            icon: "🏢",
            title: "Commercial Cleaning",
            description:
              "Storefronts, parking lots, loading docks, and fleet washing. We work after hours to keep your business running.",
            price: "Custom quote",
          },
        ],
      },
    },
    {
      type: "PressureWashRevealSection",
      props: {
        heading: "The Apex Difference",
        subheading:
          "We don't just blast water. We use the right pressure, the right temperature, and the right chemistry for every surface — so nothing gets damaged and everything gets clean.",
        stats: [
          { value: "200°F", label: "Hot water option" },
          { value: "4,000 PSI", label: "Max pressure" },
          { value: "0%", label: "Surface damage rate" },
        ],
      },
    },
    {
      type: "WhyChooseUs",
      props: {
        heading: "Why Apex?",
        subheading: "We built our reputation one driveway at a time.",
        reasons: [
          {
            icon: "⚡",
            title: "Same-Day Quotes",
            description:
              "Send us a photo and get an accurate quote within the hour — no waiting, no surprises.",
          },
          {
            icon: "🛡️",
            title: "Fully Insured",
            description:
              "$2M liability coverage on every job. If something goes wrong, you're protected.",
          },
          {
            icon: "📅",
            title: "On-Time Guarantee",
            description:
              "We show up when we say. If we're late by more than 30 minutes, your job is 10% off.",
          },
          {
            icon: "♻️",
            title: "Eco-Friendly",
            description:
              "Biodegradable detergents and water reclamation on all commercial jobs. Clean conscience included.",
          },
          {
            icon: "📸",
            title: "Before & After Proof",
            description:
              "Every job is documented with before/after photos sent directly to you — so you always see the results.",
          },
          {
            icon: "🤝",
            title: "Satisfaction Promise",
            description:
              "Not happy? We come back and make it right — free. That's the Apex promise.",
          },
        ],
      },
    },
    {
      type: "GalleryMasonry",
      props: {
        heading: "Recent Work",
        subheading: "Before & after — no filters, no tricks.",
        images: [
          {
            alt: "Driveway before cleaning",
            caption: "Driveway · Before",
            gradient: "linear-gradient(135deg, #374151 10%, #4b5563 100%)",
          },
          {
            alt: "Driveway after cleaning",
            caption: "Driveway · After ✓",
            gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
          },
          {
            alt: "Roof algae removed",
            caption: "Roof Soft Wash · After ✓",
            gradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
          },
          {
            alt: "Deck before cleaning",
            caption: "Deck · Before",
            gradient: "linear-gradient(135deg, #44403c 0%, #57534e 100%)",
          },
          {
            alt: "Deck after cleaning",
            caption: "Deck · After ✓",
            gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          },
          {
            alt: "Commercial parking lot",
            caption: "Parking Lot · After ✓",
            gradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
          },
        ],
      },
    },
    {
      type: "ReviewsCarousel",
      props: {
        heading: "What Our Customers Say",
        reviews: [
          {
            name: "Mike T.",
            rating: 5,
            text: "My driveway looks better than the day it was poured. Apex showed up on time, explained everything, and did an incredible job. Already booked them for the roof.",
            location: "Marietta, GA",
          },
          {
            name: "Sandra K.",
            rating: 5,
            text: "I've tried three other pressure washing companies and none of them come close. The house looks brand new — even the gutters are spotless. Apex for life.",
            location: "Alpharetta, GA",
          },
          {
            name: "Carlos M.",
            rating: 5,
            text: "Commercial job on our warehouse. They came at 6am, were done by noon, and the lot looks amazing. Tenants were shocked at the difference. Highly recommend.",
            location: "Kennesaw, GA",
          },
          {
            name: "Rachel P.",
            rating: 5,
            text: "Fast quote, fair price, no drama. The deck was black with mold — now it looks like we just installed it. Worth every penny.",
            location: "Roswell, GA",
          },
        ],
      },
    },
    {
      type: "FAQAccordion",
      props: {
        heading: "Frequently Asked Questions",
        faqs: [
          {
            question: "How long does a typical job take?",
            answer:
              "A standard house wash takes 2–4 hours depending on size. A driveway is usually 45–90 minutes. We'll give you a time estimate when we quote.",
          },
          {
            question: "Do I need to be home during the service?",
            answer:
              "No — as long as we have access to a water spigot, you don't need to be present. We'll send before/after photos when we're done.",
          },
          {
            question: "Is pressure washing safe for my paint / roof shingles?",
            answer:
              "Absolutely, when done right. We use soft-wash technique (low pressure + professional detergent) on paint, siding, and roofing so nothing gets damaged.",
          },
          {
            question: "Do you offer recurring maintenance plans?",
            answer:
              "Yes — our annual and bi-annual maintenance plans keep your property looking great year-round and come with a 15% discount off single-visit pricing.",
          },
          {
            question: "What areas do you serve?",
            answer:
              "We serve the greater Metro Atlanta area including Marietta, Alpharetta, Roswell, Kennesaw, Smyrna, and surrounding counties. Not sure if we cover you? Just call.",
          },
        ],
      },
    },
    {
      type: "FinalCTA",
      props: {
        heading: "Ready for a Spotless Property?",
        subheading:
          "Get a free, no-obligation quote in under an hour. We'll handle the rest.",
        ctaText: "Get My Free Quote",
        ctaPhone: "(555) 280-4700",
      },
    },
    {
      type: "FooterPremium",
      props: {
        businessName: "Apex Pressure Washing",
        tagline: "Spotless. Every time.",
        phone: "(555) 280-4700",
        email: "hello@apexpressurewashing.com",
        address: "Serving Metro Atlanta, GA",
        links: [
          { label: "Services", href: "#" },
          { label: "Gallery", href: "#" },
          { label: "Reviews", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
    },
  ],
};

export const sampleIceCreamWebsite: WebsiteConfig = {
  businessName: "Scoops & Co.",
  tagline: "Life is short. Eat ice cream.",
  stylePack: "playful-bright",
  sections: [
    {
      type: "CustomIceCreamHero",
      props: {
        businessName: "Scoops & Co.",
        headline: "The Best Scoops in Town",
        subheadline:
          "Handcrafted small-batch ice cream made with local dairy. 40+ rotating flavors, waffle cones made fresh daily.",
        ctaText: "See Our Flavors",
        ctaPhone: "(555) 744-2663",
      },
    },
    {
      type: "ServicesShowcase",
      props: {
        heading: "What We Make",
        subheading: "Everything handcrafted. Nothing from a mix.",
        services: [
          {
            icon: "🍦",
            title: "Classic Scoops",
            description: "Two to four scoops in a cup or cone. Choose from 40+ rotating flavors made fresh each week.",
            price: "From $4",
          },
          {
            icon: "🧁",
            title: "Ice Cream Sandwiches",
            description: "Your pick of flavor pressed between two freshly baked cookies. A fan favorite.",
            price: "From $5",
          },
          {
            icon: "🥤",
            title: "Floats & Shakes",
            description: "Hand-spun milkshakes and old-fashioned ice cream floats. Thick, rich, and worth every calorie.",
            price: "From $6",
          },
          {
            icon: "🎂",
            title: "Ice Cream Cakes",
            description: "Custom ice cream cakes for birthdays, weddings, and events. Order 48 hours in advance.",
            price: "From $42",
          },
        ],
      },
    },
    {
      type: "AnimatedStats",
      props: {
        stats: [
          { value: "40+", label: "Rotating flavors" },
          { value: "12 yrs", label: "Making scoops" },
          { value: "100%", label: "Local dairy" },
          { value: "4.9★", label: "Google rating" },
        ],
      },
    },
    {
      type: "ReviewsCarousel",
      props: {
        heading: "Happy Customers",
        reviews: [
          {
            name: "Jenna L.",
            rating: 5,
            text: "Best ice cream I've ever had. The brown butter pecan flavor is absolutely unreal. We drive 20 minutes just to come here.",
            location: "Nashville, TN",
          },
          {
            name: "Tom & Lily B.",
            rating: 5,
            text: "We got an ice cream cake for our daughter's birthday and it was the star of the party. Stunning and delicious.",
            location: "Brentwood, TN",
          },
          {
            name: "Marcus D.",
            rating: 5,
            text: "The waffle cones are made right in front of you. The flavors are wild and creative. This place is a gem.",
            location: "Nashville, TN",
          },
        ],
      },
    },
    {
      type: "FinalCTA",
      props: {
        heading: "Come In for a Scoop",
        subheading: "Open daily 11am–10pm · Walk-ins always welcome · Custom orders available",
        ctaText: "Find Us",
        ctaPhone: "(555) 744-2663",
      },
    },
    {
      type: "FooterPremium",
      props: {
        businessName: "Scoops & Co.",
        tagline: "Life is short. Eat ice cream.",
        phone: "(555) 744-2663",
        email: "hello@scoopsandco.com",
        address: "142 Main Street · Nashville, TN",
        links: [
          { label: "Flavors", href: "#" },
          { label: "Cakes", href: "#" },
          { label: "Hours", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
    },
  ],
};
