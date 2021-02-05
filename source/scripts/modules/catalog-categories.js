import $ from "jquery";

const DURATION = 500;

const ActiveClass = {
  CATEGORY: `catalog__category--active`,
  CHAPTERS_LIST: `catalog__chapters-list--active`,
  CHAPTER: `catalog__chapter--checked`,
};

const init = () => {
  const categoryLabel = $(`.catalog__path-item--category`);

  $(`.catalog__category`).each((index, category) => {
    category = $(category);
    const chaptersList = category.next(`.catalog__chapters-list`);

    let chaptersHeight = 0;
    chaptersList.height(chaptersList.height());

    category.on(`click`, () => {
      const oldActiveNode = $(`.${ActiveClass.CATEGORY}`);
      oldActiveNode.removeClass(ActiveClass.CATEGORY);
      oldActiveNode.attr(`disabled`, false);

      const oldActiveChaptersList = $(`.${ActiveClass.CHAPTERS_LIST}`);
      oldActiveChaptersList.removeClass(ActiveClass.CHAPTERS_LIST);
      oldActiveChaptersList.attr(`disabled`, false);
      oldActiveChaptersList.height(oldActiveChaptersList.height()).animate({height: 0}, DURATION);

      category.addClass(ActiveClass.CATEGORY);
      category.attr(`disabled`, true);
      categoryLabel.text(category.text());

      chaptersList.addClass(ActiveClass.CHAPTERS_LIST);
      chaptersList.css(`height`, `auto`);
      chaptersHeight = chaptersList.height();
      chaptersList.height(0);
      chaptersList.height(0).animate({height: chaptersHeight}, DURATION);
    });
  });

  $(`.catalog__chapter`).each((index, chapter) => {
    chapter = $(chapter);

    chapter.on(`click`, () => {
      const oldActiveChapter = $(`.${ActiveClass.CHAPTER}`);
      oldActiveChapter.removeClass(ActiveClass.CHAPTER);
      oldActiveChapter.attr(`disabled`, false);

      chapter.addClass(ActiveClass.CHAPTER);
      chapter.attr(`disabled`, true);
    });
  });
};

export {
  init,
};
