const VIDEO_URL = "https://www.youtube.com/watch?v=";
const EMBED_URL = "https://www.youtube.com/embed/";
const VIDEO_EURL = "https://youtube.googleapis.com/v/";
const THUMBNAIL_URL = "https://i.ytimg.com/vi/";
const INFO_HOST = "www.youtube.com";
const INFO_PATH = "/get_video_info";
const KEYS_TO_SPLIT = ["keywords", "fmt_list", "fexp", "watermark"];

var url = VIDEO_URL + id + "&hl=" + (options.lang || "en");

// embed test if url doesnt work not sure if needed
// let url = EMBED_URL + id + "?hl=" + (options.lang || "en");

