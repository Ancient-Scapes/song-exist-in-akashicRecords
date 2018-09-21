import puppeteer from "puppeteer";
import consola   from "consola";

import helper    from "./helper";
import LyricSite from "./class/lyricSite";
import Karaoke   from "./class/karaoke";

// メイン処理
(async() => {
  const browser     = await puppeteer.launch({
    ignoreHTTPSErrors: true
  });
  let page          = await browser.newPage();
  await pageLoadSetting(page);

  // コマンドライン引数からパラメータを取得
  const artist      = helper.getArtist(process.argv[2]);
  const karaokeType = process.argv[3];
  let karaoke       = helper.getKaraoke(artist, karaokeType);
  let lyricSite     = helper.getLyricSite(artist);

  // カラオケサイトから曲を取得
  await fetchAllSongKaraoke(page, karaoke);
  
  // 歌詞サイトから曲を取得
  await fetchAllSongLyricSite(page, lyricSite);
  // カラオケの曲配列と歌詞サイトの曲配列を比較し差分配列を作成
  const result = await compareSongResult(karaoke, lyricSite);

  // 差分配列をコンソールに出力する
  await outputResult(result, karaoke);
  browser.close();
})();

/**
 * アーティストのカラオケの曲一覧を1次元配列で取得する
 *
 * @param {object}  browser 使用ブラウザ
 * @param {Karaoke} karaoke カラオケclass
 */
async function fetchAllSongKaraoke(page, karaoke) {
  consola.start("カラオケ処理開始");

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
async function fetchAllSongLyricSite(page, lyricSite) {
  consola.start("歌詞サイト処理開始");

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
  // 曲名の比較用配列を作成する
  let karaokeSongList = karaoke.songList.map((song) => helper.sanitizeSongName(song));
  
  // 歌詞サイトの曲一覧からカラオケの曲一覧にない曲を抽出
  return lyricSite.songList.filter(songLyricSite => 
    // 歌詞サイトも曲も一時的に比較用文字列に変換
    karaokeSongList.indexOf(helper.sanitizeSongName(songLyricSite)) === -1
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

/**
 * ページ読み込み時の設定を行う
 *
 * @param {*} page
 */
async function pageLoadSetting(page) {
  // 画像、CSS、フォント、scriptの読み込みをしない指定で高速化
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });
}