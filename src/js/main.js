import puppeteer from "puppeteer";
import consola   from "consola";

import helper    from "./helper";
import jLyric    from "./class/jLyric";

// メイン処理
(async() => {
  const browser = await puppeteer.launch();

  const artist      = helper.getArtist(process.argv[2]);
  const karaokeType = process.argv[3];

  let karaoke = helper.getKaraoke(artist, karaokeType);
  let lyricSite = new jLyric(artist);

  // カラオケサイトをスクレイピングし、曲を返す
  await fetchAllSongKaraoke(browser, karaoke);

  // 比較サイト、サービスをスクレイピング
  await fetchAllSongLyricSite(browser, lyricSite);

  // スクレイピング結果を比較し、カラオケにない曲リストをもらう
  const result = await compareSongResult(karaoke, lyricSite);

  // コンソールに出力する
  await outputResult(result, karaoke);

  browser.close();
})();

async function fetchAllSongKaraoke(browser, karaoke) {
  consola.start("カラオケ処理開始");

  let page = await browser.newPage();
  await karaoke.search(page);
  karaoke.songList = await karaoke.fetchArtistSongs(page);

  consola.success("カラオケ取得完了");
}

async function fetchAllSongLyricSite(browser, lyricSite) {
  consola.start("歌詞サイト処理開始");

  let page = await browser.newPage();
  await lyricSite.search(page);
  lyricSite.songList = await lyricSite.fetchArtistSongs(page);

  consola.success("歌詞サイト取得完了");
}

async function compareSongResult(karaoke, lyricSite) {
  // 歌詞サイトにない曲かつ、カラオケの独自の曲以外を返す
  return karaoke.songList.filter(songKaraoke => 
    lyricSite.songList.indexOf(songKaraoke) == -1 &&
     (songKaraoke.indexOf("生音") == -1    &&
      songKaraoke.indexOf("プロオケ") == -1 &&
      songKaraoke.indexOf("まま音") == -1   )
  );  
}

async function outputResult(result, karaoke) {
  consola.success(karaoke.searchArtist + "の" + karaoke.name + "に入っていない曲リスト");
  console.log(result);
}

