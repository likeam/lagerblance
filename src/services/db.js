import { DB_NAME, DB_VERSION, STORES } from "../utils/constants";

let db = null;

export function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(STORES.CATEGORIES)) {
        d.createObjectStore(STORES.CATEGORIES, { keyPath: "id" });
      }
      if (!d.objectStoreNames.contains(STORES.SUBCATEGORIES)) {
        d.createObjectStore(STORES.SUBCATEGORIES, { keyPath: "id" });
      }
      if (!d.objectStoreNames.contains(STORES.PRODUCTS)) {
        d.createObjectStore(STORES.PRODUCTS, { keyPath: "id" });
      }
      if (!d.objectStoreNames.contains(STORES.CLIENTS)) {
        d.createObjectStore(STORES.CLIENTS, { keyPath: "id" });
      }
      if (!d.objectStoreNames.contains(STORES.SUPPLIERS)) {
        d.createObjectStore(STORES.SUPPLIERS, { keyPath: "id" });
      }
      if (!d.objectStoreNames.contains(STORES.SALES)) {
        d.createObjectStore(STORES.SALES, { keyPath: "id" });
      }
      if (!d.objectStoreNames.contains(STORES.PURCHASES)) {
        d.createObjectStore(STORES.PURCHASES, { keyPath: "id" });
      }
    };
    req.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

export function dbAdd(store, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).add(data);
    req.onsuccess = () => resolve(data);
    req.onerror = () => reject(req.error);
  });
}

export function dbPut(store, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).put(data);
    req.onsuccess = () => resolve(data);
    req.onerror = () => reject(req.error);
  });
}

export function dbDelete(store, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const req = tx.objectStore(store).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export function dbGetAll(store) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function dbGet(store, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
