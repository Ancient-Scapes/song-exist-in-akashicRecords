import consola from "consola";

import helper from "../helper";
import Karaoke from "./karaoke";

class Dam extends Karaoke{

  constructor(searchArtist) {
    super(searchArtist);

    this.name = "DAM";
    this.searchUrl = "https://www.clubdam.com/app/search/searchKaraokeKeywordArtist.html";
  }

  async search(page) {
    const s_inputArtist  = "#keyword";
    const s_searchButton = "#searchBtn";
    const s_artistList   = "#content > div > table > tbody > tr > td.artist > a";

    // DAMの場合検索ページにアーティストを入力してボタン押下
    await page.goto(this.searchUrl, {waitUntil: "domcontentloaded"});
    
    // 検索して引っかかったアーティストの一覧を表示する
    await page.type(s_inputArtist, this.searchArtist);
    await helper.clickSelector(page, s_searchButton);

    const artistList     = await helper.fetchEvaluateTextArray(page, s_artistList);
    const artistSelector = await fetchContainsSelector(this.searchArtist, artistList);

    // アーティストのページへ遷移
    await helper.clickSelector(page, artistSelector);
  }

  async fetchArtistSongs(page) {
    const s_nextPage = "#content > div.inner > div:nth-child(4) > div > a:last-child";
    const s_songList = "table.list > tbody > tr > td.song > a";

    const lastIndex  = await fetchLastIndex(page);
    let songsResult  = [];

    for (let i = 0; i < lastIndex; i++) {
      // ページ内の曲をすべて配列で取得
      const songs = await helper.fetchEvaluateTextArray(page, s_songList);
      await songsResult.push(songs);

      // 次のページ行く
      await helper.clickSelector(page, s_nextPage);
    }
    // ページごとに区切られた2次元配列を1次元にして返す
    return Array.prototype.concat.apply([], songsResult);
  }
}

async function fetchLastIndex(page) {
  const s_caption = "#content > div.inner > div:nth-child(2) > div.searchResult.clearfix > p:nth-child(2)";
  
  // 正規表現で抜きだす用の文字列を取得する
  let captionStr = await helper.fetchEvaluateText(page, s_caption);
  // 正規表現で最後のページの数字を抜き出す
  return captionStr.match(/[\d]{1,2}/g)[1];
}

async function fetchContainsSelector(artist, artistList) {
  // 完全一致で一致したアーティストをクリックする
  let index = artistList.indexOf(artist);
  if(index == -1) {
    consola.error("完全一致するアーティストがいません");
    process.exit(1);
  }
  return "#content > div > table > tbody > tr:nth-child(" + (index + 1) + ") > td.artist > a";
}

export default Dam;