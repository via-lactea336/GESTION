import { useState, useEffect } from "react";
export function useCalendar() {
  const [maxDate, setMaxDate] = useState("");
  const [maxDateTime, setMaxDateTime] = useState("");
  // Set max date to today
  useEffect(() => {
    const today = new Date().toISOString();
    setMaxDateTime(today);
    setMaxDate(today.split("T")[0]);
  }, []);
  return { maxDate, maxDateTime };
}
