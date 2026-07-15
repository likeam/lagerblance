import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  openDB,
  dbGetAll,
  dbAdd,
  dbPut,
  dbDelete,
  dbGet,
} from "../services/db";
import { seedData } from "../services/seedData";
import { STORES } from "../utils/constants";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s, p, cl, su, sa, pu] = await Promise.all([
        dbGetAll(STORES.CATEGORIES),
        dbGetAll(STORES.SUBCATEGORIES),
        dbGetAll(STORES.PRODUCTS),
        dbGetAll(STORES.CLIENTS),
        dbGetAll(STORES.SUPPLIERS),
        dbGetAll(STORES.SALES),
        dbGetAll(STORES.PURCHASES),
      ]);
      setCategories(c || []);
      setSubcategories(s || []);
      setProducts(p || []);
      setClients(cl || []);
      setSuppliers(su || []);
      setSales(sa || []);
      setPurchases(pu || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    openDB()
      .then(() => seedData())
      .then(() => refreshAll());
  }, [refreshAll]);

  const value = {
    categories,
    subcategories,
    products,
    clients,
    suppliers,
    sales,
    purchases,
    loading,
    refreshAll,
    dbAdd,
    dbPut,
    dbDelete,
    dbGetAll,
    dbGet,
    generateId: () =>
      Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => React.useContext(AppContext);
