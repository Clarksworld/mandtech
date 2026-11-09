import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InquiryItem {
  id: string | number;
  title: string;
  category: string;
  type: 'equipment' | 'part' | 'lease';
  sku?: string;
  specSummary?: string;
  image?: string;
  brand?: string;
  quantity?: number;
  price?: number;
}

interface InquiryContextType {
  inquiryItems: InquiryItem[];
  addToInquiry: (item: InquiryItem) => void;
  updateQuantity: (id: string | number, qty: number) => void;
  removeFromInquiry: (id: string | number) => void;
  clearInquiry: () => void;
  isInInquiry: (id: string | number) => boolean;
  getItemQuantity: (id: string | number) => number;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  cartToast: string | null;
  clearCartToast: () => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

const STORAGE_KEY = 'mandtech_inquiry_basket';

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [cartToast, setCartToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiryItems));
    } catch (e) {
      console.warn('Unable to persist inquiry basket', e);
    }
  }, [inquiryItems]);

  const addToInquiry = (item: InquiryItem) => {
    const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;
    setInquiryItems((prev) => {
      const idx = prev.findIndex((i) => String(i.id) === String(item.id) && i.type === item.type);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: (copy[idx].quantity || 1) + qtyToAdd,
        };
        return copy;
      }
      return [...prev, { ...item, quantity: qtyToAdd }];
    });

    setCartToast(item.title);
    setTimeout(() => {
      setCartToast(null);
    }, 3500);
  };

  const updateQuantity = (id: string | number, qty: number) => {
    if (qty <= 0) {
      removeFromInquiry(id);
      return;
    }
    setInquiryItems((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromInquiry = (id: string | number) => {
    setInquiryItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  };

  const clearInquiry = () => {
    setInquiryItems([]);
  };

  const isInInquiry = (id: string | number) => {
    return inquiryItems.some((i) => String(i.id) === String(id));
  };

  const getItemQuantity = (id: string | number) => {
    const item = inquiryItems.find((i) => String(i.id) === String(id));
    return item?.quantity || 0;
  };

  const clearCartToast = () => {
    setCartToast(null);
  };

  return (
    <InquiryContext.Provider
      value={{
        inquiryItems,
        addToInquiry,
        updateQuantity,
        removeFromInquiry,
        clearInquiry,
        isInInquiry,
        getItemQuantity,
        globalSearch,
        setGlobalSearch,
        cartToast,
        clearCartToast,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useInquiry = () => {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
};
