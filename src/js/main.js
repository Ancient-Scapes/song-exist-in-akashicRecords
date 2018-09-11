import puppeteer from "puppeteer";
import Dam from "./class/dam";
import Joysound from "./class/dam";
import jLyric from "./class/jLyric";

// メイン処理
(async() => {
  const browser = await puppeteer.launch();

  const artist = process.argv[2];
  const karaokeType = process.argv[3];

  let karaoke = null;
  let lyricSite = new jLyric(artist);

  if (isDam(karaokeType)) {
    karaoke = new Dam(artist);
  } 
  else if(isJoysound(karaokeType)) {
    karaoke = new Joysound(artist);
  }

  // カラオケサイトをスクレイピングし、曲を返す
  await fetchAllSongKaraoke(browser, karaoke);

  // 比較サイト、サービスをスクレイピング
  await fetchAllSongLyricSite(browser, lyricSite);

  // スクレイピング結果を比較

  // 比較結果をコンソールに出力

  browser.close();
})();

async function fetchAllSongKaraoke(browser, karaoke) {
  let page = await browser.newPage();

  await karaoke.search(page);

  karaoke.songList = await karaoke.fetchArtistSongs(page);

  console.log("カラオケ取得完了");
  console.log(karaoke.songList);
}

async function fetchAllSongLyricSite(browser, lyricSite) {
  let page = await browser.newPage();

  await lyricSite.search(page);

  lyricSite.songList = await lyricSite.fetchArtistSongs(page);

  console.log("歌詞サイト取得完了");
  console.log(lyricSite.songList);
}

// TODO 文字を全部大文字にして判定
function isDam(karaokeType) {
  return karaokeType === "DAM" ? true : false;
}

function isJoysound(karaokeType) {
  return karaokeType === "Joysound" ? true : false;
}

