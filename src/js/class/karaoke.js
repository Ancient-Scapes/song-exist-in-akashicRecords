class Karaoke {

  constructor(name, searchUrl, searchArtist) {
    this.name = name;
    this.searchUrl = searchUrl;
    this.searchArtist = searchArtist;

    this.songList = [];
    this.artistUrl = "";
  }

  async search(page) {
    let artistSelector = "";

    // DAMの場合検索ページにアーティストを入力してボタン押下
    if(isDAM(this.name)) {
      artistSelector = 'a[href^="/app/leaf/artistKaraokeLeaf.html?artistCode="]';
      
      await page.type("#keyword", this.searchArtist);
      await Promise.all([
        page.click("#searchBtn"),
        page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"}),
      ]);
    }
    if(isJoysound(this.name)) {
      // URLから直接検索する

    }

    // アーティストのページへ遷移
    await Promise.all([
      page.click(artistSelector),
      page.waitForNavigation({timeout: 60000, waitUntil: "domcontentloaded"}),
    ]);
  }

  async fetchArtistSongs(page) {
    let songsResult = [];
    let lastIndex = this._fetchLastIndex(page);
    let nextSelector = "#content > div.inner > div:nth-child(4) > div > a:last-child";
    
    // for (let i = 0; i < lastIndex; i++) {
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
    // }
    return songsResult;
  }

  async _fetchLastIndex(page) {
    let lastIndex = 0;
    if (isDAM(this.name)) {
      // 正規表現で抜きだす用の文字列を取得する
      const captionStr = await page.evaluate(() => {
        const selector = "#content > div.inner > div:nth-child(2) > div.searchResult.clearfix > p:nth-child(2)";
        return document.querySelector(selector).textContent;
      });
      // 正規表現で最後のページの数字を抜き出す
      lastIndex = captionStr.match(/[\d]{1,2}/g)[1];
    }

    if (isJoysound(this.name)) {
      
    }

    return lastIndex;
  }

}

// TODO 文字を全部大文字にして判定
function isDAM(karaokeType) {
  return karaokeType === "DAM" ? true : false;
}

function isJoysound(karaokeType) {
  return karaokeType === "Joysound" ? true : false;
}

export default Karaoke;