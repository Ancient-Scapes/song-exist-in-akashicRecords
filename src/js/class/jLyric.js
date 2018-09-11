import lyricSite from "./lylicSite";

class JLyric extends lyricSite {
  constructor(searchArtist) {
    super(searchArtist);

    this.name = "J-Lyric";
    this.searchUrl = "http://search.j-lyric.net/index.php?ex=on&ct=2&ca=2&cl=2&ka=" + searchArtist;
  }

  async search(page) {
    const artistSelector = "#mnb > div:nth-child(2) > p.mid > a";

    await page.goto(this.searchUrl, {waitUntil: "domcontentloaded"});

    // アーティストのページへ遷移
    await Promise.all([
      page.click(artistSelector),
      page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"}),
    ]);
  }

  async fetchArtistSongs(page) {
    // ページ内の曲をすべて配列で取得
    return page.evaluate(() => {
      const listSelector = "div.bdy > p.ttl > a";
      const list = Array.from(document.querySelectorAll(listSelector));
      return list.map(data => data.textContent);
    });
  }
}

export default JLyric;