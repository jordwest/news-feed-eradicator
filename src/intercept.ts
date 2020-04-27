/**
 * This script should run at document start to set up
 * intercepts before FB loads.
 */

import disableInfiniteScroll from './lib/disable-infinite-scroll';
import { setupRouteChange } from './lib/route-change';

disableInfiniteScroll();
setupRouteChange();
