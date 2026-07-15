import { STORES } from "../utils/constants";
import { dbAdd, dbGetAll } from "./db";

export async function seedData() {
  const cats = await dbGetAll(STORES.CATEGORIES);
  if (cats.length > 0) return;

  const categoryData = [
    { id: "cat1", name: "الیکٹرانکس", nameEn: "Electronics" },
    { id: "cat2", name: "کپڑے", nameEn: "Clothing" },
    { id: "cat3", name: "کھانے", nameEn: "Food" },
    { id: "cat4", name: "کتابیں", nameEn: "Books" },
  ];
  for (const c of categoryData) await dbAdd(STORES.CATEGORIES, c);

  const subData = [
    {
      id: "sub1",
      categoryId: "cat1",
      name: "موبائل فون",
      nameEn: "Mobile Phones",
    },
    { id: "sub2", categoryId: "cat1", name: "لیپ ٹاپ", nameEn: "Laptops" },
    {
      id: "sub3",
      categoryId: "cat2",
      name: "مردانہ کپڑے",
      nameEn: "Men's Wear",
    },
    {
      id: "sub4",
      categoryId: "cat2",
      name: "خواتین کپڑے",
      nameEn: "Women's Wear",
    },
    { id: "sub5", categoryId: "cat3", name: "پھل", nameEn: "Fruits" },
    { id: "sub6", categoryId: "cat3", name: "سبزیاں", nameEn: "Vegetables" },
    { id: "sub7", categoryId: "cat4", name: "تعلیم", nameEn: "Education" },
    { id: "sub8", categoryId: "cat4", name: "ناول", nameEn: "Novels" },
  ];
  for (const s of subData) await dbAdd(STORES.SUBCATEGORIES, s);

  const productData = [
    {
      id: "p1",
      subcategoryId: "sub1",
      name: "آئی فون 14",
      nameEn: "iPhone 14",
      price: 220000,
      stock: 15,
      barcode: "1001",
    },
    {
      id: "p2",
      subcategoryId: "sub1",
      name: "سام سنگ Galaxy S23",
      nameEn: "Samsung Galaxy S23",
      price: 180000,
      stock: 12,
      barcode: "1002",
    },
    {
      id: "p3",
      subcategoryId: "sub2",
      name: "ڈیل XPS 13",
      nameEn: "Dell XPS 13",
      price: 320000,
      stock: 8,
      barcode: "2001",
    },
    {
      id: "p4",
      subcategoryId: "sub2",
      name: "ایپل MacBook Air",
      nameEn: "Apple MacBook Air",
      price: 280000,
      stock: 6,
      barcode: "2002",
    },
    {
      id: "p5",
      subcategoryId: "sub3",
      name: "مردانہ قمیض",
      nameEn: "Men's Shirt",
      price: 2500,
      stock: 40,
      barcode: "3001",
    },
    {
      id: "p6",
      subcategoryId: "sub3",
      name: "مردانہ پتلون",
      nameEn: "Men's Trousers",
      price: 3500,
      stock: 30,
      barcode: "3002",
    },
    {
      id: "p7",
      subcategoryId: "sub4",
      name: "خواتین کا لباس",
      nameEn: "Women's Dress",
      price: 4500,
      stock: 25,
      barcode: "4001",
    },
    {
      id: "p8",
      subcategoryId: "sub4",
      name: "خواتین اسکارف",
      nameEn: "Women's Scarf",
      price: 1200,
      stock: 50,
      barcode: "4002",
    },
    {
      id: "p9",
      subcategoryId: "sub5",
      name: "سیب",
      nameEn: "Apple",
      price: 200,
      stock: 100,
      barcode: "5001",
    },
    {
      id: "p10",
      subcategoryId: "sub5",
      name: "کیلا",
      nameEn: "Banana",
      price: 150,
      stock: 120,
      barcode: "5002",
    },
    {
      id: "p11",
      subcategoryId: "sub6",
      name: "ٹماٹر",
      nameEn: "Tomato",
      price: 120,
      stock: 80,
      barcode: "6001",
    },
    {
      id: "p12",
      subcategoryId: "sub6",
      name: "آلو",
      nameEn: "Potato",
      price: 80,
      stock: 90,
      barcode: "6002",
    },
    {
      id: "p13",
      subcategoryId: "sub7",
      name: "ریاضی کی کتاب",
      nameEn: "Math Book",
      price: 800,
      stock: 20,
      barcode: "7001",
    },
    {
      id: "p14",
      subcategoryId: "sub7",
      name: "سائنس کی کتاب",
      nameEn: "Science Book",
      price: 900,
      stock: 18,
      barcode: "7002",
    },
    {
      id: "p15",
      subcategoryId: "sub8",
      name: "ناول پاکستان",
      nameEn: "Novel Pakistan",
      price: 600,
      stock: 25,
      barcode: "8001",
    },
    {
      id: "p16",
      subcategoryId: "sub8",
      name: "ناول محبت",
      nameEn: "Novel Love",
      price: 700,
      stock: 22,
      barcode: "8002",
    },
  ];
  for (const p of productData) await dbAdd(STORES.PRODUCTS, p);

  const clients = [
    {
      id: "cl1",
      name: "محمد علی",
      phone: "0300-1234567",
      address: "لاہور",
      balance: 0,
    },
    {
      id: "cl2",
      name: "فاطمہ احمد",
      phone: "0301-7654321",
      address: "کراچی",
      balance: 0,
    },
  ];
  for (const c of clients) await dbAdd(STORES.CLIENTS, c);

  const suppliers = [
    {
      id: "sp1",
      name: "سپلائر 1",
      phone: "042-1234567",
      address: "لاہور",
      balance: 0,
    },
    {
      id: "sp2",
      name: "سپلائر 2",
      phone: "021-7654321",
      address: "کراچی",
      balance: 0,
    },
  ];
  for (const s of suppliers) await dbAdd(STORES.SUPPLIERS, s);

  const sale = {
    id: "sale1",
    invoiceNo: "INV-001",
    clientId: "cl1",
    clientName: "محمد علی",
    items: [
      {
        productId: "p1",
        productName: "آئی فون 14",
        price: 220000,
        qty: 1,
        total: 220000,
      },
      { productId: "p9", productName: "سیب", price: 200, qty: 5, total: 1000 },
    ],
    subtotal: 221000,
    discount: 5,
    discountAmount: 11050,
    total: 209950,
    paid: 209950,
    date: Date.now() - 2 * 86400000,
  };
  await dbAdd(STORES.SALES, sale);

  const purchase = {
    id: "pur1",
    invoiceNo: "PUR-001",
    supplierId: "sp1",
    supplierName: "سپلائر 1",
    items: [
      {
        productId: "p1",
        productName: "آئی فون 14",
        price: 180000,
        qty: 5,
        total: 900000,
      },
      {
        productId: "p2",
        productName: "سام سنگ Galaxy S23",
        price: 150000,
        qty: 3,
        total: 450000,
      },
    ],
    subtotal: 1350000,
    total: 1350000,
    date: Date.now() - 5 * 86400000,
  };
  await dbAdd(STORES.PURCHASES, purchase);

  const existingClients = await dbGetAll(STORES.CLIENTS);
  if (!existingClients.find((c) => c.id === "walkin")) {
    await dbAdd(STORES.CLIENTS, {
      id: "walkin",
      name: "واک ان کسٹمر",
      phone: "",
      address: "",
      balance: 0,
    });
  }
}
