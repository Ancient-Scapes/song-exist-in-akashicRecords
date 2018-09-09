import Karaoke from "./class/karaoke";
import puppeteer from "puppeteer";
import $ from "jquery";

const KARAOKE = {
  JOYSOUND: {
    SEARCH_URL : "https://www.joysound.com/web/search/artist?keyword="
  },
  DAM: {
    SEARCH_URL : "https://www.clubdam.com/app/search/searchKaraokeKeywordArtist.html"
  }
};

// メイン処理
(async() => {
  // const browser = await puppeteer.launch({headless:false});
  const browser = await puppeteer.launch();

  const artist = process.argv[2];
  const karaokeType = process.argv[3];

  let karaoke = new Karaoke(browser, 
                            karaokeType, 
                            KARAOKE[karaokeType]["SEARCH_URL"], 
                            artist);

  await karaoke.fetchAllSong();
  // カラオケサイトをスクレイピングし、曲を返す

  // 比較サイト、サービスをスクレイピング

  // スクレイピング結果を比較

  // 比較結果をコンソールに出力

  browser.close();
})();

// /**
//  * 全記事ページを対象にスクレイピングを行う
//  *
//  * @param {object} browser 開いているブラウザ
//  * @returns スクレイピング結果
//  */
// async function scraping(browser) {
//   var result = [];
//   var page = await browser.newPage();
//   const lastPageIndex = await helper.fetchPageListLastIndex(browser);

//   for (var i = 0; i < lastPageIndex; i++) {
//     console.log((i + 1) + "ページ目");
//     await page.goto(NEWS_PAGING_URL + (i + 1), {waitUntil: "domcontentloaded"});
//     const linkList = await helper.fetchPageAllLink(page);

//     for (var j = 0; j < linkList.length; j++) {
//       console.log((j + 1) + "記事目");
//       result.push(await scrapingPageLinkEach(browser, linkList[j]));
//     }
//   }
//   return result;
// }

// /**
//  * 記事一覧ページの長さを取得する(ループに使う用)
//  *
//  * @param {object} browser 開いているブラウザ
//  * @returns 記事一覧ページの数(ex.28)
//  */
// exports.fetchPageListLastIndex = async function (browser) {
//   var page = await browser.newPage();
//   await page.goto(NEWS_URL, {waitUntil: "domcontentloaded"});

//   const lastIndex = await page.evaluate(() => {
//     const selector = "body > div.wrapper > main > div > div > nav > ul > li:nth-child(7)";
//     return document.querySelector(selector).textContent;
//   });
  
//   await page.close();
  
//   return lastIndex;
// }
