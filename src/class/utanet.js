import consola from "consola";

import helper from "../helper";

import lyricSite from "./lyricSite";

class Utanet extends lyricSite {
  constructor(searchArtist) {
    super(searchArtist);

    this.name = "歌ネット";
    this.searchUrl = "https://www.uta-net.com/search/?Keyword=" + encodeURI(this.searchArtist) + "&x=35&y=8&Aselect=1&Bselect=4";
  }

  async search(page) {
    await page.goto(this.searchUrl, {waitUntil: "domcontentloaded"});
  }

  async fetchArtistSongs(page) {
    const s_songList = "#ichiran > div > table > tbody > tr > td.side > a:nth-child(1)";
    // ページ内の曲をすべて配列で取得
    return helper.fetchEvaluateTextArray(page, s_songList);
  }
}

export default Utanet;