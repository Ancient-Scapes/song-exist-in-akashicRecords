import Karaoke from "./karaoke";

class Joysound extends Karaoke {
  constructor(searchArtist) {
    super(searchArtist);

    this.name = "JoySound";
    this.searchUrl = "https://www.joysound.com/web/search/artist?keyword=";
  }

  async search(page) {

  }

  async fetchArtistSongs(page) {

  }

  async _fetchLastIndex(page) {

  }
}

export default Joysound;