
import { GeneratedPuzzle } from "../types";

export const STATIC_LEVELS: GeneratedPuzzle[] = [
  {
    title: "المستوى 1: البداية السهلة",
    dimensions: 9,
    words: [
      { text: "مصر", clue: "دولة الأهرامات", row: 3, col: 3, direction: "across", clueType: "standard" },
      { text: "قمر", clue: "جسم سماوي يضيء ليلاً", row: 1, col: 5, direction: "down", clueType: "standard" },
      { text: "صقر", clue: "طائر جارح حاد البصر", row: 3, col: 4, direction: "down", clueType: "standard" },
      { text: "بحر", clue: "مسطح مائي كبير ومالح", row: 5, col: 2, direction: "across", clueType: "standard" },
      { text: "حب", clue: "عكس كره", row: 5, col: 3, direction: "down", clueType: "standard" },
      { text: "أسد", clue: "ملك الغابة", row: 1, col: 1, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 2: عالم الحيوان",
    dimensions: 10,
    words: [
      { text: "زرافة", clue: "حيوان طويل الرقبة", row: 2, col: 2, direction: "across", clueType: "standard" },
      { text: "فيل", clue: "أضخم حيوان بري", row: 2, col: 5, direction: "down", clueType: "standard" },
      { text: "نمر", clue: "حيوان مفترس مخطط", row: 4, col: 3, direction: "across", clueType: "standard" },
      { text: "ارنب", clue: "حيوان يحب الجزر", row: 1, col: 3, direction: "down", clueType: "standard" },
      { text: "حصان", clue: "حيوان يستخدم للركوب والجر", row: 6, col: 1, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 3: عواصم عربية",
    dimensions: 11,
    words: [
      { text: "الرياض", clue: "عاصمة المملكة العربية السعودية", row: 4, col: 2, direction: "across", clueType: "standard" },
      { text: "دبي", clue: "مدينة إماراتية شهيرة (ليست العاصمة)", row: 2, col: 4, direction: "down", clueType: "standard" },
      { text: "بغداد", clue: "عاصمة العراق", row: 6, col: 1, direction: "across", clueType: "standard" },
      { text: "تونس", clue: "عاصمة تونس", row: 1, col: 6, direction: "down", clueType: "standard" },
      { text: "عمان", clue: "عاصمة الأردن", row: 4, col: 5, direction: "down", clueType: "standard" },
      { text: "صنعاء", clue: "عاصمة اليمن", row: 8, col: 3, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 4: ألغاز رياضية",
    dimensions: 10,
    words: [
      { text: "تسعة", clue: "3 × 3", row: 3, col: 2, direction: "across", clueType: "math" },
      { text: "عشرة", clue: "5 + 5", row: 1, col: 4, direction: "down", clueType: "math" },
      { text: "صفر", clue: "الرقم الذي إذا ضربته في أي رقم كانت النتيجة نفسه", row: 5, col: 1, direction: "across", clueType: "math" },
      { text: "مائة", clue: "10 × 10", row: 3, col: 6, direction: "down", clueType: "math" },
      { text: "خمسة", clue: "عدد أصابع اليد الواحدة", row: 7, col: 2, direction: "across", clueType: "math" }
    ]
  },
  {
    title: "المستوى 5: في المطبخ",
    dimensions: 12,
    words: [
      { text: "سكين", clue: "أداة للتقطيع", row: 2, col: 3, direction: "across", clueType: "standard" },
      { text: "ملعقة", clue: "نأكل بها الشوربة", row: 1, col: 5, direction: "down", clueType: "standard" },
      { text: "طبق", clue: "نضع فيه الطعام", row: 4, col: 1, direction: "across", clueType: "standard" },
      { text: "فرن", clue: "لخبز الكعك", row: 2, col: 8, direction: "down", clueType: "standard" },
      { text: "ثلاجة", clue: "لحفظ الطعام بارداً", row: 6, col: 4, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 6: جسم الإنسان",
    dimensions: 10,
    words: [
      { text: "قلب", clue: "يضخ الدم للجسم", row: 4, col: 4, direction: "across", clueType: "standard" },
      { text: "عين", clue: "نرى بها", row: 2, col: 5, direction: "down", clueType: "standard" },
      { text: "انف", clue: "نشتم به الروائح", row: 5, col: 2, direction: "across", clueType: "standard" },
      { text: "اذن", clue: "نسمع بها", row: 4, col: 7, direction: "down", clueType: "standard" },
      { text: "يد", clue: "بها خمسة أصابع", row: 6, col: 4, direction: "down", clueType: "standard" },
      { text: "رجل", clue: "نمشي عليها", row: 8, col: 3, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 7: ثقافة وفنون",
    dimensions: 12,
    words: [
      { text: "كلثوم", clue: "كوكب الشرق (الاسم الثاني)", row: 3, col: 2, direction: "across", clueType: "cultural" },
      { text: "مسرح", clue: "أبو الفنون", row: 1, col: 4, direction: "down", clueType: "cultural" },
      { text: "لوحة", clue: "ما يرسمه الفنان", row: 5, col: 1, direction: "across", clueType: "standard" },
      { text: "شعر", clue: "كلام موزون ومقفى", row: 3, col: 6, direction: "down", clueType: "standard" },
      { text: "رواية", clue: "قصة طويلة", row: 7, col: 3, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 8: الفضاء",
    dimensions: 11,
    words: [
      { text: "شمس", clue: "نجم مجموعتنا", row: 2, col: 4, direction: "across", clueType: "standard" },
      { text: "مريخ", clue: "الكوكب الأحمر", row: 1, col: 6, direction: "down", clueType: "standard" },
      { text: "ارض", clue: "الكوكب الذي نعيش عليه", row: 4, col: 2, direction: "across", clueType: "standard" },
      { text: "زحل", clue: "كوكب ذو حلقات", row: 4, col: 8, direction: "down", clueType: "standard" },
      { text: "نجم", clue: "يلمع في السماء ليلاً", row: 6, col: 5, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 9: الطبيعة",
    dimensions: 10,
    words: [
      { text: "شجرة", clue: "لها جذور وأغصان", row: 2, col: 3, direction: "across", clueType: "standard" },
      { text: "جبل", clue: "تضريس أرضي مرتفع جداً", row: 1, col: 5, direction: "down", clueType: "standard" },
      { text: "نهر", clue: "مجرى مائي عذب", row: 4, col: 2, direction: "across", clueType: "standard" },
      { text: "زهرة", clue: "نبات له رائحة جميلة", row: 2, col: 7, direction: "down", clueType: "standard" },
      { text: "غابة", clue: "مكان كثيف الأشجار", row: 6, col: 1, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 10: تكنولوجيا",
    dimensions: 12,
    words: [
      { text: "انترنت", clue: "شبكة المعلومات العالمية", row: 4, col: 2, direction: "across", clueType: "standard" },
      { text: "روبوت", clue: "إنسان آلي", row: 2, col: 5, direction: "down", clueType: "standard" },
      { text: "شاشة", clue: "تعرض الصورة", row: 6, col: 1, direction: "across", clueType: "standard" },
      { text: "ماوس", clue: "فأرة الكمبيوتر", row: 4, col: 8, direction: "down", clueType: "standard" },
      { text: "برمجة", clue: "كتابة الأكواد", row: 8, col: 3, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 11: الفواكه والخضروات",
    dimensions: 11,
    words: [
      { text: "تفاح", clue: "فاكهة حمراء أو خضراء", row: 2, col: 3, direction: "across", clueType: "standard" },
      { text: "رمان", clue: "فاكهة بداخلها حبوب حمراء", row: 1, col: 5, direction: "down", clueType: "standard" },
      { text: "خيار", clue: "خضار لونه أخضر", row: 4, col: 2, direction: "across", clueType: "standard" },
      { text: "جزر", clue: "يقوي النظر (كما يقال)", row: 2, col: 7, direction: "down", clueType: "standard" },
      { text: "بطيخ", clue: "فاكهة صيفية كبيرة", row: 6, col: 4, direction: "across", clueType: "standard" }
    ]
  },
  {
    title: "المستوى 12: الألوان",
    dimensions: 10,
    words: [
      { text: "احمر", clue: "لون الدم", row: 3, col: 3, direction: "across", clueType: "standard" },
      { text: "اسود", clue: "لون الليل الحالك", row: 1, col: 4, direction: "down", clueType: "standard" },
      { text: "ابيض", clue: "لون السلام", row: 5, col: 1, direction: "across", clueType: "standard" },
      { text: "ازرق", clue: "لون السماء", row: 3, col: 6, direction: "down", clueType: "standard" },
      { text: "اصفر", clue: "لون الليمون", row: 7, col: 2, direction: "across", clueType: "standard" }
    ]
  }
];
