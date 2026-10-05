import {
  getPortfolioCategories,
  handlePortfolioCategoryClick,
  handleShowMoreClick,
  initGallery,
  initAccordion,
  scrollUp,
  scrollFunction,
  initFeedbacksSwiper,
  handleFormSubmit,
  updateHeaderOnScroll,
  openMenu,
  closeMenu,
} from './js/handlers.js';
import { refs } from './js/refs.js';

initAccordion();
initFeedbacksSwiper();
getPortfolioCategories();
initGallery();

window.addEventListener('scroll', updateHeaderOnScroll);
window.onscroll = function () {
  scrollFunction();
};

refs.menuButton.addEventListener('click', openMenu);
refs.closeButton.addEventListener('click', closeMenu);
refs.mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

refs.portfolioCategoryList.addEventListener(
  'click',
  handlePortfolioCategoryClick
);
refs.portfolioShowMoreBtn.addEventListener('click', handleShowMoreClick);

refs.scrollUpBtn.addEventListener('click', scrollUp);
refs.contactsForm.addEventListener('submit', handleFormSubmit);
