import jaconv from "jaconv";

import Dam from "./class/dam";
import Joysound from "./class/joysound";

exports.getKaraoke = function(artist ,karaokeType) {
  if(karaokeType == "DAM")      return new Dam(artist);
  if(karaokeType == "JOYSOUND") return new Joysound(artist);
}

exports.getArtist = function(artist) {
  if(artist.indexOf("_") != -1) {
    return artist.split("_").join(" ");
  }
  else {
    return artist;
  }
};

exports.sanitizeSong = function(song) {
  // 記号の全角、半角を統一
  let retSong = jaconv.normalize(song);
  // スペースの数をあわせる
  retSong = retSong.split(" ").join("");

  return retSong;
}
