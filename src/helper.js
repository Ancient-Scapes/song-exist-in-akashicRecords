import jaconv from "jaconv";
import consola   from "consola";

import Dam from "./class/dam";
import Joysound from "./class/joysound";

import Utanet from "./class/utanet";
import JLyric from "./class/jLyric";

exports.getKaraoke = function(artist, karaokeType) {
  if(karaokeType == "d") return new Dam(artist);
  if(karaokeType == "j") return new Joysound(artist);

  // 入力された数値がDAMでもJOYSOUNDでもない文字列の場合
  consola.error(karaokeType + "はカラオケ機種ではありません。DAMかJOYSOUNDで選択してください。");
  process.exit(1);
}

exports.getLyricSite = function(artist) {
  return new Utanet(artist);
}

// 曲名を比較用文字列に変換する
exports.sanitizeSongName = function(song) {
  // 記号の全角、半角を統一
  let retSong = jaconv.normalize(song);
  // スペースの数をあわせる
  retSong = retSong.split(" ").join("");

  return retSong;
}

exports.fetchEvaluateText = async function(page, nodeSelector) {
  return page.evaluate((selector) => {
    return document.querySelector(selector).textContent;
  }, nodeSelector);
}

exports.fetchEvaluateTextArray = async function(page, listSelector) {
  return page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list.map((data) => data.innerText);
  }, listSelector);
}

exports.clickSelector = async function(page, selector) {
  return Promise.all([
    page.click(selector),
    page.waitForNavigation({timeout: 60000, waitUntil: "networkidle2"}),
  ]);
}