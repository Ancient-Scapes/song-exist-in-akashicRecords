import Karaoke from "./class/karaoke";
import puppeteer from "puppeteer";

const KARAOKE = {
  JOYSOUND: {
    SEARCH_URL : "https://www.joysound.com/web/search/artist?keyword="
  },
  DAM: {
    SEARCH_URL : "https://www.clubdam.com/app/search/searchKaraokeKeywordArtist.html"
  }
};

// メイン処理
(async() => {
  const browser = await puppeteer.launch();

  const artist = process.argv[2];
  const karaokeType = process.argv[3];

  let karaoke = new Karaoke(karaokeType, 
                            KARAOKE[karaokeType]["SEARCH_URL"], 
                            artist);

  await fetchAllSongKaraoke(browser, karaoke);

  // カラオケサイトをスクレイピングし、曲を返す

  // 比較サイト、サービスをスクレイピング

  // スクレイピング結果を比較

  // 比較結果をコンソールに出力

  browser.close();
})();

async function fetchAllSongKaraoke(browser, karaoke) {
  let page = await browser.newPage();

  await page.goto(karaoke.searchUrl, {waitUntil: "domcontentloaded"});

  await karaoke.search(page);

  karaoke.songList = await karaoke.fetchArtistSongs(page);
}

