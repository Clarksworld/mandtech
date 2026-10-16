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
}

interface InquiryContextType {
  inquiryItems: InquiryItem[];
  addToInquiry: (item: InquiryItem) => void;
  removeFromInquiry: (id: string | number) => void;
  clearInquiry: () => void;
  isInInquiry: (id: string | number) => boolean;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiryItems));
    } catch (e) {
      console.warn('Unable to persist inquiry basket', e);
    }
  }, [inquiryItems]);

  const addToInquiry = (item: InquiryItem) => {
    setInquiryItems((prev) => {
      const exists = prev.some((i) => String(i.id) === String(item.id) && i.type === item.type);
      if (exists) return prev;
      return [...prev, item];
    });
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

  return (
    <InquiryContext.Provider
      value={{
        inquiryItems,
        addToInquiry,
        removeFromInquiry,
        clearInquiry,
        isInInquiry,
        globalSearch,
        setGlobalSearch,
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
