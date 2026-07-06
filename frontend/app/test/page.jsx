"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TestPage() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("cameras")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    testConnection();
  }, []);

  return <div>Testing Supabase...</div>;
}