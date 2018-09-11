import puppeteer from "puppeteer";
import Dam from "./class/dam";
import Joysound from "./class/dam";

// メイン処理
(async() => {
  const browser = await puppeteer.launch();

  const artist = process.argv[2];
  const karaokeType = process.argv[3];

  let karaoke = null;

  if (isDam(karaokeType)) {
    karaoke = new Dam(artist);
  } 
  else if(isJoysound(karaokeType)) {
    karaoke = new Joysound(artist);
  }

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

  console.log(karaoke.songList);
}

// TODO 文字を全部大文字にして判定
function isDam(karaokeType) {
  return karaokeType === "DAM" ? true : false;
}

function isJoysound(karaokeType) {
  return karaokeType === "Joysound" ? true : false;
}

