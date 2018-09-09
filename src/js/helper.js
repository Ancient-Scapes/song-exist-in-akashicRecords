const NEWS_URL = "https://nba.rakuten.co.jp/news/article/";

/**
 * 個別記事ページ内の必要な情報を抽出し返す
 *
 * @param {object} page 記事個別ページ
 * @returns 記事情報json
 */
exports.fetchNewsEachEvalute = async function (page) {
  const info = await page.evaluate(() => {
    var retInfo = {
      "title"        : null, // タイトル
      "lead"         : null, // 見出し
      "mainText"     : null, // 本文
      "releaseDate"  : null, // 公開日付、時刻
      "image"        : null  // 使用している画像
    };

    const mainArticle          = "body > div.wrapper > div.nbaNews-layout-article-container > div > article > ";
    const titleSelector        = mainArticle + "h1";
    const leadSelector         = mainArticle + "div.nbaNews-layout-article-mainData > h2";
    const mainTextSelector     = mainArticle + "div.nbaNews-layout-article-mainData > p";
    const releaseDateSelector  = mainArticle + "div.nbaNews-layout-article-mainData > time";
    const imageSelector        = mainArticle + "figure > img";

    retInfo.title        = document.querySelector(titleSelector)       ? document.querySelector(titleSelector).textContent                           : "-";
    retInfo.lead         = document.querySelector(leadSelector)        ? document.querySelector(leadSelector).textContent                            : "-" ;
    retInfo.mainText     = document.querySelectorAll(mainTextSelector) ? joinPtagMainText(document.querySelectorAll(mainTextSelector))               : "-";
    retInfo.releaseDate  = document.querySelector(releaseDateSelector) ? document.querySelector(releaseDateSelector).textContent.replace(/\s+/g, "") : "-";
    retInfo.image        = document.querySelector(imageSelector)       ? document.querySelector(imageSelector).src                                   : "-";

    return retInfo;

    /**
     * 本文テキストをpタグごとに改行して結合する
     *
     * @param {object} dom 本文pタグすべて
     * @returns 本文のテキストをpタグごとに区切った配列を返す
     */
    function joinPtagMainText(pTagDoms) {
      var mainText = [];
    
      for (var i = 0; i < pTagDoms.length; i++) {
        mainText[i] = pTagDoms[i].textContent;
      }
      return mainText.join('\n\n');
    }
  });
  
  return info;
}

/**
 * 記事一覧ページの長さを取得する(ループに使う用)
 *
 * @param {object} browser 開いているブラウザ
 * @returns 記事一覧ページの数(ex.28)
 */
exports.fetchPageListLastIndex = async function (browser) {
  var page = await browser.newPage();
  await page.goto(NEWS_URL, {waitUntil: "domcontentloaded"});

  const lastIndex = await page.evaluate(() => {
    const selector = "body > div.wrapper > main > div > div > nav > ul > li:nth-child(7)";
    return document.querySelector(selector).textContent;
  });
  
  await page.close();
  
  return lastIndex;
}

/**
 * 記事一覧ページのリンクを全て取得し配列で返す
 *
 * @param {object} page 記事一覧ページ
 * @returns 記事のリンク一覧配列
 */
exports.fetchPageAllLink = async function (page) {
  return page.evaluate(() => {
    const dataList = [];
    const nodeList = document.querySelectorAll("article > a");
    nodeList.forEach(_node => {
        dataList.push(_node.href);
    })
    return dataList;
  });
}