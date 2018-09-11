import Karaoke from "./karaoke";

class Dam extends Karaoke{

  constructor(searchArtist) {
    super(searchArtist);

    this.name = "DAM";
    this.searchUrl = "https://www.clubdam.com/app/search/searchKaraokeKeywordArtist.html";
  }

  async search(page) {
  // DAMの場合検索ページにアーティストを入力してボタン押下
    const artistSelector = 'a[href^="/app/leaf/artistKaraokeLeaf.html?artistCode="]';
    
    await page.type("#keyword", this.searchArtist);
    await Promise.all([
      page.click("#searchBtn"),
      page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"}),
    ]);

    // アーティストのページへ遷移
    await Promise.all([
      page.click(artistSelector),
      page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"}),
    ]);
  }

  async fetchArtistSongs(page) {
    let songsResult = [];
    const lastIndex = await this._fetchLastIndex(page);
    const nextSelector = "#content > div.inner > div:nth-child(4) > div > a:last-child";

    for (let i = 0; i < lastIndex; i++) {
      // ページ内の曲をすべて配列で取得
      const songs = await page.evaluate(() => {
        const listSelector = "table.list > tbody > tr > td.song > a";
        const list = Array.from(document.querySelectorAll(listSelector));
        return list.map(data => data.innerText);
      });

      await songsResult.push(songs);

      // 次のページ行く
      await Promise.all([
        page.click(nextSelector),
        page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"}),
      ]);
    }
    return songsResult;
  }

  async _fetchLastIndex(page) {
    // 正規表現で抜きだす用の文字列を取得する
    let captionStr = await page.evaluate(() => {
      const selector = "#content > div.inner > div:nth-child(2) > div.searchResult.clearfix > p:nth-child(2)";
      return document.querySelector(selector).textContent;
    });
    
    // 正規表現で最後のページの数字を抜き出す
    return captionStr.match(/[\d]{1,2}/g)[1];
  }
}

export default Dam;