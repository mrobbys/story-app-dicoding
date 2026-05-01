import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import HomePage from '../pages/home/home-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import NewPage from '../pages/new/new-page';
import BookmarksPage from '../pages/bookmarks/bookmarks-page';

import { checkUnauthenticatedRouteOnly, checkAuthenticatedRoute } from '../utils/auth';

export const routes = {
  // auth routes
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  // app routes
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/new': () => checkAuthenticatedRoute(new NewPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/bookmarks': () => checkAuthenticatedRoute(new BookmarksPage()),
};
