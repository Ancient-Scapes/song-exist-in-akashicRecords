# song-exist-in-AkashicRecords

## アカシックレコードにアクセスし、歌手ごとのカラオケに存在しない曲を抽出するやつ

![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

<img src="./readme_picture/result.png" width="60%">

# Description(概要)

歌手ごとのカラオケに入っていない曲を抽出してきて出力します。

現状カラオケ機種はDAMしか対応していません(2018/09/12)

Acquire songs that are not in singer's japanese karaoke(DAM or JoySound).

# Requirements(動作環境)

- MacOS X High Sierra 

# Installation(セットアップ方法)

- `npm install` or `yarn install`  

# Usage(使用方法)

- `npm run start アーティスト名 カラオケ機種(j or d)`
- `yarn start アーティスト名 カラオケ機種(j or d)`

- `npm run start artistName karaokeType(j or d)`
- `yarn start artistName karaokeType(j or d)`

- j means JoySound.
- d means DAM.

## example(例)

-  `yarn start ViViD DAM`
-  `yarn start Plastic_Tree DAM`

# Song Source(曲取得元)
- [JoySound](https://www.joysound.com/web/search/artist/8583)
- [DAM](https://www.clubdam.com/app/leaf/artistKaraokeLeaf.html?artistCode=306474)
- [歌ネット](https://www.uta-net.com/search/?Aselect=1&Keyword=%E3%82%B7%E3%83%89&Bselect=4&x=30&y=18)

# Q&A

- アーティスト名にスペースが含まれる場合は？
  - スペース( )をアンダーバー(_)に置き換えて入力してください。
- If the artist name contains a space？(ex.Plastic Tree)
  - Please replace space( ) with underscore(_).

# Licence(ライセンス)

This software is released under the MIT License, see LICENSE.

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

# Authors(作者)

SugarShootingStar(@_Ancient_Scapes)