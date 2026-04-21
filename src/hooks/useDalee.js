import { useState, useEffect } from 'react';
import { getBusiness, getAvailableSlots } from '../api/db';

export const useDalee = (businessId, date) => {
  const [business, setBusiness] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;
    const fetchData = async () => {
      setLoading(true);
      const bizData = await getBusiness(businessId);
      setBusiness(bizData);
      
      if (date) {
        const slotsData = await getAvailableSlots(businessId, date);
        setSlots(slotsData);
      }
      setLoading(false);
    };
    fetchData();
  }, [businessId, date]);

  return { business, slots, loading };
};