import consola from "consola";

import lyricSite from "./lyricSite";

class JLyric extends lyricSite {
  constructor(searchArtist) {
    super(searchArtist);

    this.name = "J-Lyric";
    this.searchUrl = "http://search.j-lyric.net/index.php?ex=on&ct=2&ca=2&cl=2&ka=" + searchArtist;
  }

  async search(page) {
    await page.goto(this.searchUrl, {waitUntil: "domcontentloaded"});

    // アーティストの完全一致を調べる用
    const artistList = await page.evaluate(() => {
      const listSelector = "#mnb > div > p.mid > a";
      const list = Array.from(document.querySelectorAll(listSelector));
      return list.map(data => data.innerText);
    });

    const artistSelector = await fetchContainsSelector(this.searchArtist, artistList);

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

async function fetchContainsSelector(artist, artistList) {
  // 完全一致で一致したアーティストをクリックする
  let index = artistList.indexOf(artist);
  // TODO アーティストいなかった時はエラーメッセージ出して終わらせたい
  if(index == -1) {
    consola.error("完全一致するアーティストがいません");
    process.exit(1);
  }

  return "#mnb > div:nth-child(" + (index + 2) + ") > p.mid > a";
}

export default JLyric;