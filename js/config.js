window.PRODUCT_CONFIG = {
  brand: {
    name: 'Luma Glow',
    logo: '',
    favicon: 'favicon.svg',
    accent: '#9BE100',
    primaryCtaColor: '#111A12',
    socialLinks: {
      instagram: '',
      tiktok: '',
      whatsapp: 'https://wa.me/212618439834'
    }
  },

  product: {
    name: 'قناع ديسار بالروزماري والسنتيلا',
    nameEn: 'Disaar Rosemary & Centella Facial Mask',
    shortName: 'Disaar Mask',
    category: 'العناية بالبشرة',
    description: 'قناع وجه بخلاصة إكليل الجبل والسنتيلا الآسيوية، مصمم لتنظيف البشرة وتهدئتها وترطيبها ومنحها مظهرا أكثر نعومة ونضارة.',
    descriptionEn: 'A facial mask with rosemary and Centella Asiatica extracts, designed to cleanse, soothe and hydrate the skin for a softer, fresher-looking complexion.',
    price: 69,
    oldPrice: 99,
    currency: 'MAD',
    discount: '30%',
    badge: 'عناية طبيعية لبشرة أكثر نضارة',
    badgeEn: 'Natural care for a fresher glow',
    sku: '694177B571535',
    images: [
      { src: 'assets/images/product-main.jpg', alt: 'Disaar Rosemary & Centella Facial Mask', altAr: 'قناع ديسار بالروزماري والسنتيلا' },
      { src: 'assets/images/product-detail-1.jpg', alt: 'Disaar facial mask detail', altAr: 'تفاصيل قناع ديسار' },
      { src: 'assets/images/product-detail-2.jpg', alt: 'Disaar facial mask usage', altAr: 'استخدام قناع ديسار' },
      { src: 'assets/images/product-detail-3.jpg', alt: 'Disaar facial mask packaging', altAr: 'عبوة قناع ديسار' }
    ]
  },

  sale: {
    mode: 'cod-api',
    whatsapp: {
      enabled: true,
      number: '212618439834',
      message: 'مرحبا، أريد الاستفسار عن {product}'
    },
    affiliate: {
      enabled: false,
      url: ''
    },
    codApi: {
      enabled: true,
      endpoint: '/api/create-order',
      currency: 'MAD',
      price: 69
    }
  },

  backend: {
    enabled: true,
    endpoint: "https://script.google.com/macros/s/AKfycbxLdEXZXThbtKtwjwuqmuFJ99s-c6omNQOpl2zl8-r6miJNViI1jBhQAPHxoPWMwuek/exec"
}
  benefits: [
    {
      title: 'تهدئة البشرة',
      titleEn: 'Soothing care',
      description: 'يساعد على تهدئة مظهر البشرة وتقليل الإحساس بالاحمرار ضمن روتين العناية اليومي.',
      descriptionEn: 'Helps soothe the look of skin and reduce the appearance of redness as part of a daily routine.'
    },
    {
      title: 'ترطيب ونعومة',
      titleEn: 'Hydration & softness',
      description: 'يساعد على الحفاظ على ترطيب البشرة ويمنحها ملمسا أكثر نعومة وراحة.',
      descriptionEn: 'Helps maintain hydration and leaves skin feeling softer and more comfortable.'
    },
    {
      title: 'إكليل الجبل والسنتيلا',
      titleEn: 'Rosemary & Centella',
      description: 'تركيبة تعتمد على خلاصتي إكليل الجبل والسنتيلا الآسيوية للعناية بالبشرة.',
      descriptionEn: 'A formula featuring rosemary and Centella Asiatica extracts for everyday skin care.'
    },
    {
      title: 'مناسب لروتينك اليومي',
      titleEn: 'Easy daily routine',
      description: 'خطوات بسيطة بعد تنظيف الوجه، دون تعقيد في طريقة الاستخدام.',
      descriptionEn: 'Simple steps after cleansing, with no complicated routine.'
    },
    {
      title: 'لمختلف أنواع البشرة',
      titleEn: 'For different skin types',
      description: 'مذكور من المورد أنه مناسب للبشرة الحساسة والدهنية والمختلطة وغيرها.',
      descriptionEn: 'The supplier describes it as suitable for sensitive, oily, combination and other skin types.'
    },
    {
      title: 'وقت قصير للاستخدام',
      titleEn: 'Quick treatment time',
      description: 'يترك على الوجه لمدة 10–15 دقيقة ثم يشطف بالماء الفاتر.',
      descriptionEn: 'Leave on for 10–15 minutes, then rinse with lukewarm water.'
    }
  ],

  showcase: [
    {
      title: 'روزماري + سنتيلا في روتين واحد',
      titleEn: 'Rosemary + Centella in one routine',
      text: 'اختيار عملي لمن يريد إضافة خطوة عناية بسيطة تجمع التنظيف والتهدئة والترطيب في روتين البشرة.',
      textEn: 'A simple addition to a skincare routine focused on cleansing, soothing and hydration.',
      points: ['إكليل الجبل', 'السنتيلا الآسيوية', 'ترطيب ونعومة', 'روتين بسيط'],
      pointsEn: ['Rosemary', 'Centella Asiatica', 'Hydration & softness', 'Simple routine'],
      image: 'assets/images/product-detail-1.jpg'
    },
    {
      title: 'استخدام بسيط في 3 خطوات',
      titleEn: 'A simple 3-step routine',
      text: 'نظف الوجه، ضع القناع واتركه 10–15 دقيقة، ثم اشطفه بالماء الفاتر.',
      textEn: 'Cleanse your face, apply the mask for 10–15 minutes, then rinse with lukewarm water.',
      points: ['نظف البشرة', 'اتركه 10–15 دقيقة', 'اشطف بالماء الفاتر'],
      pointsEn: ['Cleanse', 'Leave for 10–15 minutes', 'Rinse with lukewarm water'],
      image: 'assets/images/product-detail-2.jpg'
    }
  ],

  howItWorks: [
    {
      number: 1,
      title: 'نظفي وجهك',
      titleEn: 'Cleanse your face',
      description: 'ابدئي ببشرة نظيفة قبل وضع القناع.',
      descriptionEn: 'Start with clean skin before applying the mask.'
    },
    {
      number: 2,
      title: 'ضعي القناع',
      titleEn: 'Apply the mask',
      description: 'ضعي القناع على الوجه بطريقة متساوية.',
      descriptionEn: 'Apply the mask evenly over the face.'
    },
    {
      number: 3,
      title: 'انتظري 10–15 دقيقة',
      titleEn: 'Wait 10–15 minutes',
      description: 'اتركيه للمدة الموصى بها.',
      descriptionEn: 'Leave it on for the recommended time.'
    },
    {
      number: 4,
      title: 'اشطفي بالماء الفاتر',
      titleEn: 'Rinse with lukewarm water',
      description: 'اشطفي الوجه بالماء الفاتر بعد انتهاء المدة.',
      descriptionEn: 'Rinse your face with lukewarm water when the time is up.'
    }
  ],

  specifications: [
    { label: 'المنتج', labelEn: 'Product', value: 'قناع وجه Disaar بالروزماري والسنتيلا' },
    { label: 'SKU', labelEn: 'SKU', value: '694177B571535' },
    { label: 'المكونات البارزة', labelEn: 'Key extracts', value: 'إكليل الجبل + السنتيلا الآسيوية' },
    { label: 'نوع العناية', labelEn: 'Care type', value: 'تنظيف، تهدئة وترطيب البشرة' },
    { label: 'أنواع البشرة', labelEn: 'Skin types', value: 'بحسب بيانات المورد: جميع أنواع البشرة، بما فيها الحساسة والدهنية والمختلطة' },
    { label: 'مدة الاستخدام', labelEn: 'Application time', value: '10–15 دقيقة' },
    { label: 'طريقة الإزالة', labelEn: 'Removal', value: 'الشطف بالماء الفاتر' }
  ],

  offer: {
    enabled: true,
    title: 'عرض Luma Glow',
    titleEn: 'Luma Glow offer',
    description: 'اطلبي قناع Disaar بسعر 69 درهم مع الدفع عند الاستلام داخل المغرب.',
    descriptionEn: 'Order the Disaar mask for 69 MAD with cash on delivery in Morocco.',
    badge: 'وفر 30%',
    badgeEn: 'Save 30%',
    urgency: 'السعر الحالي 69 DH',
    urgencyEn: 'Current price: 69 MAD'
  },

  reviews: [],

  faq: [
    {
      question: 'كيف أستخدم القناع؟',
      questionEn: 'How do I use the mask?',
      answer: 'نظفي الوجه أولا، ثم ضعي القناع واتركيه لمدة 10–15 دقيقة، وبعدها اشطفيه بالماء الفاتر.',
      answerEn: 'Cleanse your face, apply the mask for 10–15 minutes, then rinse with lukewarm water.'
    },
    {
      question: 'ما المكونات الرئيسية؟',
      questionEn: 'What are the key ingredients?',
      answer: 'يحتوي على خلاصة إكليل الجبل وخلاصة السنتيلا الآسيوية بحسب بيانات المنتج المتاحة.',
      answerEn: 'The listed key extracts are rosemary and Centella Asiatica.'
    },
    {
      question: 'هل يناسب البشرة الحساسة؟',
      questionEn: 'Is it suitable for sensitive skin?',
      answer: 'بيانات المورد تذكر أنه مناسب لمختلف أنواع البشرة ومنها الحساسة، لكن يفضل اختبار المنتج على مساحة صغيرة أولا، خاصة للبشرة شديدة الحساسية.',
      answerEn: 'The supplier describes it as suitable for different skin types including sensitive skin. A patch test is recommended, especially for very sensitive skin.'
    },
    {
      question: 'هل يعالج حب الشباب؟',
      questionEn: 'Does it treat acne?',
      answer: 'المنتج تجميلي للعناية بالبشرة، ووصف المورد يذكر المساعدة في تهدئة مظهر الاحمرار والالتهابات المرتبطة بحب الشباب. لا ينبغي اعتباره علاجا طبيا لحب الشباب.',
      answerEn: 'This is a cosmetic skincare product. The supplier describes support for the appearance of redness and inflammation associated with acne; it should not be considered a medical acne treatment.'
    },
    {
      question: 'كيف أطلب المنتج؟',
      questionEn: 'How can I order?',
      answer: 'اضغطي على زر اطلب الآن، ثم أدخلي الاسم ورقم الهاتف والمدينة والعنوان والكمية. بعد الإرسال يتم تسجيل الطلب لدى COD Solutions ليتم التواصل معك لتأكيده.',
      answerEn: 'Click Order Now, enter your name, phone, city, address and quantity. After submission, the order is sent to COD Solutions for confirmation.'
    }
  ],

  translations: {
    ar: {
      nav: ['الرئيسية', 'الفوائد', 'المميزات', 'طريقة الاستخدام', 'الأسئلة الشائعة'],
      navHref: ['#top', '#benefits', '#showcase', '#how-it-works', '#faq'],
      primaryCta: 'اشتري الآن بـ 69 درهم',
      secondaryCta: 'اكتشفي المنتج',
      buyWhatsApp: 'استفسري عبر واتساب',
      buyWebsite: 'اشتري الآن بـ 69 درهم',
      finalTitle: 'جاهزة لروتين أكثر نضارة؟',
      finalText: 'اكتشفي قناع Disaar بالروزماري والسنتيلا وابدئي روتينك بخطوة بسيطة.',
      whatsapp: 'واتساب',
      affiliateDisclosure: 'إفصاح: قد نحصل على عمولة عند إتمام عملية شراء عبر رابط الشريك، دون تكلفة إضافية عليك.',
      noSpecs: 'لا توجد مواصفات إضافية متاحة حاليا.',
      ctaLabel: 'اشتري الآن',
      products: 'المنتج',
      footerAbout: 'عن Luma Glow',
      footerContact: 'تواصلي معنا',
      footerShipping: 'التوصيل',
      footerReturns: 'الإرجاع',
      footerFaq: 'الأسئلة الشائعة',
      footerPrivacy: 'الخصوصية',
      footerTerms: 'الشروط',
      social: 'التواصل'
    },
    en: {
      nav: ['Home', 'Benefits', 'Features', 'How it works', 'FAQ'],
      navHref: ['#top', '#benefits', '#showcase', '#how-it-works', '#faq'],
      primaryCta: 'Buy now for 69 MAD',
      secondaryCta: 'Discover the product',
      buyWhatsApp: 'Ask on WhatsApp',
      buyWebsite: 'Buy now for 69 MAD',
      finalTitle: 'Ready for a fresher routine?',
      finalText: 'Discover the Disaar Rosemary & Centella mask and make skincare feel simpler.',
      whatsapp: 'WhatsApp',
      affiliateDisclosure: 'Disclosure: We may earn a commission if you complete a purchase through our partner link, at no extra cost to you.',
      noSpecs: 'No additional specifications are currently available.',
      ctaLabel: 'Buy now',
      products: 'Product',
      footerAbout: 'About Luma Glow',
      footerContact: 'Contact',
      footerShipping: 'Shipping',
      footerReturns: 'Returns',
      footerFaq: 'FAQ',
      footerPrivacy: 'Privacy',
      footerTerms: 'Terms',
      social: 'Social'
    }
  },

  seo: {
    title: 'Luma Glow | قناع ديسار بالروزماري والسنتيلا',
    description: 'قناع ديسار بالروزماري والسنتيلا للعناية بالبشرة، بتركيبة تساعد على التنظيف والتهدئة والترطيب.',
    descriptionAr: 'قناع ديسار بالروزماري والسنتيلا للعناية بالبشرة، بتركيبة تساعد على التنظيف والتهدئة والترطيب.',
    canonical: 'https://go.bouhaj.com/',
    ogImage: 'assets/images/product-main.jpg'
  },

  sections: {
    benefits: true,
    showcase: true,
    howItWorks: true,
    specifications: true,
    offer: true,
    reviews: false,
    faq: true,
    finalCTA: true
  }
};

window.productConfig = window.PRODUCT_CONFIG;
window.product = window.PRODUCT_CONFIG.product;
