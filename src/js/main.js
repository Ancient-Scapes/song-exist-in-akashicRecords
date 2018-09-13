import puppeteer from "puppeteer";
import consola   from "consola";

import helper    from "./helper";
import jLyric    from "./class/jLyric";

import LyricSite from "./class/lyricSite";
import Karaoke   from "./class/karaoke";

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


/**
 * アーティストのカラオケの曲一覧を1次元配列で取得する
 *
 * @param {object}  browser 使用ブラウザ
 * @param {Karaoke} karaoke カラオケclass
 */
async function fetchAllSongKaraoke(browser, karaoke) {
  consola.start("カラオケ処理開始");

  let page = await browser.newPage();
  await karaoke.search(page);
  karaoke.songList = await karaoke.fetchArtistSongs(page);

  consola.success("カラオケ取得完了");
}

/**
 * アーティストの歌詞サイトの曲一覧を1次元配列で取得する
 *
 * @param {object}    browser   使用ブラウザ
 * @param {LyricSite} lyricSite 歌詞サイトclass
 */
async function fetchAllSongLyricSite(browser, lyricSite) {
  consola.start("歌詞サイト処理開始");

  let page = await browser.newPage();
  await lyricSite.search(page);
  lyricSite.songList = await lyricSite.fetchArtistSongs(page);

  consola.success("歌詞サイト取得完了");
}

/**
 * カラオケの曲一覧と歌詞サイトの曲一覧を比較して差分の配列を返す
 *
 * @param {Karaoke}   karaoke   カラオケclass
 * @param {LyricSite} lyricSite 歌詞サイトclass
 * @returns カラオケに入ってない曲の1次元配列
 */
async function compareSongResult(karaoke, lyricSite) {
  // 曲のスペースをお互いに詰めてから比較する
  let karaokeSongList = karaoke.songList.map(song => helper.sanitizeSong(song));
  
  // 歌詞サイトの曲一覧からDAMの曲一覧にない曲を抽出
  return lyricSite.songList.filter(songLyricSite => 
    karaokeSongList.indexOf(helper.sanitizeSong(songLyricSite)) == -1
  );
}

/**
 * 結果を出力する
 *
 * @param {Array} result カラオケに入ってない曲の1次元配列
 * @param {Karaoke} karaoke カラオケclass
 */
async function outputResult(result, karaoke) {
  consola.success(karaoke.searchArtist + "の" + karaoke.name + "に入っていない曲リスト");
  console.log(result);
}

