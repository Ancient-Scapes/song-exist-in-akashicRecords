const puppeteer = require('puppeteer');

// 細かい処理などの退避先
const helper = require('./helper');

const JOY_SEARCH_URL = "";
const DAM_SEARCH_URL = "https://www.clubdam.com/app/search/searchKaraokeKeywordArtist.html";

// メイン処理
(async() => {
  const browser = await puppeteer.launch();

  console.log(process.argv);
  
  // カラオケサイトをスクレイピング
  // const result = await scrapingKaraoke(browser);

  // 比較サイト、サービスをスクレイピング


  // スクレイピング結果を比較

  // 比較結果をコンソールに出力

  browser.close();
})();


async function scrapingKaraoke(browser, type) {
  var result = [];
  var page = await browser.newPage();

  return result;
}

async function scrapingService(browser, type) {
  var result = [];
  var page = await browser.newPage();

  return result;
}