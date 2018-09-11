import { Post, PostItem } from '..';
import { PostFilter } from '../components/FilterTabs';

export function getNewsTitle(post: Post) {
  const title = post.title.rendered.split('&#8211;')[0].split('–')[0];
  return title;
}

export function getNewsDate(post: Post) {
  const dateString = new Date(post.date).toLocaleString();
  return dateString;
}

export function getNewsImageInfo(post: Post) {
  let imgSrc: string = 'images/other-bg.png';
  let imgClass: string = 'wide';
  let imgWidth: number = 500;

  const c = document.createElement('div');
  c.innerHTML = post.content.rendered;
  c.getElementsByTagName('img');
  const images = c.getElementsByTagName('img');
  if (images.length > 0) {
    let index = images.length - 1;
    do {
      const img = images[index];
      if (img.width > imgWidth) {
        imgSrc = img.src;
        imgWidth = img.width;
        if (img.width / img.height <= 1) imgClass = 'tall';
        break;
      }
      --index;
    } while (index >= 0);
  }

  return {
    imgSrc,
    imgClass,
  };
}

export function isPatchNote(post: PostItem) {
  return post.type === PostFilter.PatchNotes;
}

export function isNewsPost(post: PostItem) {
  return post.type === PostFilter.News;
}
