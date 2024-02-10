import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/services/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data: latestMusicChartData, error: errorLatestMusicChartData } =
    await supabase
      .from("music_chart_data")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

  if (errorLatestMusicChartData) {
    return res.status(500).json({ error: errorLatestMusicChartData.message });
  }
  if (!latestMusicChartData) {
    return res.status(404).json({ message: "Not found" });
  }

  const { data, error } = await supabase
    .from("music_chart_data")
    .select("*")
    .eq("created_at", latestMusicChartData.created_at)
    .order("rank", { ascending: false });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    return res.status(404).json({ message: "Not found" });
  }
  return res
    .status(200)
    .json({ updated_at: latestMusicChartData.created_at, chart: data });
};

export default handler;
