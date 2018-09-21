import consola from "consola";

import helper from "../helper";
import Karaoke from "./karaoke";

class Joysound extends Karaoke {

  constructor(searchArtist) {
    super(searchArtist);

    this.name = "JoySound";
    this.searchUrl = "https://www.joysound.com/web/search/artist?keyword=" + encodeURI(searchArtist);
  }

  async search(page) {
    const s_artistList = "#searchresult > ul > li > div > a > div > div.jp-cmp-text > h3";

    await page.goto(this.searchUrl, {waitUntil: "networkidle2"});
    
    // 検索して引っかかったアーティストの一覧を表示する
    const artistList     = await helper.fetchEvaluateTextArray(page, s_artistList);
    const artistSelector = await fetchContainsSelector(this.searchArtist, artistList);
    
    // アーティストのページへ遷移
    await helper.clickSelector(page, artistSelector);
  }

  async fetchArtistSongs(page) {
    const s_songList = "#songlist > div.jp-cmp-music-list-001.jp-cmp-music-list-song-002 > ul > li > div > a > h3";

    const lastIndex  = await fetchLastIndex(page);
    let songsResult  = [];

    for (let i = 0; i < lastIndex; i++) {
      // ページ内の曲をすべて配列で取得
      const songs = await helper.fetchEvaluateTextArray(page, s_songList);
      await songsResult.push(songs);

      // 次のページ行く
      let nextPageQuery = "?startIndex=" + (20 * (i + 1)) + "#songlist";
      await page.goto(page.url() + nextPageQuery, {waitUntil: "networkidle2"});
    }
    // ページごとに区切られた2次元配列を1次元にして返す
    // JOYSOUNDは「[MV]イオ／ユナイト」みたいな感じで後ろにアーティスト名ついてるので曲名だけ抜く
    return Array.prototype.concat.apply([], songsResult).map(song => song.match(/.*(?=／)/g)[0]);
  }
}

async function fetchLastIndex(page) {
  const s_caption = "#songlist > nav > div.jp-cmp-sp-none > ol > li:last-child > a";
  return helper.fetchEvaluateText(page, s_caption);
}

async function fetchContainsSelector(artist, artistList) {
  // 完全一致で一致したアーティストをクリックする
  let index = artistList.indexOf(artist);
  if(index == -1) {
    consola.error("完全一致するアーティストがいません");
    process.exit(1);
  }
  return "#searchresult > ul > li:nth-child(" + (index + 1) + ") > div > a > div > div.jp-cmp-text > h3";
}

export default Joysound;