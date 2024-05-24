import { useState, useEffect } from "react";
export function useCalendar() {
  const [maxDate, setMaxDate] = useState("");
  // Set max date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMaxDate(today);
  }, []);
  return { maxDate };
}
