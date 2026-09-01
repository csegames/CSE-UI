import DefaultImgSrc from '../images/news/post-image.png';
import { ListenerHandle } from '../lib/ListenerHandle';
import { RetryTracker } from '../lib/RetryTracker';
import { onPostLoadFailed, onPostsLoaded, Post, setLoadCallback } from '../redux/blogSlice';
import { ExternalDataSource } from '../redux/externalDataSource';
import { BlogType } from '../redux/navigationSlice';

const POSTS_PER_PAGE = 3;
const START_DELAY = 1000;
const MAX_DELAY = 60000;
const BASE_URL = 'https://www.camelotunchained.com/wp-json/wp/v2/posts?context=view';

interface RenderedObject {
  rendered: string;
}

interface BlogEntry {
  id: number;
  title: RenderedObject;
  content: RenderedObject;
  date: string;
}

export class BlogDataSource extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.loadNext('news', 0),
      await this.loadNext('patch-notes', 0),
      setLoadCallback(this.loadNext.bind(this))
    ];
  }

  async loadNext(type: BlogType, offset: number): Promise<ListenerHandle> {
    const retry = RetryTracker.create(START_DELAY, MAX_DELAY);
    const page = Math.floor(offset / POSTS_PER_PAGE) + 1;
    const url = `${BASE_URL}&categories=${type === 'patch-notes' ? 16 : 7}&per_page=${POSTS_PER_PAGE}&page=${page}`;
    this.doLoad(type, url, retry);
    return retry;
  }

  async doLoad(type: BlogType, url: string, retry: RetryTracker): Promise<void> {
    const resp = await fetch(url);
    if (!resp.ok) {
      window.setTimeout(() => this.doLoad(type, url, retry), 0);
      return;
    }

    try {
      const result = [];
      const entries = (await resp.json()) as BlogEntry[];
      for (const entry of entries) {
        result.push(this.convert(type, entry));
      }
      this.dispatch(onPostsLoaded(result));
    } catch {
      this.dispatch(onPostLoadFailed(type));
    }
  }

  convert(type: BlogType, entry: BlogEntry): Post {
    return {
      type,
      id: entry.id,
      title: entry.title.rendered,
      content: entry.content.rendered,
      posted: new Date(entry.date),
      imgSrc: this.getGalleryImageURL(entry)
    };
  }

  getGalleryImageURL(entry: BlogEntry): string {
    // convert the raw content to a DOM tree and find the largest image
    // to represent this post in our gallery
    let selected = DefaultImgSrc;
    let maxWidth = 0;
    try {
      const div = document.createElement('div');
      div.innerHTML = entry.content.rendered;
      const imgs = div.getElementsByTagName('img');
      for (let index = 0; index < imgs.length; ++index) {
        const img = imgs[index];
        if (img.width > maxWidth) {
          maxWidth = img.width;
          selected = img.src;
        }
      }
    } catch (e) {
      // no operation, return our default
      console.error(e);
    }
    return selected;
  }
}
