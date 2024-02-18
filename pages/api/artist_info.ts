import { NextApiRequest, NextApiResponse } from "next";

const getAccessToken = async () => {
  let client_id = process.env.SPOTIFY_CLIENT_ID;
  let client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  const apiRequest = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (apiRequest.status !== 200) {
    return false;
  }
  const apiResponse = await apiRequest.json();

  return apiResponse.access_token;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const info: any = {};
  const token = await getAccessToken();

  const artist = req.query.artist;
  console.log(artist);
  const url = `${process.env.SPOTIFY_BASE_URL}/search?q=${artist}&type=artist&limit=1`;
  const apiRequest = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (apiRequest.status !== 200) {
    info.error = "Spotify API error";
  }

  if (apiRequest.status === 200) {
    const apiResponse = await apiRequest.json();

    //Spotify props
    info.thumbnail = apiResponse.artists.items[0].images[0].url;
    info.followers = apiResponse.artists.items[0].followers.total;
    info.genres = apiResponse.artists.items[0].genres;
  }

  const wikiRequest = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${artist}`
  );
  //   if (wikiRequest.status !== 200) {
  //     info.error = "Wikipedia API error";
  //   }

  const wikiResponse = await wikiRequest.json();
  console.log(wikiResponse);
  info.wiki = wikiResponse.extract;

  return res.status(200).json(info);
};

export default handler;
